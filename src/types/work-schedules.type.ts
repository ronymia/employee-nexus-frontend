export interface ITimeSlot {
  startTime: string;
  endTime: string;
  scheduleId: number;
}

export interface IDaySchedule {
  id: number;
  dayOfWeek: number;
  isWeekend: boolean;
  workScheduleId: number;
  timeSlots?: ITimeSlot[];
}

export interface IWorkSchedule {
  id: number;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  scheduleType: "REGULAR" | "SCHEDULED" | "FLEXIBLE";
  breakType: "PAID" | "UNPAID";
  breakMinutes: number;
  businessId: number;
  business?: {
    id: number;
    name: string;
  };
  schedules?: IDaySchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface IWorkScheduleArrayResponse {
  workSchedules: {
    data: IWorkSchedule[];
  };
}

export interface IWorkScheduleResponse {
  workSchedule: {
    data: IWorkSchedule;
  };
}
