import { Request, Response, NextFunction } from 'express';
import { reportService } from './report.service';

export const reportController = {
  getSalesReport: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
      const report = await reportService.getSalesReport(startDate, endDate);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  },
};
