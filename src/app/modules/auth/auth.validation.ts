import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  password: Joi.string().min(6).required()
});

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Admin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician', 'Radiologist').required(),
  staffId: Joi.number().integer().positive().optional()
});