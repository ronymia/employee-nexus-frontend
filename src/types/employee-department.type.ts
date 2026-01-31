import { IDepartment } from "./departments.type";

export interface IEmployeeDepartment {
  userId: number;
  departmentId: number;
  department: IDepartment;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  isPrimary: boolean;
  roleInDept: string;
  remarks: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}
