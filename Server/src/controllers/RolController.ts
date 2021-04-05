import { Request, Response } from 'express';


import pool from '../database';

class RolController {

    public async list(req: Request, res: Response): Promise<void> {
        const roles = await pool.query('SELECT * FROM rol');
        res.json(roles);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = await pool.query('SELECT * FROM rol WHERE id = ?', [id]);
        if (data.length > 0) {
            return res.json(data[0]);
        }
        res.status(404).json({ text: "El rol no existe" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO rol set ?', [req.body]);
        res.json({ message: 'El rol se ha guardado exitosamente' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldData = req.body;
        await pool.query('UPDATE rol set ? WHERE id = ?', [req.body, id]);
        res.json({ message: "El rol ha sido actualizado exitosamente" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM rol WHERE id = ?', [id]);
        res.json({ message: "El rol ha sido eliminado exitosamente" });
    }
}

const rolController = new RolController;
export default rolController;