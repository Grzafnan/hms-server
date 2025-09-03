import { Router } from 'express';
import { authenticateToken, authorize } from '../../middlewares/auth';
import { PharmacyController } from './pharmacy.controller';
const router = Router();

router.use(authenticateToken);

router.post('/prescriptions', authorize(['Admin', 'Doctor']), PharmacyController.createPrescription);
router.get('/prescriptions', authorize(['Admin', 'Doctor', 'Pharmacist']), PharmacyController.getAllPrescriptions);

export const PharmacyRouters = router;