import Joi from 'joi';

export const createAppointmentSchema = Joi.object({
  patientId: Joi.number().integer().positive().required(),
  doctorId: Joi.number().integer().positive().required(),
  appointmentDate: Joi.date().required(),
  notes: Joi.string().max(1000).optional()
});

export const updateAppointmentSchema = Joi.object({
  appointmentDate: Joi.date().optional(),
  status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').optional(),
  notes: Joi.string().max(1000).optional()
});