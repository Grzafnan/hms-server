import { Router } from 'express';
import { authenticateToken, authorize } from '../../middlewares/auth';
import { LabController } from './lab.controller';
const router = Router();

router.use(authenticateToken);

router.post('/tests', authorize(['Admin', 'Doctor', 'Lab Technician']), LabController.createLabTest);
router.get('/tests', authorize(['Admin', 'Doctor', 'Lab Technician', 'Nurse']), LabController.getAllLabTests);
router.get('/results/:patientId', authorize(['Admin', 'Doctor', 'Lab Technician', 'Nurse']), LabController.getTestResultsByPatient);

export const LabRoutes = router;