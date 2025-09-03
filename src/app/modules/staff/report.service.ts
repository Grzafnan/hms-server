import prisma from "../../../config/database";
import { getPaginationMeta, getPaginationParams } from "../../../utils/pagination";
import { AppError } from "../../middlewares/errorHandler";

export class StaffService {
  static async createStaff(staffData: any) {
    const staff = await prisma.staff.create({
      data: staffData
    });
    return staff;
  }

  static async getAllStaff(query: any) {
    const { skip, take, orderBy } = getPaginationParams(query);
    
    const where: any = { isDeleted: false };
    
    // Add filters
    if (query.role) {
      where.role = query.role;
    }
    
    if (query.department) {
      where.department = { contains: query.department, mode: 'insensitive' };
    }
    
    if (query.status) {
      where.status = query.status;
    }

    const [staff, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        skip,
        take,
        orderBy
      }),
      prisma.staff.count({ where })
    ]);

    const meta = getPaginationMeta(total, parseInt(query.page) || 1, parseInt(query.limit) || 10);

    return { staff, meta };
  }

  static async getStaffById(id: number) {
    const staff = await prisma.staff.findUnique({
      where: { id, isDeleted: false },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    });

    if (!staff) {
      throw new AppError('Staff member not found', 404);
    }

    return staff;
  }

  static async updateStaff(id: number, staffData: any) {
    const staff = await prisma.staff.findUnique({
      where: { id, isDeleted: false }
    });

    if (!staff) {
      throw new AppError('Staff member not found', 404);
    }

    const updatedStaff = await prisma.staff.update({
      where: { id },
      data: staffData
    });

    return updatedStaff;
  }

  static async deleteStaff(id: number) {
    const staff = await prisma.staff.findUnique({
      where: { id, isDeleted: false }
    });

    if (!staff) {
      throw new AppError('Staff member not found', 404);
    }

    await prisma.staff.update({
      where: { id },
      data: { isDeleted: true }
    });

    return { message: 'Staff member deleted successfully' };
  }
}