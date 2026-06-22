"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRepository = void 0;
const prisma_client_1 = __importDefault(require("../../shared/prisma/prisma.client"));
exports.categoryRepository = {
    findAll: () => prisma_client_1.default.category.findMany({ orderBy: { name: 'asc' } }),
    findById: (id) => prisma_client_1.default.category.findUnique({ where: { id }, include: { products: true } }),
    findByName: (name) => prisma_client_1.default.category.findUnique({ where: { name } }),
    create: (data) => prisma_client_1.default.category.create({ data }),
    update: (id, data) => prisma_client_1.default.category.update({ where: { id }, data }),
    remove: (id) => prisma_client_1.default.category.delete({ where: { id } }),
};
//# sourceMappingURL=category.repository.js.map