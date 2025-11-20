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

export interface IDaySchedule {
  id: number;
  day: number;
  startTime: string;
  endTime: string;
  isWeekend: boolean;
  workScheduleId: number;
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
