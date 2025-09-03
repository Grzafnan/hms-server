import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorHandler';
import { ReportService } from './report.service';
import { sendSuccess } from '../../../utils/response';

export class ReportController {
  static getPatientReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await ReportService.getPatientReport(req.query);

    return sendSuccess(res, report, 'Patient report generated successfully', 200);
  });

  static getBillingReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await ReportService.getBillingReport(req.query);

    return sendSuccess(res, report, 'Billing report generated successfully', 200);
  });

  static getInventoryReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await ReportService.getInventoryReport(req.query);

    return sendSuccess(res, report, 'Inventory report generated successfully', 200);
  });
}