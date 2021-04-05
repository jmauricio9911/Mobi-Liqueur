import { Request, Response } from 'express';


import pool from '../database';

class PromotionController {

    public async list(req: Request, res: Response): Promise<void> {
        const promociones = await pool.query('SELECT * FROM promocion');
        res.json(promociones);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = await pool.query('SELECT * FROM promocion WHERE id = ?', [id]);
        if (data.length > 0) {
            return res.json(data[0]);
        }
        res.status(404).json({ text: "La promoción no existe" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO promocion set ?', [req.body]);
        res.json({ message: 'La promoción se ha guardado exitosamente' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldData = req.body;
        await pool.query('UPDATE promocion set ? WHERE id = ?', [req.body, id]);
        res.json({ message: "La promoción ha sido actualizada exitosamente" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM promocion WHERE id = ?', [id]);
        res.json({ message: "La promoción ha sido eliminada exitosamente" });
    }
}

const promotionController = new PromotionController;
export default promotionController;