import Joi from 'joi';

export const createStaffSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  role: Joi.string().valid('Doctor', 'Nurse', 'Admin', 'Receptionist', 'Lab Technician', 'Pharmacist', 'Radiologist').required(),
  department: Joi.string().max(100).optional(),
  email: Joi.string().email().max(100).optional(),
  phone: Joi.string().min(10).max(20).optional(),
  salary: Joi.number().positive().optional(),
  joinDate: Joi.date().optional()
});