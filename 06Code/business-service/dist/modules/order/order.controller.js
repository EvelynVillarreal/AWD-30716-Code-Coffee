"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_service_1 = require("./order.service");
exports.orderController = {
    placeOrder: async (req, res, next) => {
        try {
            const order = await order_service_1.orderService.placeOrder({
                ...req.body,
                userId: req.user?.userId,
            });
            res.status(201).json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    },
    getAll: async (_req, res, next) => {
        try {
            const orders = await order_service_1.orderService.getAllOrders();
            res.json({ success: true, data: orders });
        }
        catch (error) {
            next(error);
        }
    },
    getMyOrders: async (req, res, next) => {
        try {
            const orders = await order_service_1.orderService.getOrdersByUser(req.user.userId);
            res.json({ success: true, data: orders });
        }
        catch (error) {
            next(error);
        }
    },
    getByReference: async (req, res, next) => {
        try {
            const order = await order_service_1.orderService.getOrderByReference(String(req.params.reference));
            res.json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    },
    changeStatus: async (req, res, next) => {
        try {
            const order = await order_service_1.orderService.changeOrderStatus(Number(req.params.id), req.body.status);
            res.json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    },
    approveCustomized: async (req, res, next) => {
        try {
            const order = await order_service_1.orderService.approveCustomizedOrder(Number(req.params.id));
            res.json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=order.controller.js.map