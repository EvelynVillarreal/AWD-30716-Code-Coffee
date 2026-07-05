import { Router } from 'express';
import { productController } from './product.controller';
import { requireAdmin } from '../../shared/middleware/auth.middleware';

const productRouter = Router();

productRouter.get('/categories', productController.getCategories);
productRouter.post('/categories', requireAdmin, productController.createCategory);
productRouter.put('/categories/:id', requireAdmin, productController.updateCategory);
productRouter.delete('/categories/:id', requireAdmin, productController.deleteCategory);

productRouter.get('/', productController.getAll);
productRouter.get('/:id', productController.getById);
productRouter.post('/', requireAdmin, productController.create);
productRouter.put('/:id', requireAdmin, productController.update);
productRouter.patch('/:id/stock', requireAdmin, productController.updateStock);
productRouter.delete('/:id', requireAdmin, productController.remove);

export default productRouter;
