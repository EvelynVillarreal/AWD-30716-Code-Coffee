import { Request, Response, NextFunction } from 'express';
import { orderStatusHistoryRepository } from './order-status-history.repository';

export const orderStatusHistoryController = {
  getByOrderId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      const history = await orderStatusHistoryRepository.findByOrderId(orderId);
      res.json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const entry = await orderStatusHistoryRepository.create(req.body);
      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },
};
