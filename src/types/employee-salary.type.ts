export interface IEmployeeSalary {
  salaryAmount: number;
  salaryType: "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  remarks: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}
