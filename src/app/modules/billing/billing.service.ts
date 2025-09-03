import prisma from "../../../config/database";
import { getPaginationMeta, getPaginationParams } from "../../../utils/pagination";
import { AppError } from "../../middlewares/errorHandler";

export class BillingService {
  static async createBill(billData: any) {
    const patient = await prisma.patient.findUnique({
      where: { id: billData.patientId, isDeleted: false }
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    const bill = await prisma.bill.create({
      data: billData,
      include: {
        patient: true
      }
    });

    return bill;
  }

  static async getAllBills(query: any) {
    const { skip, take, orderBy } = getPaginationParams(query);
    
    const where: any = { isDeleted: false };
    
    if (query.patientId) {
      where.patientId = parseInt(query.patientId);
    }
    
    if (query.status) {
      where.status = query.status;
    }

    const [bills, total] = await Promise.all([
      prisma.bill.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          patient: true,
          payments: {
            where: { isDeleted: false }
          }
        }
      }),
      prisma.bill.count({ where })
    ]);

    const meta = getPaginationMeta(total, parseInt(query.page) || 1, parseInt(query.limit) || 10);

    return { bills, meta };
  }

  static async getBillById(id: number) {
    const bill = await prisma.bill.findUnique({
      where: { id, isDeleted: false },
      include: {
        patient: true,
        payments: {
          where: { isDeleted: false }
        }
      }
    });

    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    return bill;
  }

  static async updateBill(id: number, billData: any) {
    const bill = await prisma.bill.findUnique({
      where: { id, isDeleted: false }
    });

    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    const updatedBill = await prisma.bill.update({
      where: { id },
      data: billData,
      include: {
        patient: true,
        payments: {
          where: { isDeleted: false }
        }
      }
    });

    return updatedBill;
  }

  static async deleteBill(id: number) {
    const bill = await prisma.bill.findUnique({
      where: { id, isDeleted: false }
    });

    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    await prisma.bill.update({
      where: { id },
      data: { isDeleted: true }
    });

    return { message: 'Bill deleted successfully' };
  }

  static async createPayment(paymentData: any) {
    const bill = await prisma.bill.findUnique({
      where: { id: paymentData.billId, isDeleted: false }
    });

    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    const payment = await prisma.payment.create({
      data: paymentData,
      include: {
        bill: {
          include: {
            patient: true
          }
        }
      }
    });

    // Update bill status if fully paid
    const totalPaid = await prisma.payment.aggregate({
      where: { billId: paymentData.billId, isDeleted: false },
      _sum: { amount: true }
    });

    if (totalPaid._sum.amount && totalPaid._sum.amount >= bill.totalAmount) {
      await prisma.bill.update({
        where: { id: paymentData.billId },
        data: { status: 'Paid' }
      });
    }

    return payment;
  }
}