import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { errorMiddleware } from './shared/middleware/error.middleware';
import authRouter from './modules/auth/auth.routes';
import orderRouter from './modules/order/order.routes';
import productRouter from './modules/product/product.routes';
import reportRouter from './modules/report/report.routes';

const app = express();
const PORT = process.env.PORT ?? 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'business-service', port: PORT });
});

app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);
app.use('/api/reports', reportRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`[business-service] Running on http://localhost:${PORT}`);
});

export default app;
