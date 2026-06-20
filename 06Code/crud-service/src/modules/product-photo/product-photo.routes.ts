import { Router } from 'express';
import { productPhotoController } from './product-photo.controller';

const productPhotoRouter = Router();

productPhotoRouter.get('/product/:productId', productPhotoController.getByProductId);
productPhotoRouter.post('/', productPhotoController.create);
productPhotoRouter.delete('/:id', productPhotoController.remove);

export default productPhotoRouter;
