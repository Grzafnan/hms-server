import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorHandler';
import { sendError, sendSuccess } from '../../../utils/response';
import { PatientService } from './patient.service';
import { createPatientSchema, updatePatientSchema } from './patient.validation';


export class PatientController {
  static createPatient = asyncHandler(async (req: Request, res: Response) => {
    const { error } = createPatientSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const patient = await PatientService.createPatient(req.body);

    return sendSuccess(res, patient, 'Patient created successfully', 201);
  });

  static getAllPatients = asyncHandler(async (req: Request, res: Response) => {
    const result = await PatientService.getAllPatients(req.query);

    return sendSuccess(res, result, 'Patients retrieved successfully', 200);
  });

  static getPatientById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const patient = await PatientService.getPatientById(id);

    return sendSuccess(res, patient, 'Patient retrieved successfully', 200);
  });

  static updatePatient = asyncHandler(async (req: Request, res: Response) => {
    const { error } = updatePatientSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const id = parseInt(req.params.id);
    const patient = await PatientService.updatePatient(id, req.body);

    return sendSuccess(res, patient, 'Patient updated successfully', 200);
  });

  static deletePatient = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const result = await PatientService.deletePatient(id);

    return sendSuccess(res, result, 'Patient deleted successfully', 200);
  });
}