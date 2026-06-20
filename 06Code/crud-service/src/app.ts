import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { errorMiddleware } from './shared/middleware/error.middleware';
import userRouter from './modules/user/user.routes';
import categoryRouter from './modules/category/category.routes';
import productRouter from './modules/product/product.routes';
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

app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/product-photos', productPhotoRouter);
app.use('/api/orders', orderRouter);
app.use('/api/order-details', orderDetailRouter);
app.use('/api/order-status-history', orderStatusHistoryRouter);
app.use('/api/shipping-configs', shippingConfigRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`[crud-service] Running on http://localhost:${PORT}`);
});

export default app;
