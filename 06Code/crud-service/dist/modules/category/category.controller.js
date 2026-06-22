"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const category_repository_1 = require("./category.repository");
const http_errors_1 = require("../../shared/errors/http.errors");
exports.categoryController = {
    getAll: async (_req, res, next) => {
        try {
            const categories = await category_repository_1.categoryRepository.findAll();
            res.json({ success: true, data: categories });
        }
        catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const category = await category_repository_1.categoryRepository.findById(id);
            if (!category)
                throw new http_errors_1.NotFoundError('Category');
            res.json({ success: true, data: category });
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const existing = await category_repository_1.categoryRepository.findByName(req.body.name);
            if (existing)
                throw new http_errors_1.ConflictError('Category name already exists');
            const category = await category_repository_1.categoryRepository.create(req.body);
            res.status(201).json({ success: true, data: category });
        }
        catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await category_repository_1.categoryRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('Category');
            const category = await category_repository_1.categoryRepository.update(id, req.body);
            res.json({ success: true, data: category });
        }
        catch (error) {
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await category_repository_1.categoryRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('Category');
            await category_repository_1.categoryRepository.remove(id);
            res.json({ success: true, message: 'Category deleted' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=category.controller.js.map