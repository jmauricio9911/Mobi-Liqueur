import express, { Router } from 'express';

import emialController from '../controllers/mailCtrl';

class mailsRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.post('/', emialController.enviarFactura);
        this.router.put('/restorePassword/', emialController.sendRestore);
    }

}

export default new mailsRoutes().router;
