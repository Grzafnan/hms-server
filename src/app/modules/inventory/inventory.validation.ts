import Joi from 'joi';

export const createInventorySchema = Joi.object({
  itemName: Joi.string().min(1).max(100).required(),
  category: Joi.string().valid('Medicine', 'Equipment', 'Supplies').required(),
  quantity: Joi.number().integer().min(0).required(),
  unitPrice: Joi.number().positive().optional(),
  expiryDate: Joi.date().optional()
});
