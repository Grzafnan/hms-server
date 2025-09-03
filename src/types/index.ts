export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
  staffId?: number;
}

export interface JwtPayload {
  userId: number;
  username: string;
  role: string;
  staffId?: number;
}

export type UserRole = 'Admin' | 'Doctor' | 'Nurse' | 'Receptionist' | 'Pharmacist' | 'Lab Technician' | 'Radiologist';
export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export type BillStatus = 'Unpaid' | 'Paid' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Card' | 'Bkash' | 'Nagad' | 'Bank Transfer';
export type InventoryCategory = 'Medicine' | 'Equipment' | 'Supplies';
export type TestStatus = 'Pending' | 'Completed';
export type BedStatus = 'Available' | 'Occupied' | 'Cleaning';
export type BedType = 'General' | 'ICU' | 'CCU' | 'Emergency';
export type Gender = 'Male' | 'Female' | 'Other';