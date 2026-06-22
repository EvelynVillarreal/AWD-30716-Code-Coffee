"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const orderRouter = (0, express_1.Router)();
orderRouter.get('/', order_controller_1.orderController.getAll);
orderRouter.get('/reference/:reference', order_controller_1.orderController.getByReferenceNumber);
orderRouter.get('/user/:userId', order_controller_1.orderController.getByUserId);
orderRouter.get('/:id', order_controller_1.orderController.getById);
orderRouter.post('/', order_controller_1.orderController.create);
orderRouter.patch('/:id/status', order_controller_1.orderController.updateStatus);
orderRouter.delete('/:id', order_controller_1.orderController.remove);
exports.default = orderRouter;
//# sourceMappingURL=order.routes.js.map