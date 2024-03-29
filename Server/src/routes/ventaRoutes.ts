import express, { Router } from 'express';

import ventaController from '../controllers/VentaController';

class ventaRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/detalle/:fecha', ventaController.list);
        this.router.get('/:id', ventaController.getOne);
        this.router.get('/facturas/:fecha', ventaController.getday);
        this.router.post('/', ventaController.create);
        this.router.post('/detalle',ventaController.createdetalleventa)
        this.router.put('/:id', ventaController.update);
        this.router.delete('/:id', ventaController.delete);
    }

}

export default new ventaRoutes().router;

