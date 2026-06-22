"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_repository_1 = require("./order.repository");
const http_errors_1 = require("../../shared/errors/http.errors");
exports.orderController = {
    getAll: async (_req, res, next) => {
        try {
            const orders = await order_repository_1.orderRepository.findAll();
            res.json({ success: true, data: orders });
        }
        catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const order = await order_repository_1.orderRepository.findById(id);
            if (!order)
                throw new http_errors_1.NotFoundError('Order');
            res.json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    },
    getByReferenceNumber: async (req, res, next) => {
        try {
            const order = await order_repository_1.orderRepository.findByReferenceNumber(String(req.params.reference));
            if (!order)
                throw new http_errors_1.NotFoundError('Order');
            res.json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    },
    getByUserId: async (req, res, next) => {
        try {
            const userId = Number(req.params.userId);
            const orders = await order_repository_1.orderRepository.findByUserId(userId);
            res.json({ success: true, data: orders });
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const order = await order_repository_1.orderRepository.create(req.body);
            res.status(201).json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    },
    updateStatus: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await order_repository_1.orderRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('Order');
            const order = await order_repository_1.orderRepository.updateStatus(id, req.body.status);
            res.json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await order_repository_1.orderRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('Order');
            await order_repository_1.orderRepository.remove(id);
            res.json({ success: true, message: 'Order deleted' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=order.controller.js.map