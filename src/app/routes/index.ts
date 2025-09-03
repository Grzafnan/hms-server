import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { AppointmentRoutes } from '../modules/appointment/appointment.route';
import { BillingRoutes, PaymentRoutes } from '../modules/billing/billing.route';
import { InventoryRoutes } from '../modules/inventory/inventory.route';
import { LabRoutes } from '../modules/lab/lab.route';
import { MedicalRecordRouters } from '../modules/medicalRecord/medicalRecord.route';
import { PatientRouters } from '../modules/patient/patient.route';
import { PharmacyRouters } from '../modules/pharmacy/pharmacy.route';
import { ReportRouters } from '../modules/report/report.route';
import { StaffRouters } from '../modules/staff/staff.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/appointments',
    routes: AppointmentRoutes,
  },
  {
    path: '/billings',
    routes: BillingRoutes,
  },
  {
    path: '/payments',
    routes: PaymentRoutes,
  },
  {
    path: '/inventory',
    routes: InventoryRoutes,
  },
  {
    path: '/labs',
    routes: LabRoutes,
  },
  {
    path: '/medical-records',
    routes: MedicalRecordRouters,
  },
  {
    path: '/patients',
    routes: PatientRouters,
  },
  {
    path: '/pharmacies',
    routes: PharmacyRouters,
  },
  {
    path: '/reports',
    routes: ReportRouters,
  },
    {
    path: '/staffs',
    routes: StaffRouters,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;