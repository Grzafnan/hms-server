import prisma from "../../../config/database";
import { getPaginationMeta, getPaginationParams } from "../../../utils/pagination";
import { AppError } from "../../middlewares/errorHandler";


export class AppointmentService {
  static async createAppointment(appointmentData: any) {
    // Verify patient and doctor exist
    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({
        where: { id: appointmentData.patientId, isDeleted: false }
      }),
      prisma.staff.findUnique({
        where: { id: appointmentData.doctorId, isDeleted: false, role: 'Doctor' }
      })
    ]);

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    const appointment = await prisma.appointment.create({
      data: appointmentData,
      include: {
        patient: true,
        doctor: true
      }
    });

    return appointment;
  }

  static async getAllAppointments(query: any) {
    const { skip, take, orderBy } = getPaginationParams(query);
    
    const where: any = { isDeleted: false };
    
    // Add filters
    if (query.patientId) {
      where.patientId = parseInt(query.patientId);
    }
    
    if (query.doctorId) {
      where.doctorId = parseInt(query.doctorId);
    }
    
    if (query.status) {
      where.status = query.status;
    }
    
    if (query.date) {
      const startDate = new Date(query.date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      where.appointmentDate = {
        gte: startDate,
        lt: endDate
      };
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          patient: true,
          doctor: true
        }
      }),
      prisma.appointment.count({ where })
    ]);

    const meta = getPaginationMeta(total, parseInt(query.page) || 1, parseInt(query.limit) || 10);

    return { appointments, meta };
  }

  static async getAppointmentById(id: number) {
    const appointment = await prisma.appointment.findUnique({
      where: { id, isDeleted: false },
      include: {
        patient: true,
        doctor: true
      }
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    return appointment;
  }

  static async updateAppointment(id: number, appointmentData: any) {
    const appointment = await prisma.appointment.findUnique({
      where: { id, isDeleted: false }
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: appointmentData,
      include: {
        patient: true,
        doctor: true
      }
    });

    return updatedAppointment;
  }

  static async deleteAppointment(id: number) {
    const appointment = await prisma.appointment.findUnique({
      where: { id, isDeleted: false }
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    await prisma.appointment.update({
      where: { id },
      data: { isDeleted: true }
    });

    return { message: 'Appointment cancelled successfully' };
  }
}