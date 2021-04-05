import express, { Router } from 'express';

import PromotionsController from '../controllers/promotionControllers';

class PromotionsRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', PromotionsController.list);
        this.router.get('/:id', PromotionsController.getOne);
        this.router.post('/', PromotionsController.create);
        this.router.put('/:id', PromotionsController.update);
        this.router.delete('/:id', PromotionsController.delete);
    }

}

export default new PromotionsRoutes().router;

