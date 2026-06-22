"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const product_repository_1 = require("./product.repository");
const http_errors_1 = require("../../shared/errors/http.errors");
exports.productController = {
    getAll: async (req, res, next) => {
        try {
            const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
            const products = await product_repository_1.productRepository.findAll(categoryId);
            res.json({ success: true, data: products });
        }
        catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const product = await product_repository_1.productRepository.findById(id);
            if (!product)
                throw new http_errors_1.NotFoundError('Product');
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const product = await product_repository_1.productRepository.create(req.body);
            res.status(201).json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await product_repository_1.productRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('Product');
            const product = await product_repository_1.productRepository.update(id, req.body);
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    },
    updateStock: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await product_repository_1.productRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('Product');
            const product = await product_repository_1.productRepository.updateStock(id, Number(req.body.stock));
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await product_repository_1.productRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('Product');
            await product_repository_1.productRepository.remove(id);
            res.json({ success: true, message: 'Product deleted' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=product.controller.js.map