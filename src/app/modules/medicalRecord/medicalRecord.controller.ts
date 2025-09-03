import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorHandler';
import { sendError, sendSuccess } from '../../../utils/response';
import { createMedicalRecordSchema } from './medicalRecord.validation';
import { MedicalRecordService } from './medicalRecord.service';

export class MedicalRecordController {
  static createMedicalRecord = asyncHandler(async (req: Request, res: Response) => {
    const { error } = createMedicalRecordSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const record = await MedicalRecordService.createMedicalRecord(req.body);

    return sendSuccess(res, record, 'Medical record created successfully', 201);
  });

  static getAllMedicalRecords = asyncHandler(async (req: Request, res: Response) => {
    const result = await MedicalRecordService.getAllMedicalRecords(req.query);

    return sendSuccess(res, result, 'Medical records retrieved successfully', 200);
  });

  static getMedicalRecordById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const record = await MedicalRecordService.getMedicalRecordById(id);

    return sendSuccess(res, record, 'Medical record retrieved successfully', 200);
  });

  static updateMedicalRecord = asyncHandler(async (req: Request, res: Response) => {
    const updateSchema = createMedicalRecordSchema.fork(['patientId', 'doctorId'], (schema) => schema.optional());
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const id = parseInt(req.params.id);
    const record = await MedicalRecordService.updateMedicalRecord(id, req.body);

    return sendSuccess(res, record, 'Medical record updated successfully', 200);
  });

  static deleteMedicalRecord = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const result = await MedicalRecordService.deleteMedicalRecord(id);

    return sendSuccess(res, result, 'Medical record deleted successfully', 200);
  });
}