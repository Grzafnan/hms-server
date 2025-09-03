import { Request, Response } from 'express';
import Joi from 'joi';
import { asyncHandler } from '../../middlewares/errorHandler';
import { createLabTestSchema } from './lab.validation';
import { sendError, sendSuccess } from '../../../utils/response';
import { LabService } from './lab.service';



export class LabController {
  static createLabTest = asyncHandler(async (req: Request, res: Response) => {
    const { error } = createLabTestSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const test = await LabService.createLabTest(req.body);

    return sendSuccess(res, test, 'Lab test created successfully', 201);
  });

  static getAllLabTests = asyncHandler(async (req: Request, res: Response) => {
    const result = await LabService.getAllLabTests(req.query);

    return sendSuccess(res, result, 'Lab tests retrieved successfully', 200);
  });

  static getTestResultsByPatient = asyncHandler(async (req: Request, res: Response) => {
    const patientId = parseInt(req.params.patientId);
    const tests = await LabService.getTestResultsByPatient(patientId);

    return sendSuccess(res, tests, 'Test results retrieved successfully', 200);
  });
}