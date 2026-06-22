"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDetailRepository = void 0;
const prisma_client_1 = __importDefault(require("../../shared/prisma/prisma.client"));
exports.orderDetailRepository = {
    findByOrderId: (orderId) => prisma_client_1.default.orderDetail.findMany({
        where: { orderId },
        include: { product: true },
    }),
    findById: (id) => prisma_client_1.default.orderDetail.findUnique({ where: { id } }),
    create: (data) => prisma_client_1.default.orderDetail.create({ data }),
    createMany: (items) => prisma_client_1.default.orderDetail.createMany({ data: items }),
    remove: (id) => prisma_client_1.default.orderDetail.delete({ where: { id } }),
};
//# sourceMappingURL=order-detail.repository.js.map