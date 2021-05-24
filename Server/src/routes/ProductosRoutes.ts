import express, { Router } from 'express';

import productoController from '../controllers/ProductosController';

class GameRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/detail/', productoController.listActive);
        this.router.get('/', productoController.list);
        this.router.get('/:id', productoController.getOne);
        this.router.post('/', productoController.create);
        this.router.put('/:id', productoController.update);
        this.router.delete('/:id', productoController.delete);
    }

}

export default new GameRoutes().router;

