import prisma from "../../../config/database";
import { getPaginationMeta, getPaginationParams } from "../../../utils/pagination";
import { AppError } from "../../middlewares/errorHandler";

export class InventoryService {
  static async createInventoryItem(itemData: any) {
    const item = await prisma.inventory.create({
      data: itemData
    });
    return item;
  }

  static async getAllInventoryItems(query: any) {
    const { skip, take, orderBy } = getPaginationParams(query);
    
    const where: any = { isDeleted: false };
    
    if (query.category) {
      where.category = query.category;
    }
    
    if (query.lowStock === 'true') {
      where.quantity = { lte: parseInt(query.threshold) || 10 };
    }
    
    if (query.expired === 'true') {
      where.expiryDate = { lte: new Date() };
    }

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take,
        orderBy
      }),
      prisma.inventory.count({ where })
    ]);

    const meta = getPaginationMeta(total, parseInt(query.page) || 1, parseInt(query.limit) || 10);

    return { items, meta };
  }

  static async updateInventoryItem(id: number, itemData: any) {
    const item = await prisma.inventory.findUnique({
      where: { id, isDeleted: false }
    });

    if (!item) {
      throw new AppError('Inventory item not found', 404);
    }

    const updatedItem = await prisma.inventory.update({
      where: { id },
      data: itemData
    });

    return updatedItem;
  }
}