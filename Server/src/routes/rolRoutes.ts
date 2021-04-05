import express, { Router } from 'express';

import rolController from '../controllers/RolController';

class rolRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', rolController.list);
        this.router.get('/:id', rolController.getOne);
        this.router.post('/', rolController.create);
        this.router.put('/:id', rolController.update);
        this.router.delete('/:id', rolController.delete);
    }

}

export default new rolRoutes().router;

