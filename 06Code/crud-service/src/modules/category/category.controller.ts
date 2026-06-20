import { Request, Response, NextFunction } from 'express';
import { categoryRepository } from './category.repository';
import { NotFoundError, ConflictError } from '../../shared/errors/http.errors';

export const categoryController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryRepository.findAll();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const category = await categoryRepository.findById(id);

      if (!category) throw new NotFoundError('Category');

      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existing = await categoryRepository.findByName(req.body.name);
      if (existing) throw new ConflictError('Category name already exists');

      const category = await categoryRepository.create(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await categoryRepository.findById(id);

      if (!existing) throw new NotFoundError('Category');

      const category = await categoryRepository.update(id, req.body);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await categoryRepository.findById(id);

      if (!existing) throw new NotFoundError('Category');

      await categoryRepository.remove(id);
      res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
      next(error);
    }
  },
};
