import Joi from 'joi';

export const createLabTestSchema = Joi.object({
  patientId: Joi.number().integer().positive().required(),
  testName: Joi.string().min(1).max(100).required(),
  result: Joi.string().max(2000).optional(),
  status: Joi.string().valid('Pending', 'Completed').optional()
});
