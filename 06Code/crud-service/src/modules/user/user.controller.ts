import { Request, Response, NextFunction } from 'express';
import { userRepository } from './user.repository';
import { NotFoundError, ConflictError } from '../../shared/errors/http.errors';

export const userController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userRepository.findAll();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await userRepository.findById(id);

      if (!user) throw new NotFoundError('User');

      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  getByEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;
      const user = await userRepository.findByEmail(String(email));

      if (!user) throw new NotFoundError('User');

      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existing = await userRepository.findByEmail(req.body.email);
      if (existing) throw new ConflictError('Email already in use');

      const user = await userRepository.create(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await userRepository.findById(id);

      if (!existing) throw new NotFoundError('User');

      const user = await userRepository.update(id, req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await userRepository.findById(id);

      if (!existing) throw new NotFoundError('User');

      await userRepository.remove(id);
      res.json({ success: true, message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  },
};
