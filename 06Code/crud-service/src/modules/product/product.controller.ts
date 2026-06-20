import { Request, Response, NextFunction } from 'express';
import { productRepository } from './product.repository';
import { NotFoundError } from '../../shared/errors/http.errors';

export const productController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
      const products = await productRepository.findAll(categoryId);
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const product = await productRepository.findById(id);

      if (!product) throw new NotFoundError('Product');

      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productRepository.create(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await productRepository.findById(id);

      if (!existing) throw new NotFoundError('Product');

      const product = await productRepository.update(id, req.body);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  updateStock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await productRepository.findById(id);

      if (!existing) throw new NotFoundError('Product');

      const product = await productRepository.updateStock(id, Number(req.body.stock));
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await productRepository.findById(id);

      if (!existing) throw new NotFoundError('Product');

      await productRepository.remove(id);
      res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
      next(error);
    }
  },
};
