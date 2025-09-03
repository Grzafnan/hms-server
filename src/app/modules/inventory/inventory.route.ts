import { Router } from 'express';
import { authenticateToken, authorize } from '../../middlewares/auth';
import { InventoryController } from './inventory.controller';
const router = Router();

router.use(authenticateToken);

router.post('/', authorize(['Admin', 'Pharmacist']), InventoryController.createInventoryItem);
router.get('/', authorize(['Admin', 'Pharmacist', 'Doctor', 'Nurse']), InventoryController.getAllInventoryItems);
router.put('/:id', authorize(['Admin', 'Pharmacist']), InventoryController.updateInventoryItem);

export const InventoryRoutes = router;
