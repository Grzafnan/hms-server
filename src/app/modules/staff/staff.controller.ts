import { Request, Response } from 'express';
import { StaffService } from './report.service';
import { createStaffSchema } from './staff.validation';
import { asyncHandler } from '../../middlewares/errorHandler';
import { sendError, sendSuccess } from '../../../utils/response';

export class StaffController {
  static createStaff = asyncHandler(async (req: Request, res: Response) => {
    const { error } = createStaffSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const staff = await StaffService.createStaff(req.body);

    return sendSuccess(res, staff, 'Staff member created successfully', 201);
  });

  static getAllStaff = asyncHandler(async (req: Request, res: Response) => {
    const result = await StaffService.getAllStaff(req.query);

    return sendSuccess(res, result, 'Staff retrieved successfully', 200);
  });

  static getStaffById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const staff = await StaffService.getStaffById(id);

    return sendSuccess(res, staff, 'Staff member retrieved successfully', 200);
  });

  static updateStaff = asyncHandler(async (req: Request, res: Response) => {
    const updateSchema = createStaffSchema.fork(['fullName', 'role'], (schema) => schema.optional());
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const id = parseInt(req.params.id);
    const staff = await StaffService.updateStaff(id, req.body);

    return sendSuccess(res, staff, 'Staff member updated successfully', 200);
  });

  static deleteStaff = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const result = await StaffService.deleteStaff(id);

    return sendSuccess(res, result, 'Staff member deleted successfully', 200);
  });
}