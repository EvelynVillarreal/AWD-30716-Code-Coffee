"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./shared/middleware/error.middleware");
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const category_routes_1 = __importDefault(require("./modules/category/category.routes"));
const product_routes_1 = __importDefault(require("./modules/product/product.routes"));
const product_photo_routes_1 = __importDefault(require("./modules/product-photo/product-photo.routes"));
const order_routes_1 = __importDefault(require("./modules/order/order.routes"));
const order_detail_routes_1 = __importDefault(require("./modules/order-detail/order-detail.routes"));
const order_status_history_routes_1 = __importDefault(require("./modules/order-status-history/order-status-history.routes"));
const shipping_config_routes_1 = __importDefault(require("./modules/shipping-config/shipping-config.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'crud-service', port: PORT });
});
app.use('/api/users', user_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/product-photos', product_photo_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/order-details', order_detail_routes_1.default);
app.use('/api/order-status-history', order_status_history_routes_1.default);
app.use('/api/shipping-configs', shipping_config_routes_1.default);
app.use(error_middleware_1.errorMiddleware);
app.listen(PORT, () => {
    console.log(`[crud-service] Running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map