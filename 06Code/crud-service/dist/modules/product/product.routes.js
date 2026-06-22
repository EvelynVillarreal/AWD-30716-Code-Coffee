"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const productRouter = (0, express_1.Router)();
productRouter.get('/', product_controller_1.productController.getAll);
productRouter.get('/:id', product_controller_1.productController.getById);
productRouter.post('/', product_controller_1.productController.create);
productRouter.put('/:id', product_controller_1.productController.update);
productRouter.patch('/:id/stock', product_controller_1.productController.updateStock);
productRouter.delete('/:id', product_controller_1.productController.remove);
exports.default = productRouter;
//# sourceMappingURL=product.routes.js.map