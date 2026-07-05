import { Router } from 'express';
import { shippingController } from './shipping.controller';

const router = Router();

router.get('/', shippingController.getAllConfigs);
router.post('/', shippingController.createConfig);
router.put('/:id', shippingController.updateConfig);
router.delete('/:id', shippingController.deleteConfig);
router.get('/calculate', shippingController.calculateCost);

export default router;
