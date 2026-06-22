"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productPhotoRepository = void 0;
const prisma_client_1 = __importDefault(require("../../shared/prisma/prisma.client"));
exports.productPhotoRepository = {
    findByProductId: (productId) => prisma_client_1.default.productPhoto.findMany({
        where: { productId },
        orderBy: { order: 'asc' },
    }),
    findById: (id) => prisma_client_1.default.productPhoto.findUnique({ where: { id } }),
    create: (data) => prisma_client_1.default.productPhoto.create({ data }),
    remove: (id) => prisma_client_1.default.productPhoto.delete({ where: { id } }),
    removeAllByProductId: (productId) => prisma_client_1.default.productPhoto.deleteMany({ where: { productId } }),
};
//# sourceMappingURL=product-photo.repository.js.map