"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./shared/middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const order_routes_1 = __importDefault(require("./modules/order/order.routes"));
const product_routes_1 = __importDefault(require("./modules/product/product.routes"));
const report_routes_1 = __importDefault(require("./modules/report/report.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3002;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'business-service', port: PORT });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use(error_middleware_1.errorMiddleware);
app.listen(PORT, () => {
    console.log(`[business-service] Running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map