import { Request, Response } from 'express';
import Joi from 'joi';
import { asyncHandler } from '../../middlewares/errorHandler';
import { sendError, sendSuccess } from '../../../utils/response';
import { BillingService } from './billing.service';
import { createBillSchema, createPaymentSchema } from './billing.validation';

export class BillingController {
  static createBill = asyncHandler(async (req: Request, res: Response) => {
    const { error } = createBillSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const bill = await BillingService.createBill(req.body);

    return sendSuccess(res, bill, 'Bill created successfully', 201);
  });

  static getAllBills = asyncHandler(async (req: Request, res: Response) => {
    const result = await BillingService.getAllBills(req.query);

    return sendSuccess(res, result, 'Bills retrieved successfully', 200);
  });

  static getBillById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const bill = await BillingService.getBillById(id);

    return sendSuccess(res, bill, 'Bill retrieved successfully', 200);
  });

  static updateBill = asyncHandler(async (req: Request, res: Response) => {
    const updateSchema = createBillSchema.fork(['patientId', 'totalAmount'], (schema) => schema.optional())
      .keys({ status: Joi.string().valid('Unpaid', 'Paid', 'Cancelled').optional() });
    
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const id = parseInt(req.params.id);
    const bill = await BillingService.updateBill(id, req.body);

    return sendSuccess(res, bill, 'Bill updated successfully', 200);
  });

  static deleteBill = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const result = await BillingService.deleteBill(id);

    return sendSuccess(res, result, 'Bill deleted successfully', 200);
  });

  static createPayment = asyncHandler(async (req: Request, res: Response) => {
    const { error } = createPaymentSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const payment = await BillingService.createPayment(req.body);

    return sendSuccess(res, payment, 'Payment recorded successfully', 201);
  });
}