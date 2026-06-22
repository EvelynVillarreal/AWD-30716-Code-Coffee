"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const orderRouter = (0, express_1.Router)();
orderRouter.post('/', order_controller_1.orderController.placeOrder);
orderRouter.get('/my-orders', auth_middleware_1.requireAuth, order_controller_1.orderController.getMyOrders);
orderRouter.get('/reference/:reference', order_controller_1.orderController.getByReference);
orderRouter.get('/', auth_middleware_1.requireAdmin, order_controller_1.orderController.getAll);
orderRouter.patch('/:id/status', auth_middleware_1.requireAdmin, order_controller_1.orderController.changeStatus);
orderRouter.patch('/:id/approve-customized', auth_middleware_1.requireAdmin, order_controller_1.orderController.approveCustomized);
exports.default = orderRouter;
//# sourceMappingURL=order.routes.js.map