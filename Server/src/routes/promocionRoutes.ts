import express, { Router } from 'express';

import promotionController from '../controllers/PromocionController';

class promotionRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', promotionController.list);
        this.router.get('/:id', promotionController.getOne);
        this.router.post('/', promotionController.create);
        this.router.put('/:id', promotionController.update);
        this.router.delete('/:id', promotionController.delete);
    }

}

export default new promotionRoutes().router;

