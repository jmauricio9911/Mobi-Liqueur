import { Request, Response } from 'express';


import pool from '../database';

class PromotionController {

    public async list(req: Request, res: Response): Promise<void> {
        const promotions = await pool.query(`SELECT a.idPromocion, a.Descuento, a.FechaInicio, a.FechaFin, a.Estado, b.Nombre
                                             FROM promocion AS a INNER JOIN producto AS b 
                                             ON a.Producto_idProducto = b.idProducto`);
        res.json(promotions);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const games = await pool.query( `SELECT a.idPromocion, a.Descuento, a.FechaInicio, a.FechaFin, a.Estado, b.Nombre
                                         FROM promocion as a INNER JOIN producto AS b 
                                         on a.Producto_id = b.idProducto where a.idPromocion = ?`, [id]);
        console.log(games.length);
        if (games.length > 0) {
            return res.json(games[0]);
        }
        res.status(404).json({ text: "Promosion indicada no existe" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO promocion set ?', [req.body]);
        res.json({ message: 'Promosion Guardada' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldGame = req.body;
        await pool.query('UPDATE promocion set ? WHERE idPromocion = ?', [req.body, id]);
        res.json({ message: "La promosion se actulizo correctamente" });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM promocion WHERE idPromocion = ?', [id]);
        res.json({ message: "Promosion Eliminada " });
    }
}

const PromotionsController = new PromotionController;
export default PromotionsController;