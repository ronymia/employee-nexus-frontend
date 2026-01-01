import { IEmploymentStatus } from "./employment-status.type";

export interface IEmployeeEmploymentStatus {
  userId: number;
  employmentStatusId: number;
  employmentStatus: IEmploymentStatus;
}
