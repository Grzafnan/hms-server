import { Router } from 'express';
import { authenticateToken, authorize } from '../../middlewares/auth';
import { StaffController } from './staff.controller';
const router = Router();

router.use(authenticateToken);

router.post('/', authorize(['Admin']), StaffController.createStaff);
router.get('/', authorize(['Admin', 'Doctor', 'Nurse']), StaffController.getAllStaff);
router.get('/:id', authorize(['Admin', 'Doctor', 'Nurse']), StaffController.getStaffById);
router.put('/:id', authorize(['Admin']), StaffController.updateStaff);
router.delete('/:id', authorize(['Admin']), StaffController.deleteStaff);

export const StaffRouters = router;