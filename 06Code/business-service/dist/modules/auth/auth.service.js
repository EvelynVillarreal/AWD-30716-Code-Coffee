"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crud_client_1 = __importDefault(require("../../shared/http/crud.client"));
const business_errors_1 = require("../../shared/errors/business.errors");
const SALT_ROUNDS = 10;
function generateToken(userId, email, role) {
    const secret = process.env.JWT_SECRET ?? '';
    const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
    return jsonwebtoken_1.default.sign({ userId, email, role }, secret, { expiresIn });
}
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, SALT_ROUNDS);
}
async function comparePasswords(plain, hashed) {
    return bcryptjs_1.default.compare(plain, hashed);
}
exports.authService = {
    register: async (input) => {
        const passwordHash = await hashPassword(input.password);
        const response = await crud_client_1.default.post('/api/users', {
            name: input.name,
            email: input.email,
            passwordHash,
            phone: input.phone,
            address: input.address,
            province: input.province,
            role: 'customer',
        });
        const user = response.data.data;
        const token = generateToken(user.id, user.email, user.role);
        return { user: { ...user, passwordHash: undefined }, token };
    },
    login: async (input) => {
        const response = await crud_client_1.default.get(`/api/users/email/${input.email}`).catch(() => {
            throw new business_errors_1.UnauthorizedError('Invalid email or password');
        });
        const user = response.data.data;
        const passwordMatch = await comparePasswords(input.password, user.passwordHash);
        if (!passwordMatch)
            throw new business_errors_1.UnauthorizedError('Invalid email or password');
        const token = generateToken(user.id, user.email, user.role);
        return { user: { ...user, passwordHash: undefined }, token };
    },
};
//# sourceMappingURL=auth.service.js.map