import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { errorMiddleware } from './shared/middleware/error.middleware';
import userRouter from './modules/user/user.routes';
import categoryRouter from './modules/category/category.routes';
import { createProxyMiddleware } from 'http-proxy-middleware';
import productPhotoRouter from './modules/product-photo/product-photo.routes';
import orderRouter from './modules/order/order.routes';
import orderDetailRouter from './modules/order-detail/order-detail.routes';
import orderStatusHistoryRouter from './modules/order-status-history/order-status-history.routes';
import shippingConfigRouter from './modules/shipping-config/shipping-config.routes';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'crud-service', port: PORT });
});

app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);

// Proxy for Product API (handled by Python)
app.use(
  '/api/product',
  createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
  })
);

app.use('/api/product-photo', productPhotoRouter);
app.use('/api/order', orderRouter);
app.use('/api/order-detail', orderDetailRouter);
app.use('/api/order-status-history', orderStatusHistoryRouter);
app.use('/api/shipping-config', shippingConfigRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`[crud-service] Running on http://localhost:${PORT}`);
});

export default app;
