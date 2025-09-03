import prisma from "../../../config/database";
import { getPaginationMeta, getPaginationParams } from "../../../utils/pagination";
import { AppError } from "../../middlewares/errorHandler";


export class LabService {
  static async createLabTest(testData: any) {
    const patient = await prisma.patient.findUnique({
      where: { id: testData.patientId, isDeleted: false }
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    const labTest = await prisma.labTest.create({
      data: testData,
      include: {
        patient: true
      }
    });

    return labTest;
  }

  static async getAllLabTests(query: any) {
    const { skip, take, orderBy } = getPaginationParams(query);
    
    const where: any = { isDeleted: false };
    
    if (query.patientId) {
      where.patientId = parseInt(query.patientId);
    }
    
    if (query.status) {
      where.status = query.status;
    }

    const [tests, total] = await Promise.all([
      prisma.labTest.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          patient: true
        }
      }),
      prisma.labTest.count({ where })
    ]);

    const meta = getPaginationMeta(total, parseInt(query.page) || 1, parseInt(query.limit) || 10);

    return { tests, meta };
  }

  static async getTestResultsByPatient(patientId: number) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId, isDeleted: false }
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    const tests = await prisma.labTest.findMany({
      where: {
        patientId,
        isDeleted: false
      },
      orderBy: { testDate: 'desc' },
      include: {
        patient: true
      }
    });

    return tests;
  }
}