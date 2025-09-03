import prisma from "../../../config/database";
import { getPaginationMeta, getPaginationParams } from "../../../utils/pagination";
import { AppError } from "../../middlewares/errorHandler";

export class MedicalRecordService {
  static async createMedicalRecord(recordData: any) {
    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({
        where: { id: recordData.patientId, isDeleted: false }
      }),
      prisma.staff.findUnique({
        where: { id: recordData.doctorId, isDeleted: false, role: 'Doctor' }
      })
    ]);

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    const record = await prisma.medicalRecord.create({
      data: recordData,
      include: {
        patient: true,
        doctor: true
      }
    });

    return record;
  }

  static async getAllMedicalRecords(query: any) {
    const { skip, take, orderBy } = getPaginationParams(query);
    
    const where: any = { isDeleted: false };
    
    if (query.patientId) {
      where.patientId = parseInt(query.patientId);
    }
    
    if (query.doctorId) {
      where.doctorId = parseInt(query.doctorId);
    }

    const [records, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          patient: true,
          doctor: true
        }
      }),
      prisma.medicalRecord.count({ where })
    ]);

    const meta = getPaginationMeta(total, parseInt(query.page) || 1, parseInt(query.limit) || 10);

    return { records, meta };
  }

  static async getMedicalRecordById(id: number) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id, isDeleted: false },
      include: {
        patient: true,
        doctor: true
      }
    });

    if (!record) {
      throw new AppError('Medical record not found', 404);
    }

    return record;
  }

  static async updateMedicalRecord(id: number, recordData: any) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id, isDeleted: false }
    });

    if (!record) {
      throw new AppError('Medical record not found', 404);
    }

    const updatedRecord = await prisma.medicalRecord.update({
      where: { id },
      data: recordData,
      include: {
        patient: true,
        doctor: true
      }
    });

    return updatedRecord;
  }

  static async deleteMedicalRecord(id: number) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id, isDeleted: false }
    });

    if (!record) {
      throw new AppError('Medical record not found', 404);
    }

    await prisma.medicalRecord.update({
      where: { id },
      data: { isDeleted: true }
    });

    return { message: 'Medical record deleted successfully' };
  }
}