import { Router } from 'express';
import { orderController } from './order.controller';

const orderRouter = Router();

orderRouter.get('/', orderController.getAll);
orderRouter.get('/reference/:reference', orderController.getByReferenceNumber);
orderRouter.get('/user/:userId', orderController.getByUserId);
orderRouter.get('/:id', orderController.getById);
orderRouter.post('/', orderController.create);
orderRouter.patch('/:id/status', orderController.updateStatus);
orderRouter.delete('/:id', orderController.remove);

export default orderRouter;
