import Joi from 'joi';

export const createPrescriptionSchema = Joi.object({
  patientId: Joi.number().integer().positive().required(),
  doctorId: Joi.number().integer().positive().required(),
  items: Joi.array().items(
    Joi.object({
      medicineName: Joi.string().min(1).max(100).required(),
      dosage: Joi.string().max(50).optional(),
      duration: Joi.string().max(50).optional(),
      instructions: Joi.string().max(500).optional()
    })
  ).optional()
});