import { Router } from 'express';
import { authenticateToken, authorize } from '../../middlewares/auth';
import { MedicalRecordController } from './medicalRecord.controller';
const router = Router();

router.use(authenticateToken);

router.post('/', authorize(['Admin', 'Doctor']), MedicalRecordController.createMedicalRecord);
router.get('/', authorize(['Admin', 'Doctor', 'Nurse']), MedicalRecordController.getAllMedicalRecords);
router.get('/:id', authorize(['Admin', 'Doctor', 'Nurse']), MedicalRecordController.getMedicalRecordById);
router.put('/:id', authorize(['Admin', 'Doctor']), MedicalRecordController.updateMedicalRecord);
router.delete('/:id', authorize(['Admin']), MedicalRecordController.deleteMedicalRecord);

export const MedicalRecordRouters = router;