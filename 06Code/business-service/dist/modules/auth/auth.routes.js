"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const authRouter = (0, express_1.Router)();
authRouter.post('/register', auth_controller_1.authController.register);
authRouter.post('/login', auth_controller_1.authController.login);
authRouter.get('/profile', auth_middleware_1.requireAuth, auth_controller_1.authController.profile);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map