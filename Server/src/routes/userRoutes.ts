import express, { Router } from 'express';

import userController from '../controllers/UsuariosController';

class UserRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', userController.list);
        this.router.get('/:id', userController.getOne);
        this.router.post('/', userController.create);
        this.router.put('/:id', userController.update);
        this.router.delete('/:id', userController.delete);
    }

}

export default new UserRoutes().router;

