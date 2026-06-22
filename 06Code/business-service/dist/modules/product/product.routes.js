"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const productRouter = (0, express_1.Router)();
productRouter.get('/categories', product_controller_1.productController.getCategories);
productRouter.get('/', product_controller_1.productController.getAll);
productRouter.get('/:id', product_controller_1.productController.getById);
productRouter.post('/', auth_middleware_1.requireAdmin, product_controller_1.productController.create);
productRouter.put('/:id', auth_middleware_1.requireAdmin, product_controller_1.productController.update);
productRouter.patch('/:id/stock', auth_middleware_1.requireAdmin, product_controller_1.productController.updateStock);
productRouter.delete('/:id', auth_middleware_1.requireAdmin, product_controller_1.productController.remove);
exports.default = productRouter;
//# sourceMappingURL=product.routes.js.map