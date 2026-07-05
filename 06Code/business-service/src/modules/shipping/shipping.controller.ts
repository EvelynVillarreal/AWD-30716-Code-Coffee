import { Request, Response, NextFunction } from 'express';
import { shippingService } from './shipping.service';

export const shippingController = {
  getAllConfigs: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await shippingService.getAllConfigs();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  createConfig: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await shippingService.createConfig(req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  updateConfig: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await shippingService.updateConfig(Number(id), req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  deleteConfig: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await shippingService.deleteConfig(Number(id));
      res.json({ success: true, data: { deleted: true } });
    } catch (error) {
      next(error);
    }
  },

  calculateCost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { province } = req.query;
      if (!province || typeof province !== 'string') {
        res.json({ success: true, data: { cost: 0 } });
        return;
      }
      const cost = await shippingService.calculateCost(province);
      res.json({ success: true, data: { cost } });
    } catch (error) {
      next(error);
    }
  }
};
