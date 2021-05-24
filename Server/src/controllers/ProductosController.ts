import { Request, Response } from 'express';


import pool from '../database';

class GamesController {

    public async list(req: Request, res: Response): Promise<void> {
        const productos = await pool.query('SELECT * FROM producto');
        res.json(productos);
    }

    public async listActive(req: Request, res: Response): Promise<void> {
        const productos = await pool.query(`SELECT idProducto, 'producto' AS typeProduct, Nombre, Cantidad, ValorUnitario, NombreImagen  FROM producto p WHERE Estado=1 AND Cantidad > 0
                                            UNION ALL
                                            SELECT idCombo, 'combo' AS typeProduct, Nombre, '---', valor, 'combo.png'  FROM combo c WHERE Estado=1`);
        res.json(productos);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = await pool.query('SELECT * FROM producto WHERE idProducto = ?', [id]);
        if (data.length > 0) {
            return res.json(data[0]);
        }
        res.status(404).json({ text: "El producto consultado no existe." });
    }

    public async create(req: Request, res: Response): Promise<void> {
        // console.log(req.body)
        const result = await pool.query('INSERT INTO producto set ?', [req.body]);
        res.json({ message: 'Se ha creado el producto exitosamente.' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        // const oldGame = req.body;
        await pool.query('UPDATE producto set ? WHERE idProducto = ?', [req.body, id]);
        res.json({ message: "Se ha actualizado el producto exitosamente." });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM producto WHERE idProducto = ?', [id]);
        res.json({ message: "Se ha eliminado el producto exitosamente." });
    }
}

const gamesController = new GamesController;
export default gamesController;