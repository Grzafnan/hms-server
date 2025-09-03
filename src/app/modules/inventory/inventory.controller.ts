import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorHandler';
import { sendError, sendSuccess } from '../../../utils/response';
import { createInventorySchema } from './inventory.validation';
import { InventoryService } from './inventory.service';

export class InventoryController {
  static createInventoryItem = asyncHandler(async (req: Request, res: Response) => {
    const { error } = createInventorySchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const item = await InventoryService.createInventoryItem(req.body);

    return sendSuccess(res, item, 'Inventory item created successfully', 201);
  });

  static getAllInventoryItems = asyncHandler(async (req: Request, res: Response) => {
    const result = await InventoryService.getAllInventoryItems(req.query);

    return sendSuccess(res, result, 'Inventory items retrieved successfully', 200);
  });

  static updateInventoryItem = asyncHandler(async (req: Request, res: Response) => {
    const updateSchema = createInventorySchema.fork(['itemName', 'category', 'quantity'], (schema) => schema.optional());
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const id = parseInt(req.params.id);
    const item = await InventoryService.updateInventoryItem(id, req.body);

    return sendSuccess(res, item, 'Inventory item updated successfully', 200);
  });
}