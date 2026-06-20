import { Router } from 'express';
import { orderController } from './order.controller';
import { requireAuth, requireAdmin } from '../../shared/middleware/auth.middleware';

const orderRouter = Router();

orderRouter.post('/', orderController.placeOrder);
orderRouter.get('/my-orders', requireAuth, orderController.getMyOrders);
orderRouter.get('/reference/:reference', orderController.getByReference);
orderRouter.get('/', requireAdmin, orderController.getAll);
orderRouter.patch('/:id/status', requireAdmin, orderController.changeStatus);
orderRouter.patch('/:id/approve-customized', requireAdmin, orderController.approveCustomized);

export default orderRouter;
