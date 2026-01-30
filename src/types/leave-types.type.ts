export interface ILeaveType {
  id?: number;
  name: string;
  leaveType: string;
  leaveMinutes: number;
  leaveRolloverType: LeaveRolloverType;
  carryOverLimit?: number;
  employmentStatuses: ILeaveTypeEmploymentStatus[];
  businessId?: number;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILeaveTypeArrayResponse {
  leaveTypes: {
    message: string;
    statusCode: number;
    success: boolean;
    data: ILeaveType[];
  };
}

export interface ILeaveTypeEmploymentStatus {
  id: number;
  name: string;
}

export enum LeaveRolloverType {
  NONE = "NONE",
  PARTIAL_ROLLOVER = "PARTIAL_ROLLOVER",
  FULL_ROLLOVER = "FULL_ROLLOVER",
}
