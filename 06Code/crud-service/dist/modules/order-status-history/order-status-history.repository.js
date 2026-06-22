"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusHistoryRepository = void 0;
const prisma_client_1 = __importDefault(require("../../shared/prisma/prisma.client"));
exports.orderStatusHistoryRepository = {
    findByOrderId: (orderId) => prisma_client_1.default.orderStatusHistory.findMany({
        where: { orderId },
        orderBy: { date: 'asc' },
    }),
    create: (data) => prisma_client_1.default.orderStatusHistory.create({ data }),
};
//# sourceMappingURL=order-status-history.repository.js.map