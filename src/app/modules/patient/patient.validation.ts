import Joi from 'joi';

export const createPatientSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  dob: Joi.date().required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  phone: Joi.string().min(10).max(20).optional(),
  email: Joi.string().email().max(100).optional(),
  address: Joi.string().max(500).optional()
});

export const updatePatientSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).optional(),
  dob: Joi.date().optional(),
  gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
  phone: Joi.string().min(10).max(20).optional(),
  email: Joi.string().email().max(100).optional(),
  address: Joi.string().max(500).optional()
});