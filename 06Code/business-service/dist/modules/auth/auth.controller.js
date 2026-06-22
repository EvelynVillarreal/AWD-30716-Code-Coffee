"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
exports.authController = {
    register: async (req, res, next) => {
        try {
            const result = await auth_service_1.authService.register(req.body);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const result = await auth_service_1.authService.login(req.body);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    profile: (req, res) => {
        res.json({ success: true, data: req.user });
    },
};
//# sourceMappingURL=auth.controller.js.map