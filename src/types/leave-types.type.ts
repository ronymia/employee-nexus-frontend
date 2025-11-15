import { Status } from "./common";

export interface ILeaveType {
  id?: number;
  name: string;
  leaveType: string;
  leaveHours: number;
  leaveRolloverType: LeaveRolloverType;
  carryOverLimit?: number;
  employmentStatuses: ILeaveTypeEmploymentStatus[];
  businessId?: number;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILeaveTypeEmploymentStatus {
  id: number;
  name: string;
}

export enum LeaveRolloverType {
  NONE = "NONE",
  CARRY_OVER = "CARRY_OVER",
  CARRY_FORWARD = "CARRY_FORWARD",
}
