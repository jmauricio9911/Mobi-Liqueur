import { Request, Response } from 'express';


import pool from '../database';

class ClientController {

    public async list(req: Request, res: Response): Promise<void> {
        const clientes = await pool.query('SELECT * FROM cliente');
        res.json(clientes);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = await pool.query('SELECT * FROM cliente WHERE id = ?', [id]);
        if (data.length > 0) {
            return res.json(data[0]);
        }
        res.status(404).json({ text: "El cliente no existe" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO cliente set ?', [req.body]);
        res.json({ message: 'El cliente se ha guardado exitosamente' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldData = req.body;
        await pool.query('UPDATE cliente set ? WHERE id = ?', [req.body, id]);
        res.json({ message: "El cliente ha sido actualizado exitosamente" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM cliente WHERE id = ?', [id]);
        res.json({ message: "El cliente ha sido eliminado exitosamente" });
    }
}

const clientController = new ClientController;
export default clientController;