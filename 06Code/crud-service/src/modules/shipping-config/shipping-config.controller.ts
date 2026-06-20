import { Request, Response, NextFunction } from 'express';
import { shippingConfigRepository } from './shipping-config.repository';
import { NotFoundError } from '../../shared/errors/http.errors';

export const shippingConfigController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const configs = await shippingConfigRepository.findAll();
      res.json({ success: true, data: configs });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const config = await shippingConfigRepository.findById(id);

      if (!config) throw new NotFoundError('ShippingConfig');

      res.json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  },

  getByProvinces: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { baseProvince, destinationProvince } = req.query as {
        baseProvince: string;
        destinationProvince: string;
      };
      const config = await shippingConfigRepository.findByProvinces(
        baseProvince,
        destinationProvince
      );

      if (!config) throw new NotFoundError('ShippingConfig');

      res.json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const config = await shippingConfigRepository.create(req.body);
      res.status(201).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await shippingConfigRepository.findById(id);

      if (!existing) throw new NotFoundError('ShippingConfig');

      const config = await shippingConfigRepository.update(id, req.body);
      res.json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await shippingConfigRepository.findById(id);

      if (!existing) throw new NotFoundError('ShippingConfig');

      await shippingConfigRepository.remove(id);
      res.json({ success: true, message: 'ShippingConfig deleted' });
    } catch (error) {
      next(error);
    }
  },
};
