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

// Payroll Component
export interface IPayrollComponent {
  id: number;
  name: string;
  code: string;
  description?: string;
  componentType: ComponentType;
  calculationType: CalculationType;
  defaultValue?: number;
  status: string;
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

export interface IPayrollComponentResponse {
  payrollComponentById: {
    data: IPayrollComponent;
  };
}

export interface IPayrollComponentArrayResponse {
  payrollComponents: {
    data: IPayrollComponent[];
  };
}

export interface IPayrollComponentOverview {
  total: number;
  earning: number;
  deduction: number;
  fixedAmount: number;
  percentageOfBasic: number;
  active: number;
  draft: number;
  disabled: number;
  taxable: number;
  nonTaxable: number;
  statutory: number;
  nonStatutory: number;
}

export interface IPayrollComponentOverviewResponse {
  payrollComponentOverview: {
    data: IPayrollComponentOverview;
  };
}

// Backend uses this naming convention
export interface QueryPayrollComponentInput {
  businessId?: number;
  componentType?: ComponentType;
  status?: string;
  isStatutory?: boolean;
}
