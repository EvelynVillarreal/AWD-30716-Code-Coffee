"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productPhotoController = void 0;
const product_photo_repository_1 = require("./product-photo.repository");
const http_errors_1 = require("../../shared/errors/http.errors");
exports.productPhotoController = {
    getByProductId: async (req, res, next) => {
        try {
            const productId = Number(req.params.productId);
            const photos = await product_photo_repository_1.productPhotoRepository.findByProductId(productId);
            res.json({ success: true, data: photos });
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const photo = await product_photo_repository_1.productPhotoRepository.create(req.body);
            res.status(201).json({ success: true, data: photo });
        }
        catch (error) {
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await product_photo_repository_1.productPhotoRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('ProductPhoto');
            await product_photo_repository_1.productPhotoRepository.remove(id);
            res.json({ success: true, message: 'Photo deleted' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=product-photo.controller.js.map