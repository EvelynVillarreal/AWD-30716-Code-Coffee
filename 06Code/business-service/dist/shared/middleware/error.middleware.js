"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const business_errors_1 = require("../errors/business.errors");
function errorMiddleware(error, _req, res, _next) {
    if (error instanceof business_errors_1.BusinessError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return;
    }
    if (error.statusCode) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return;
    }
    console.error('[UnhandledError]', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
}
//# sourceMappingURL=error.middleware.js.map