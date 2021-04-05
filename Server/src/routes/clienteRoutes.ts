import express, { Router } from 'express';

import clienteController from '../controllers/ClienteController';

class clienteRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', clienteController.list);
        this.router.get('/:id', clienteController.getOne);
        this.router.post('/', clienteController.create);
        this.router.put('/:id', clienteController.update);
        this.router.delete('/:id', clienteController.delete);
    }

}

export default new clienteRoutes().router;
