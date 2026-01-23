import { IPayrollComponent } from "./payroll-component.type";
import { IUser } from "./user.type";

export interface IEmployeePayrollComponent {
  id: number;
  userId: number;
  componentId: number;
  value: number;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  isOverride: boolean;
  notes?: string;
  assignedBy?: number;
  assignedByUser?: IUser;
  createdAt: Date;
  updatedAt: Date;
  component: IPayrollComponent;
}

export interface IEmployeePayrollComponentsResponse {
  employeePayrollComponents: {
    success: boolean;
    data: IEmployeePayrollComponent[];
  };
}

export interface IActiveEmployeePayrollComponentsResponse {
  activeEmployeePayrollComponents: {
    success: boolean;
    statusCode: number;
    message: string;
    data: IEmployeePayrollComponent[];
  };
}

export interface IEmployeePayrollComponentHistoryResponse {
  employeePayrollComponentHistory: {
    success: boolean;
    statusCode: number;
    message: string;
    data: IEmployeePayrollComponent[];
  };
}

export interface IQueryEmployeePayrollComponentInput {
  userId?: number;
  componentId?: number;
  isActive?: boolean;
}
