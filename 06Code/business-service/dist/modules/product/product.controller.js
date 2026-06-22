"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const product_service_1 = require("./product.service");
exports.productController = {
    getAll: async (req, res, next) => {
        try {
            const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
            const products = await product_service_1.productService.getAllProducts(categoryId);
            res.json({ success: true, data: products });
        }
        catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const product = await product_service_1.productService.getProductById(Number(req.params.id));
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const product = await product_service_1.productService.createProduct(req.body);
            res.status(201).json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const product = await product_service_1.productService.updateProduct(Number(req.params.id), req.body);
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    },
    updateStock: async (req, res, next) => {
        try {
            const product = await product_service_1.productService.updateStock(Number(req.params.id), Number(req.body.stock));
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            await product_service_1.productService.deleteProduct(Number(req.params.id));
            res.json({ success: true, message: 'Product deleted' });
        }
        catch (error) {
            next(error);
        }
    },
    getCategories: async (_req, res, next) => {
        try {
            const categories = await product_service_1.productService.getAllCategories();
            res.json({ success: true, data: categories });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=product.controller.js.map