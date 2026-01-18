import { IEmploymentStatus } from "./employment-status.type";

export interface IEmployeeEmploymentStatus {
  userId: number;
  employmentStatusId: number;
  employmentStatus: IEmploymentStatus;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  remarks: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}
