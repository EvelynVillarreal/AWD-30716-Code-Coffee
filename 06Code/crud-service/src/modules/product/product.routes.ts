import { Router } from 'express';
import { productController } from './product.controller';

const productRouter = Router();

productRouter.get('/', productController.getAll);
productRouter.get('/:id', productController.getById);
productRouter.post('/', productController.create);
productRouter.put('/:id', productController.update);
productRouter.patch('/:id/stock', productController.updateStock);
productRouter.delete('/:id', productController.remove);

export default productRouter;
