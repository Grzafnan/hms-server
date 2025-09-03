import Joi from 'joi';

export const createMedicalRecordSchema = Joi.object({
  patientId: Joi.number().integer().positive().required(),
  doctorId: Joi.number().integer().positive().required(),
  diagnosis: Joi.string().max(2000).optional(),
  treatment: Joi.string().max(2000).optional()
});