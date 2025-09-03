import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorHandler';
import { sendError, sendSuccess } from '../../../utils/response';
import { AppointmentService } from './appointment.service';
import { createAppointmentSchema, updateAppointmentSchema } from './appointment.validation';

export class AppointmentController {
  static createAppointment = asyncHandler(async (req: Request, res: Response) => {
    const { error } = createAppointmentSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const appointment = await AppointmentService.createAppointment(req.body);

    return sendSuccess(res, appointment, 'Appointment created successfully', 201);
  });

  static getAllAppointments = asyncHandler(async (req: Request, res: Response) => {
    const result = await AppointmentService.getAllAppointments(req.query);

    return sendSuccess(res, result, 'Appointments retrieved successfully', 200);
  });

  static getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const appointment = await AppointmentService.getAppointmentById(id);

    return sendSuccess(res, appointment, 'Appointment retrieved successfully', 200);
  });

  static updateAppointment = asyncHandler(async (req: Request, res: Response) => {
    const { error } = updateAppointmentSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const id = parseInt(req.params.id);
    const appointment = await AppointmentService.updateAppointment(id, req.body);

    return sendSuccess(res, appointment, 'Appointment updated successfully', 200);
  });

  static deleteAppointment = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const result = await AppointmentService.deleteAppointment(id);

    return sendSuccess(res, result, 'Appointment cancelled successfully', 200);
  });
}