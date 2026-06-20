import { Router } from 'express';
import { orderStatusHistoryController } from './order-status-history.controller';

const orderStatusHistoryRouter = Router();

orderStatusHistoryRouter.get('/order/:orderId', orderStatusHistoryController.getByOrderId);
orderStatusHistoryRouter.post('/', orderStatusHistoryController.create);

export default orderStatusHistoryRouter;
