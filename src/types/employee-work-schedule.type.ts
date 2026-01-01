import { IUser } from "./user.type";
import { IWorkSchedule } from "./work-schedules.type";

export interface IEmployeeWorkSchedule {
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
