"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRepository = void 0;
const prisma_client_1 = __importDefault(require("../../shared/prisma/prisma.client"));
exports.productRepository = {
    findAll: (categoryId) => prisma_client_1.default.product.findMany({
        where: categoryId ? { categoryId } : undefined,
        include: { category: true, photos: { orderBy: { order: 'asc' } } },
        orderBy: { id: 'asc' },
    }),
    findById: (id) => prisma_client_1.default.product.findUnique({
        where: { id },
        include: { category: true, photos: { orderBy: { order: 'asc' } } },
    }),
    create: (data) => prisma_client_1.default.product.create({
        data,
        include: { category: true },
    }),
    update: (id, data) => prisma_client_1.default.product.update({ where: { id }, data }),
    updateStock: (id, stock) => prisma_client_1.default.product.update({ where: { id }, data: { stock } }),
    remove: (id) => prisma_client_1.default.product.delete({ where: { id } }),
};
//# sourceMappingURL=product.repository.js.map