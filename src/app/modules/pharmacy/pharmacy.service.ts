import prisma from "../../../config/database";
import { getPaginationMeta, getPaginationParams } from "../../../utils/pagination";
import { AppError } from "../../middlewares/errorHandler";

export class PharmacyService {
  static async createPrescription(prescriptionData: any) {
    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({
        where: { id: prescriptionData.patientId, isDeleted: false }
      }),
      prisma.staff.findUnique({
        where: { id: prescriptionData.doctorId, isDeleted: false, role: 'Doctor' }
      })
    ]);

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId: prescriptionData.patientId,
        doctorId: prescriptionData.doctorId,
        prescriptionItems: {
          create: prescriptionData.items || []
        }
      },
      include: {
        patient: true,
        doctor: true,
        prescriptionItems: {
          where: { isDeleted: false }
        }
      }
    });

    return prescription;
  }

  static async getAllPrescriptions(query: any) {
    const { skip, take, orderBy } = getPaginationParams(query);
    
    const where: any = { isDeleted: false };
    
    if (query.patientId) {
      where.patientId = parseInt(query.patientId);
    }
    
    if (query.doctorId) {
      where.doctorId = parseInt(query.doctorId);
    }

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          patient: true,
          doctor: true,
          prescriptionItems: {
            where: { isDeleted: false }
          }
        }
      }),
      prisma.prescription.count({ where })
    ]);

    const meta = getPaginationMeta(total, parseInt(query.page) || 1, parseInt(query.limit) || 10);

    return { prescriptions, meta };
  }
}