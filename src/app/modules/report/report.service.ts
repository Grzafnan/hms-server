import prisma from "../../../config/database";


export class ReportService {
  static async getPatientReport(query: any) {
    const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();

    const [totalPatients, newPatients, appointments, admissions] = await Promise.all([
      prisma.patient.count({ where: { isDeleted: false } }),
      prisma.patient.count({
        where: {
          isDeleted: false,
          createdAt: { gte: startDate, lte: endDate }
        }
      }),
      prisma.appointment.count({
        where: {
          isDeleted: false,
          appointmentDate: { gte: startDate, lte: endDate }
        }
      }),
      prisma.admission.count({
        where: {
          isDeleted: false,
          admitDate: { gte: startDate, lte: endDate }
        }
      })
    ]);

    return {
      period: { startDate, endDate },
      totalPatients,
      newPatients,
      appointments,
      admissions
    };
  }

  static async getBillingReport(query: any) {
    const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();

    const [totalRevenue, totalOutstanding, totalPaid, recentPayments] = await Promise.all([
      prisma.bill.aggregate({
        where: {
          isDeleted: false,
          createdAt: { gte: startDate, lte: endDate }
        },
        _sum: { totalAmount: true }
      }),
      prisma.bill.aggregate({
        where: {
          isDeleted: false,
          status: 'Unpaid',
          createdAt: { gte: startDate, lte: endDate }
        },
        _sum: { totalAmount: true }
      }),
      prisma.payment.aggregate({
        where: {
          isDeleted: false,
          paymentDate: { gte: startDate, lte: endDate }
        },
        _sum: { amount: true }
      }),
      prisma.payment.findMany({
        where: {
          isDeleted: false,
          paymentDate: { gte: startDate, lte: endDate }
        },
        take: 10,
        orderBy: { paymentDate: 'desc' },
        include: {
          bill: {
            include: {
              patient: true
            }
          }
        }
      })
    ]);

    return {
      period: { startDate, endDate },
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalOutstanding: totalOutstanding._sum.totalAmount || 0,
      totalPaid: totalPaid._sum.amount || 0,
      recentPayments
    };
  }

  static async getInventoryReport(query: any) {
    const threshold = parseInt(query.threshold) || 10;

    const [totalItems, lowStockItems, expiredItems, categories] = await Promise.all([
      prisma.inventory.count({ where: { isDeleted: false } }),
      prisma.inventory.findMany({
        where: {
          isDeleted: false,
          quantity: { lte: threshold }
        }
      }),
      prisma.inventory.findMany({
        where: {
          isDeleted: false,
          expiryDate: { lte: new Date() }
        }
      }),
      prisma.inventory.groupBy({
        by: ['category'],
        where: { isDeleted: false },
        _count: true,
        _sum: { quantity: true }
      })
    ]);

    return {
      totalItems,
      lowStockItems: lowStockItems.length,
      expiredItems: expiredItems.length,
      lowStockDetails: lowStockItems,
      expiredDetails: expiredItems,
      categoryBreakdown: categories
    };
  }
}