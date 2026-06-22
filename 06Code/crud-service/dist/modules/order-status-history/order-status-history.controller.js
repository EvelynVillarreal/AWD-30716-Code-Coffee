"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusHistoryController = void 0;
const order_status_history_repository_1 = require("./order-status-history.repository");
exports.orderStatusHistoryController = {
    getByOrderId: async (req, res, next) => {
        try {
            const orderId = Number(req.params.orderId);
            const history = await order_status_history_repository_1.orderStatusHistoryRepository.findByOrderId(orderId);
            res.json({ success: true, data: history });
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const entry = await order_status_history_repository_1.orderStatusHistoryRepository.create(req.body);
            res.status(201).json({ success: true, data: entry });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=order-status-history.controller.js.map