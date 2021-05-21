import { Request, Response } from 'express';


import pool from '../database';

class LoginController {

    public async login(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = await pool.query('SELECT * FROM usuario WHERE Cedula = ?', [id]);
        if (data.length > 0) {
            return res.json(data[0]);
        }
        res.status(404).json({ text: "El usuario no existe" });
    }
}

const loginController = new LoginController;
export default loginController;