import { Router } from 'express';
import { AppointmentController } from './appointment.controller';
import { authenticateToken, authorize } from '../../middlewares/auth';

const router = Router();

router.use(authenticateToken);

router.post('/', authorize(['Admin', 'Doctor', 'Nurse', 'Receptionist']), AppointmentController.createAppointment);
router.get('/', authorize(['Admin', 'Doctor', 'Nurse', 'Receptionist']), AppointmentController.getAllAppointments);
router.get('/:id', authorize(['Admin', 'Doctor', 'Nurse', 'Receptionist']), AppointmentController.getAppointmentById);
router.put('/:id', authorize(['Admin', 'Doctor', 'Nurse', 'Receptionist']), AppointmentController.updateAppointment);
router.delete('/:id', authorize(['Admin', 'Doctor']), AppointmentController.deleteAppointment);

export const AppointmentRoutes = router;