"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRepository = void 0;
const prisma_client_1 = __importDefault(require("../../shared/prisma/prisma.client"));
exports.orderRepository = {
    findAll: () => prisma_client_1.default.order.findMany({
        include: { details: true, statusHistory: true, user: true },
        orderBy: { createdAt: 'desc' },
    }),
    findById: (id) => prisma_client_1.default.order.findUnique({
        where: { id },
        include: {
            details: { include: { product: true } },
            statusHistory: { orderBy: { date: 'asc' } },
            user: true,
        },
    }),
    findByReferenceNumber: (referenceNumber) => prisma_client_1.default.order.findUnique({
        where: { referenceNumber },
        include: { details: true, statusHistory: true },
    }),
    findByUserId: (userId) => prisma_client_1.default.order.findMany({
        where: { userId },
        include: { details: true, statusHistory: true },
        orderBy: { createdAt: 'desc' },
    }),
    create: (data) => prisma_client_1.default.order.create({ data }),
    updateStatus: (id, status) => prisma_client_1.default.order.update({ where: { id }, data: { status } }),
    remove: (id) => prisma_client_1.default.order.delete({ where: { id } }),
};
//# sourceMappingURL=order.repository.js.map