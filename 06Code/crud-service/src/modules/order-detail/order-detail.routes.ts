import { Router } from 'express';
import { orderDetailController } from './order-detail.controller';

const orderDetailRouter = Router();

orderDetailRouter.get('/order/:orderId', orderDetailController.getByOrderId);
orderDetailRouter.post('/', orderDetailController.create);
orderDetailRouter.post('/bulk', orderDetailController.createMany);
orderDetailRouter.delete('/:id', orderDetailController.remove);

export default orderDetailRouter;
