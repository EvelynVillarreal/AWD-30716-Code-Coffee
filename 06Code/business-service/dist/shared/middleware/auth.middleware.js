"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const business_errors_1 = require("../errors/business.errors");
function extractBearerToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new business_errors_1.UnauthorizedError('Missing or invalid authorization header');
    }
    return authHeader.split(' ')[1];
}
function verifyToken(token) {
    const secret = process.env.JWT_SECRET ?? '';
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch {
        throw new business_errors_1.UnauthorizedError('Invalid or expired token');
    }
}
function requireAuth(req, _res, next) {
    try {
        const token = extractBearerToken(req.headers.authorization);
        req.user = verifyToken(token);
        next();
    }
    catch (error) {
        next(error);
    }
}
function requireAdmin(req, res, next) {
    requireAuth(req, res, (error) => {
        if (error)
            return next(error);
        if (req.user?.role !== 'admin')
            return next(new business_errors_1.ForbiddenError('Admin access required'));
        next();
    });
}
//# sourceMappingURL=auth.middleware.js.map