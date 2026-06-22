"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = void 0;
const report_service_1 = require("./report.service");
exports.reportController = {
    getSalesReport: async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const report = await report_service_1.reportService.getSalesReport(startDate, endDate);
            res.json({ success: true, data: report });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=report.controller.js.map