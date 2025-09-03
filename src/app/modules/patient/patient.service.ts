import prisma from "../../../config/database";
import { getPaginationMeta, getPaginationParams } from "../../../utils/pagination";
import { AppError } from "../../middlewares/errorHandler";

export class PatientService {
  static async createPatient(patientData: any) {
    const patient = await prisma.patient.create({
      data: patientData
    });
    return patient;
  }

  static async getAllPatients(query: any) {
    const { skip, take, orderBy } = getPaginationParams(query);
    
    const where: any = { isDeleted: false };
    
    // Add filters
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search } }
      ];
    }
    
    if (query.gender) {
      where.gender = query.gender;
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take,
        orderBy
      }),
      prisma.patient.count({ where })
    ]);

    const meta = getPaginationMeta(total, parseInt(query.page) || 1, parseInt(query.limit) || 10);

    return { patients, meta };
  }

  static async getPatientById(id: number) {
    const patient = await prisma.patient.findUnique({
      where: { id, isDeleted: false },
      include: {
        appointments: {
          where: { isDeleted: false },
          include: { doctor: true }
        },
        bills: {
          where: { isDeleted: false }
        },
        medicalRecords: {
          where: { isDeleted: false },
          include: { doctor: true }
        }
      }
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    return patient;
  }

  static async updatePatient(id: number, patientData: any) {
    const patient = await prisma.patient.findUnique({
      where: { id, isDeleted: false }
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: patientData
    });

    return updatedPatient;
  }

  static async deletePatient(id: number) {
    const patient = await prisma.patient.findUnique({
      where: { id, isDeleted: false }
    });

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    await prisma.patient.update({
      where: { id },
      data: { isDeleted: true }
    });

    return { message: 'Patient deleted successfully' };
  }
}