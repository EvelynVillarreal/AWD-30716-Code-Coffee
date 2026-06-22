"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const prisma_client_1 = __importDefault(require("../../shared/prisma/prisma.client"));
exports.userRepository = {
    findAll: () => prisma_client_1.default.user.findMany({ orderBy: { id: 'asc' } }),
    findById: (id) => prisma_client_1.default.user.findUnique({ where: { id } }),
    findByEmail: (email) => prisma_client_1.default.user.findUnique({ where: { email } }),
    create: (data) => prisma_client_1.default.user.create({ data }),
    update: (id, data) => prisma_client_1.default.user.update({ where: { id }, data }),
    remove: (id) => prisma_client_1.default.user.delete({ where: { id } }),
};
//# sourceMappingURL=user.repository.js.map