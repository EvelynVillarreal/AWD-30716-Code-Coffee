"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shipping_config_controller_1 = require("./shipping-config.controller");
const shippingConfigRouter = (0, express_1.Router)();
shippingConfigRouter.get('/', shipping_config_controller_1.shippingConfigController.getAll);
shippingConfigRouter.get('/lookup', shipping_config_controller_1.shippingConfigController.getByProvinces);
shippingConfigRouter.get('/:id', shipping_config_controller_1.shippingConfigController.getById);
shippingConfigRouter.post('/', shipping_config_controller_1.shippingConfigController.create);
shippingConfigRouter.put('/:id', shipping_config_controller_1.shippingConfigController.update);
shippingConfigRouter.delete('/:id', shipping_config_controller_1.shippingConfigController.remove);
exports.default = shippingConfigRouter;
//# sourceMappingURL=shipping-config.routes.js.map