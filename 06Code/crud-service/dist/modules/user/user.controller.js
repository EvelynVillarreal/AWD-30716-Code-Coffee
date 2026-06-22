"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_repository_1 = require("./user.repository");
const http_errors_1 = require("../../shared/errors/http.errors");
exports.userController = {
    getAll: async (_req, res, next) => {
        try {
            const users = await user_repository_1.userRepository.findAll();
            res.json({ success: true, data: users });
        }
        catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const user = await user_repository_1.userRepository.findById(id);
            if (!user)
                throw new http_errors_1.NotFoundError('User');
            res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    },
    getByEmail: async (req, res, next) => {
        try {
            const { email } = req.params;
            const user = await user_repository_1.userRepository.findByEmail(String(email));
            if (!user)
                throw new http_errors_1.NotFoundError('User');
            res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const existing = await user_repository_1.userRepository.findByEmail(req.body.email);
            if (existing)
                throw new http_errors_1.ConflictError('Email already in use');
            const user = await user_repository_1.userRepository.create(req.body);
            res.status(201).json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await user_repository_1.userRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('User');
            const user = await user_repository_1.userRepository.update(id, req.body);
            res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await user_repository_1.userRepository.findById(id);
            if (!existing)
                throw new http_errors_1.NotFoundError('User');
            await user_repository_1.userRepository.remove(id);
            res.json({ success: true, message: 'User deleted' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=user.controller.js.map