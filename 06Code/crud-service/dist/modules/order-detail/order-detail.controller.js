"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDetailController = void 0;
const order_detail_repository_1 = require("./order-detail.repository");
const http_errors_1 = require("../../shared/errors/http.errors");
exports.orderDetailController = {
    getByOrderId: async (req, res, next) => {
        try {
            const orderId = Number(req.params.orderId);
            const details = await order_detail_repository_1.orderDetailRepository.findByOrderId(orderId);
            res.json({ success: true, data: details });
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const detail = await order_detail_repository_1.orderDetailRepository.create(req.body);
            res.status(201).json({ success: true, data: detail });
        }
        catch (error) {
            next(error);
        }
    },
    createMany: async (req, res, next) => {
        try {
            const result = await order_detail_repository_1.orderDetailRepository.createMany(req.body.items);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await order_detail_repository_1.orderDetailRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('OrderDetail');
            await order_detail_repository_1.orderDetailRepository.remove(id);
            res.json({ success: true, message: 'Order detail deleted' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=order-detail.controller.js.map