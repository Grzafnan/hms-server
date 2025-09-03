import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorHandler';
import { sendError, sendSuccess } from '../../../utils/response';
import { PharmacyService } from './pharmacy.service';
import { createPrescriptionSchema } from './pharmacy.validation';


export class PharmacyController {
  static createPrescription = asyncHandler(async (req: Request, res: Response) => {
    const { error } = createPrescriptionSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const prescription = await PharmacyService.createPrescription(req.body);

    return sendSuccess(res, prescription, 'Prescription created successfully', 201);
  });

  static getAllPrescriptions = asyncHandler(async (req: Request, res: Response) => {
    const result = await PharmacyService.getAllPrescriptions(req.query);

    return sendSuccess(res, result, 'Prescriptions retrieved successfully', 200);
  });
}