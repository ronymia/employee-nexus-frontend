import { IUser } from "./user.type";
import { IPayslipAdjustment } from "./payslip-adjustment.type";
import {
  CalculationType,
  ComponentType,
  IPayrollComponent,
} from "./payroll-component.type";

export enum PayrollCycleStatus {
  DRAFT = "DRAFT",
  PROCESSING = "PROCESSING",
  APPROVED = "APPROVED",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export enum PayrollFrequency {
  WEEKLY = "WEEKLY",
  BI_WEEKLY = "BI_WEEKLY",
  SEMI_MONTHLY = "SEMI_MONTHLY",
  MONTHLY = "MONTHLY",
}

export enum PayrollItemStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PAID = "PAID",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}

// Payroll Cycle
export interface IPayrollCycle {
  id: number;
  name: string;
  frequency: PayrollFrequency;
  periodStart: string;
  periodEnd: string;
  paymentDate: string;
  status: PayrollCycleStatus;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  totalEmployees: number;
  approvedBy?: number;
  approvedAt?: string;
  processedBy?: number;
  processedAt?: string;
  notes?: string;
  businessId: number;
  business?: {
    id: number;
    name: string;
  };
  payrollItems?: IPayrollItem[];
  createdAt: string;
  updatedAt: string;
}

export interface IPayrollCycleArrayResponse {
  payrollCycles: {
    data: IPayrollCycle[];
  };
}
export interface IPayrollCycleResponse {
  payrollCycleById: {
    data: IPayrollCycle;
  };
}

export interface IPayrollItemComponent {
  id: number;
  payrollItemId: number;
  payrollComponentId: number;
  payrollComponent?: IPayrollComponent;
  value: number;
  componentType: ComponentType;
  calculationType: CalculationType;
  calculatedAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPayrollItem {
  id: number;
  payrollCycleId: number;
  payrollCycle?: IPayrollCycle;
  userId: number;
  user?: IUser;
  basicSalary: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  overtimeMinutes?: number;
  status: PayrollItemStatus;
  paymentMethod?: string;
  bankAccount?: string;
  transactionRef?: string;
  paidAt?: string;
  notes?: string;
  payrollItemComponents?: IPayrollItemComponent[];
  payslipAdjustments?: IPayslipAdjustment[];
  createdAt: string;
  updatedAt: string;
}

export interface IGetPayrollCyclesInput {
  businessId?: number;
  status?: PayrollCycleStatus;
  frequency?: PayrollFrequency;
  periodStart?: string;
  periodEnd?: string;
}

export interface IGetPayrollComponentsInput {
  businessId?: number;
  componentType?: ComponentType;
  status?: string;
  isStatutory?: boolean;
}
