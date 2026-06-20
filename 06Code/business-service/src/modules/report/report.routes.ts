import { Router } from 'express';
import { reportController } from './report.controller';
import { requireAdmin } from '../../shared/middleware/auth.middleware';

const reportRouter = Router();

reportRouter.get('/sales', requireAdmin, reportController.getSalesReport);

export default reportRouter;
