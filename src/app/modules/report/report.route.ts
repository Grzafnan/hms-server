import { Router } from 'express';
import { authenticateToken, authorize } from '../../middlewares/auth';
import { ReportController } from './report.controller';
const router = Router();

router.use(authenticateToken);

router.get('/patients', authorize(['Admin', 'Doctor', 'Nurse']), ReportController.getPatientReport);
router.get('/billing', authorize(['Admin', 'Receptionist']), ReportController.getBillingReport);
router.get('/inventory', authorize(['Admin', 'Pharmacist']), ReportController.getInventoryReport);

export const ReportRouters = router;