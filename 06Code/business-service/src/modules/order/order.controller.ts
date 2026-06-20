import { Request, Response, NextFunction } from 'express';
import { orderService } from './order.service';

export const orderController = {
  placeOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.placeOrder({
        ...req.body,
        userId: req.user?.userId,
      });
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await orderService.getAllOrders();
      res.json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  },

  getMyOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await orderService.getOrdersByUser(req.user!.userId);
      res.json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  },

  getByReference: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.getOrderByReference(String(req.params.reference));
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  changeStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.changeOrderStatus(
        Number(req.params.id),
        req.body.status
      );
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  approveCustomized: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.approveCustomizedOrder(Number(req.params.id));
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },
};
