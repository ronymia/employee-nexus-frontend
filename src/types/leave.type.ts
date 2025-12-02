import { IUser } from "./user.type";

export enum LeaveDuration {
  SINGLE_DAY = "SINGLE_DAY",
  MULTI_DAY = "MULTI_DAY",
  HALF_DAY = "HALF_DAY",
}

export interface ILeave {
  id: number;
  userId: number;
  user?: {
    id: number;
    email: string;
    profile?: {
      fullName: string;
      avatar?: string;
    };
  };
  leaveTypeId: number;
  leaveType?: {
    id: number;
    name: string;
    isPaid: boolean;
  };
  leaveYear: number;
  leaveDuration: LeaveDuration;
  startDate: string;
  endDate?: string;
  totalHours: number;
  status: string;
  reviewedAt?: string;
  reviewedBy?: number;
  reviewer?: IUser;
  rejectionReason?: string;
  attachments?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateLeaveInput {
  leaveTypeId: number;
  leaveYear: number;
  leaveDuration: LeaveDuration;
  startDate: string;
  endDate?: string;
  totalHours: number;
  attachments?: string;
  notes?: string;
}

export interface IUpdateLeaveInput {
  leaveTypeId?: number;
  leaveYear?: number;
  leaveDuration?: LeaveDuration;
  startDate?: string;
  endDate?: string;
  totalHours?: number;
  attachments?: string;
  notes?: string;
}

export interface IGetLeavesInput {
  userId?: number;
  leaveTypeId?: number;
  leaveYear?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}
