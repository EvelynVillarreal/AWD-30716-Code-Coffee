import { Router } from 'express';
import { shippingConfigController } from './shipping-config.controller';

const shippingConfigRouter = Router();

shippingConfigRouter.get('/', shippingConfigController.getAll);
shippingConfigRouter.get('/lookup', shippingConfigController.getByProvinces);
shippingConfigRouter.get('/:id', shippingConfigController.getById);
shippingConfigRouter.post('/', shippingConfigController.create);
shippingConfigRouter.put('/:id', shippingConfigController.update);
shippingConfigRouter.delete('/:id', shippingConfigController.remove);

export default shippingConfigRouter;
