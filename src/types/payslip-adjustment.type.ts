import { IPayrollComponent } from "./payroll-component.type";
import { IUser } from "./user.type";

export enum PayslipAdjustmentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IPayslipAdjustment {
  id: number;
  userId: number;
  user?: IUser;
  payrollItemId?: number;
  payrollComponentId: number;
  payrollComponent?: IPayrollComponent;
  remarks?: string;
  value: number;
  appliedMonth?: string;
  status: PayslipAdjustmentStatus;
  requestedBy: number;
  requestedByUser?: IUser;
  reviewedBy?: number;
  reviewedByUser?: IUser;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IApproveRejectPayslipAdjustmentInput {
  id: number;
  status: PayslipAdjustmentStatus;
  notes?: string;
}

export interface IPayslipAdjustmentsResponse {
  payslipAdjustments: {
    success: boolean;
    statusCode: number;
    message: string;
    data: IPayslipAdjustment[];
  };
}

export interface IPayslipAdjustmentByIdResponse {
  payslipAdjustment: {
    success: boolean;
    statusCode: number;
    message: string;
    data: IPayslipAdjustment;
  };
}
