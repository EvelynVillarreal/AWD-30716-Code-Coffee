"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("./report.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const reportRouter = (0, express_1.Router)();
reportRouter.get('/sales', auth_middleware_1.requireAdmin, report_controller_1.reportController.getSalesReport);
exports.default = reportRouter;
//# sourceMappingURL=report.routes.js.map