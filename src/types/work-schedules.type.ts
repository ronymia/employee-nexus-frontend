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
