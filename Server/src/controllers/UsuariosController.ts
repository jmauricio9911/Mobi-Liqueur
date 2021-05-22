import { Request, Response } from 'express';


import pool from '../database';

class UserController {

    public async list(req: Request, res: Response): Promise<void> {
        const usuarios = await pool.query('SELECT * FROM usuario');
        res.json(usuarios);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = await pool.query('SELECT * FROM usuario WHERE idUsuario = ?', [id]);
        if (data.length > 0) {
            return res.json(data[0]);
        }
        res.status(404).json({ text: "El usuario no existe" });
    
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO usuario set ?', [req.body]);
        res.json({ message: 'El usuario se ha guardado exitosamente' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldData = req.body;
        await pool.query('UPDATE usuario set ? WHERE idUsuario = ?', [req.body, id]);
        res.json({ message: "El usuario ha sido actualizado exitosamente" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM usuario WHERE idUsuario = ?', [id]);
        res.json({ message: "El usuario ha sido eliminado exitosamente" });
    }
}

const userController = new UserController;
export default userController;