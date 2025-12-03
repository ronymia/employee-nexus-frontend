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

export enum ComponentType {
  EARNING = "EARNING",
  DEDUCTION = "DEDUCTION",
  EMPLOYER_COST = "EMPLOYER_COST",
}

export enum CalculationType {
  FIXED_AMOUNT = "FIXED_AMOUNT",
  PERCENTAGE_OF_BASIC = "PERCENTAGE_OF_BASIC",
  PERCENTAGE_OF_GROSS = "PERCENTAGE_OF_GROSS",
  HOURLY_RATE = "HOURLY_RATE",
}

export enum PayrollItemStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PAID = "PAID",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}

// Payroll Component
export interface IPayrollComponent {
  id: number;
  name: string;
  code: string;
  description?: string;
  componentType: ComponentType;
  calculationType: CalculationType;
  defaultValue?: number;
  isActive: boolean;
  isTaxable: boolean;
  isStatutory: boolean;
  displayOrder?: number;
  businessId?: number;
  business?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePayrollComponentInput {
  name: string;
  code: string;
  description?: string;
  componentType: ComponentType;
  calculationType: CalculationType;
  defaultValue?: number;
  isActive?: boolean;
  isTaxable?: boolean;
  isStatutory?: boolean;
  displayOrder?: number;
  businessId?: number;
}

export interface IUpdatePayrollComponentInput {
  name?: string;
  code?: string;
  description?: string;
  componentType?: ComponentType;
  calculationType?: CalculationType;
  defaultValue?: number;
  isActive?: boolean;
  isTaxable?: boolean;
  isStatutory?: boolean;
  displayOrder?: number;
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

export interface IPayslipAdjustment {
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
  adjustments?: IPayslipAdjustment[];
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
  isActive?: boolean;
  isStatutory?: boolean;
}

// Backend uses this naming convention
export interface QueryPayrollComponentInput {
  businessId?: number;
  componentType?: ComponentType;
  isActive?: boolean;
  isStatutory?: boolean;
}
