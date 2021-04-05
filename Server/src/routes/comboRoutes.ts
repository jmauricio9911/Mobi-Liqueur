import express, { Router } from 'express';

import comboController from '../controllers/ComboController';

class comboRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', comboController.list);
        this.router.get('/:id', comboController.getOne);
        this.router.post('/', comboController.create);
        this.router.put('/:id', comboController.update);
        this.router.delete('/:id', comboController.delete);
    }

}

export default new comboRoutes().router;

