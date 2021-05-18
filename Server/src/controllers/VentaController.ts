import { Request, Response } from 'express';


import pool from '../database';

class VentaController {

    public async list(req: Request, res: Response): Promise<void> {
        const ventas = await pool.query(`SELECT idFactura, Fecha, Total, Observacion, c.Nombre as cliente FROM venta v INNER JOIN cliente c 
        ON v.Cliente_idCliente = c.idCliente`);
        res.json(ventas);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = await pool.query(`SELECT d.Factura_idFactura AS 'Factura', p.Nombre, d.Cantidad, d.valor, d.Estado
                                        FROM detalleventa d
                                        JOIN venta v ON d.Factura_idFactura=v.idFactura
                                        JOIN producto p ON d.Producto_idProducto=p.idProducto
                                        WHERE d.Factura_idFactura = ?`, [id]);
        if (data.length > 0) {
            return res.json(data);
        }
        res.status(404).json({ text: "La venta no existe" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO venta set ?', [req.body]);
        res.json({ message: 'La venta se ha guardado exitosamente', id: result.insertId });
    }

    public async createdetalleventa(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO detalleventa set ?', [req.body]);
        res.json({ message: 'el detalle se ha guardado exitosamente', status: 'S'});
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