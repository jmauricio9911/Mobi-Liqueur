import { Request, Response } from 'express';


import pool from '../database';

class ComboController {

    public async list(req: Request, res: Response): Promise<void> {
        const combos = await pool.query('SELECT * FROM combo');
        res.json(combos);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = await pool.query('SELECT * FROM combo WHERE idCombo = ?', [id]);
        if (data.length > 0) {
            return res.json(data[0]);
        }
        res.status(404).json({ text: "El combo no existe" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO combo set ?', [req.body]);
        res.json({ message: 'El combo se ha guardado exitosamente' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldData = req.body;
        await pool.query('UPDATE combo set ? WHERE idCombo = ?', [req.body, id]);
        res.json({ message: "El combo ha sido actualizado exitosamente" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM combo WHERE idCombo = ?', [id]);
        res.json({ message: "El combo ha sido eliminado exitosamente" });
    }
}

const comboController = new ComboController;
export default comboController;