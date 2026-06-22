"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_detail_controller_1 = require("./order-detail.controller");
const orderDetailRouter = (0, express_1.Router)();
orderDetailRouter.get('/order/:orderId', order_detail_controller_1.orderDetailController.getByOrderId);
orderDetailRouter.post('/', order_detail_controller_1.orderDetailController.create);
orderDetailRouter.post('/bulk', order_detail_controller_1.orderDetailController.createMany);
orderDetailRouter.delete('/:id', order_detail_controller_1.orderDetailController.remove);
exports.default = orderDetailRouter;
//# sourceMappingURL=order-detail.routes.js.map