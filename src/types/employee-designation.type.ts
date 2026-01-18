import { IDesignation } from "./designation.type";

export interface IEmployeeDesignation {
  userId: number;
  designationId: number;
  designation: IDesignation;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  remarks: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}
