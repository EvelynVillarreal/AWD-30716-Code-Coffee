import { Request, Response, NextFunction } from 'express';
import { orderDetailRepository } from './order-detail.repository';
import { NotFoundError } from '../../shared/errors/http.errors';

export const orderDetailController = {
  getByOrderId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      const details = await orderDetailRepository.findByOrderId(orderId);
      res.json({ success: true, data: details });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const detail = await orderDetailRepository.create(req.body);
      res.status(201).json({ success: true, data: detail });
    } catch (error) {
      next(error);
    }
  },

  createMany: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await orderDetailRepository.createMany(req.body.items);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await orderDetailRepository.findById(id);

      if (!existing) throw new NotFoundError('OrderDetail');

      await orderDetailRepository.remove(id);
      res.json({ success: true, message: 'Order detail deleted' });
    } catch (error) {
      next(error);
    }
  },
};
