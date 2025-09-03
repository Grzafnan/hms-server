import Joi from 'joi';

export const createBillSchema = Joi.object({
  patientId: Joi.number().integer().positive().required(),
  totalAmount: Joi.number().positive().required()
});

export const createPaymentSchema = Joi.object({
  billId: Joi.number().integer().positive().required(),
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('Cash', 'Card', 'Bkash', 'Nagad', 'Bank Transfer').required()
});
