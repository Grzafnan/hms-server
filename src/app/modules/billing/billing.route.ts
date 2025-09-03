import { Router } from 'express';
import { authenticateToken, authorize } from '../../middlewares/auth';
import { BillingController } from './billing.controller';
const router = Router();

router.use(authenticateToken);

router.post('/', authorize(['Admin', 'Receptionist']), BillingController.createBill);
router.get('/', authorize(['Admin', 'Receptionist', 'Doctor']), BillingController.getAllBills);
router.get('/:id', authorize(['Admin', 'Receptionist', 'Doctor']), BillingController.getBillById);
router.put('/:id', authorize(['Admin', 'Receptionist']), BillingController.updateBill);
router.delete('/:id', authorize(['Admin']), BillingController.deleteBill);

const paymentRouter = Router();
paymentRouter.use(authenticateToken);
paymentRouter.post('/', authorize(['Admin', 'Receptionist']), BillingController.createPayment);

export { router as BillingRoutes, paymentRouter as PaymentRoutes };