import { Request, Response } from 'express';


import pool from '../database';

class VentaController {

    public async list(req: Request, res: Response): Promise<void> {
        const ventas = await pool.query('SELECT * FROM venta');
        res.json(ventas);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = await pool.query('SELECT * FROM venta WHERE id = ?', [id]);
        if (data.length > 0) {
            return res.json(data[0]);
        }
        res.status(404).json({ text: "La venta no existe" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO venta set ?', [req.body]);
        res.json({ message: 'La venta se ha guardado exitosamente' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldData = req.body;
        await pool.query('UPDATE venta set ? WHERE id = ?', [req.body, id]);
        res.json({ message: "La venta ha sido actualizada exitosamente" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM venta WHERE id = ?', [id]);
        res.json({ message: "La venta ha sido eliminada exitosamente" });
    }
}

const ventaController = new VentaController;
export default ventaController;