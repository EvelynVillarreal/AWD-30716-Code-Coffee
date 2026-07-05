import { Request, Response, NextFunction } from 'express';
import { productService } from './product.service';

export const productController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
      const products = await productService.getAllProducts(categoryId);
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.getProductById(Number(req.params.id));
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.updateProduct(Number(req.params.id), req.body);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  updateStock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.updateStock(
        Number(req.params.id),
        Number(req.body.stock)
      );
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await productService.deleteProduct(Number(req.params.id));
      res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
      next(error);
    }
  },

  getCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      let categories = await productService.getAllCategories();
      if (!includeInactive) {
        categories = categories.filter((c: any) => c.isActive !== false);
      }
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },

  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await productService.createCategory(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await productService.updateCategory(Number(req.params.id), req.body);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await productService.deleteCategory(Number(req.params.id));
      res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
      next(error);
    }
  },
};
