import { ComponentType } from "react";
import { IPayrollComponent } from "./payroll-component.type";
import { IUser } from "./user.type";

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

export interface ICreatePayrollCycleInput {
  name: string;
  frequency: PayrollFrequency;
  periodStart: string;
  periodEnd: string;
  paymentDate: string;
  notes?: string;
  businessId?: number;
}

export interface IUpdatePayrollCycleInput {
  name?: string;
  frequency?: PayrollFrequency;
  periodStart?: string;
  periodEnd?: string;
  paymentDate?: string;
  status?: PayrollCycleStatus;
  notes?: string;
}

// Payroll Item
export interface IPayrollItemComponent {
  id: number;
  payrollItemId: number;
  componentId: number;
  component?: IPayrollComponent;
  amount: number;
  calculationBase?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPayrollItemAdjustment {
  id: number;
  payrollItemId: number;
  type: string;
  description: string;
  amount: number;
  isRecurring: boolean;
  createdBy: number;
  notes?: string;
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
  overtimeHours?: number;
  status: PayrollItemStatus;
  paymentMethod?: string;
  bankAccount?: string;
  transactionRef?: string;
  paidAt?: string;
  notes?: string;
  components?: IPayrollItemComponent[];
  adjustments?: IPayrollItemAdjustment[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePayrollItemInput {
  payrollCycleId: number;
  userId: number;
  basicSalary: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  overtimeHours?: number;
  paymentMethod?: string;
  bankAccount?: string;
  notes?: string;
  components?: Array<{
    componentId: number;
    amount: number;
    calculationBase?: number;
    notes?: string;
  }>;
  adjustments?: Array<{
    type: string;
    description: string;
    amount: number;
    isRecurring?: boolean;
    notes?: string;
  }>;
}

export interface IUpdatePayrollItemInput {
  basicSalary?: number;
  workingDays?: number;
  presentDays?: number;
  absentDays?: number;
  leaveDays?: number;
  overtimeHours?: number;
  status?: PayrollItemStatus;
  paymentMethod?: string;
  bankAccount?: string;
  transactionRef?: string;
  paidAt?: string;
  notes?: string;
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
