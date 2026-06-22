"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippingConfigRepository = void 0;
const prisma_client_1 = __importDefault(require("../../shared/prisma/prisma.client"));
exports.shippingConfigRepository = {
    findAll: () => prisma_client_1.default.shippingConfig.findMany({ orderBy: { baseProvince: 'asc' } }),
    findById: (id) => prisma_client_1.default.shippingConfig.findUnique({ where: { id } }),
    findByProvinces: (baseProvince, destinationProvince) => prisma_client_1.default.shippingConfig.findUnique({
        where: { baseProvince_destinationProvince: { baseProvince, destinationProvince } },
    }),
    create: (data) => prisma_client_1.default.shippingConfig.create({ data }),
    update: (id, data) => prisma_client_1.default.shippingConfig.update({ where: { id }, data }),
    remove: (id) => prisma_client_1.default.shippingConfig.delete({ where: { id } }),
};
//# sourceMappingURL=shipping-config.repository.js.map