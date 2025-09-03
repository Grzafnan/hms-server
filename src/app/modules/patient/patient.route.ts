import { Router } from 'express';
import { authenticateToken, authorize } from '../../middlewares/auth';
import { PatientController } from './patient.controller';
const router = Router();

router.use(authenticateToken);

router.post('/', authorize(['Admin', 'Doctor', 'Nurse', 'Receptionist']), PatientController.createPatient);
router.get('/', authorize(['Admin', 'Doctor', 'Nurse', 'Receptionist']), PatientController.getAllPatients);
router.get('/:id', authorize(['Admin', 'Doctor', 'Nurse', 'Receptionist']), PatientController.getPatientById);
router.put('/:id', authorize(['Admin', 'Doctor', 'Nurse', 'Receptionist']), PatientController.updatePatient);
router.delete('/:id', authorize(['Admin']), PatientController.deletePatient);

export const PatientRouters = router;