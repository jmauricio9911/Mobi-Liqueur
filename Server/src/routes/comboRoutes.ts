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
        this.router.get('/detail/:id', comboController.getDetail);
        this.router.post('/', comboController.create);
        this.router.post('/detail/', comboController.createComboProducto);
        this.router.put('/:id', comboController.update);
        this.router.put('/detail/:id', comboController.updateComboProducto);
        this.router.delete('/:id', comboController.delete);
        this.router.delete('/detail/:id', comboController.deleteComboProducto);
    }

}

export default new comboRoutes().router;

