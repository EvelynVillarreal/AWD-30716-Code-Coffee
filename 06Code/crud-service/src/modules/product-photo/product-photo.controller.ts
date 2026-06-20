import { Request, Response, NextFunction } from 'express';
import { productPhotoRepository } from './product-photo.repository';
import { NotFoundError } from '../../shared/errors/http.errors';

export const productPhotoController = {
  getByProductId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const photos = await productPhotoRepository.findByProductId(productId);
      res.json({ success: true, data: photos });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const photo = await productPhotoRepository.create(req.body);
      res.status(201).json({ success: true, data: photo });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await productPhotoRepository.findById(id);

      if (!existing) throw new NotFoundError('ProductPhoto');

      await productPhotoRepository.remove(id);
      res.json({ success: true, message: 'Photo deleted' });
    } catch (error) {
      next(error);
    }
  },
};
