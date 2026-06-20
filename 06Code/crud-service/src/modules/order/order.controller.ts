import { Request, Response, NextFunction } from 'express';
import { orderRepository } from './order.repository';
import { NotFoundError } from '../../shared/errors/http.errors';

export const orderController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await orderRepository.findAll();
      res.json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const order = await orderRepository.findById(id);

      if (!order) throw new NotFoundError('Order');

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  getByReferenceNumber: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderRepository.findByReferenceNumber(String(req.params.reference));

      if (!order) throw new NotFoundError('Order');

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  getByUserId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const orders = await orderRepository.findByUserId(userId);
      res.json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await orderRepository.create(req.body);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await orderRepository.findById(id);

      if (!existing) throw new NotFoundError('Order');

      const order = await orderRepository.updateStatus(id, req.body.status);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await orderRepository.findById(id);

      if (!existing) throw new NotFoundError('Order');

      await orderRepository.remove(id);
      res.json({ success: true, message: 'Order deleted' });
    } catch (error) {
      next(error);
    }
  },
};
