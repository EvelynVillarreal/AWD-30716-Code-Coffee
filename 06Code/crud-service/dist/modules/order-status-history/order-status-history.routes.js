"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_status_history_controller_1 = require("./order-status-history.controller");
const orderStatusHistoryRouter = (0, express_1.Router)();
orderStatusHistoryRouter.get('/order/:orderId', order_status_history_controller_1.orderStatusHistoryController.getByOrderId);
orderStatusHistoryRouter.post('/', order_status_history_controller_1.orderStatusHistoryController.create);
exports.default = orderStatusHistoryRouter;
//# sourceMappingURL=order-status-history.routes.js.map