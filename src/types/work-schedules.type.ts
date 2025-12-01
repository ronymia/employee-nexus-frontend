import { IUser } from "./user.type";

export interface IWorkSchedule {
  id: number;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  scheduleType: "REGULAR" | "SHIFT" | "FLEXIBLE";
  breakType: "PAID" | "UNPAID";
  breakHours: number;
  businessId?: number;
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
  business?: {
    id: number;
    name: string;
  };
  creator?: {
    id: number;
    profile: {
      fullName: string;
    };
  };
  schedules?: IDaySchedule[];
}

export interface ITimeSlot {
  startTime: string;
  endTime: string;
  scheduleId: number;
}

export interface IDaySchedule {
  id: number;
  day: number;
  isWeekend: boolean;
  workScheduleId: number;
  timeSlots?: ITimeSlot[];
}

export interface ICreateWorkScheduleInput {
  name: string;
  description: string;
  scheduleType: "REGULAR" | "SHIFT" | "FLEXIBLE";
  breakType: "PAID" | "UNPAID";
  breakHours: number;
  businessId?: number;
}

export interface IUpdateWorkScheduleInput {
  name?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
  scheduleType?: "REGULAR" | "SHIFT" | "FLEXIBLE";
  breakType?: "PAID" | "UNPAID";
  breakHours?: number;
}

export interface IScheduleAssignment {
  id: number;
  userId: number;
  workScheduleId: number;
  workSchedule: IWorkSchedule;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  assignedBy: number;
  assignedByUser?: IUser;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateEmployeeScheduleAssignmentInput {
  userId: number;
  workScheduleId: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
}

export interface IUpdateEmployeeScheduleAssignmentInput {
  userId?: number;
  workScheduleId?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  notes?: string;
}
