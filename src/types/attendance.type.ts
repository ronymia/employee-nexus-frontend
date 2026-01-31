import { IProject } from "./project.type";
import { IUser } from "./user.type";
import { IWorkSite } from "./work-sites.type";

export interface IAttendancePunch {
  id?: number;
  attendanceId: number;
  projectId: number;
  project?: IProject;
  workSiteId: number;
  workSite?: IWorkSite;
  punchIn: string;
  punchOut: string;
  workMinutes: number;
  breakMinutes: number;
  punchInIp: string;
  punchOutIp: string;
  punchInLat: number;
  punchInLng: number;
  punchOutLat: number;
  punchOutLng: number;
  punchInDevice: string;
  punchOutDevice: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttendance {
  id: number;
  userId: number;
  user?: IUser;
  date: string;
  scheduleMinutes: number;
  totalMinutes: number;
  breakMinutes: number;
  overtimeMinutes: number;
  status: "pending" | "approved" | "rejected" | "absent";
  type: "regular" | "late" | "partial";
  reviewedAt?: Date;
  reviewedBy?: number;
  reviewer?: IUser;
  remarks?: string;
  punchRecords: IAttendancePunch[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendanceOverview {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  absent: number;
  late: number;
  partial: number;
}
export interface IAttendanceOverviewResponse {
  attendanceOverview: {
    data: IAttendanceOverview;
  };
}

// export interface ICreateAttendancePunchInput {
//   projectId?: number;
//   workSiteId?: number;
//   punchIn: string;
//   punchOut?: string;
//   breakStart?: string;
//   breakEnd?: string;
//   workHours?: number;
//   breakHours?: number;
//   punchInIp?: string;
//   punchOutIp?: string;
//   punchInLat?: number;
//   punchInLng?: number;
//   punchOutLat?: number;
//   punchOutLng?: number;
//   punchInDevice?: string;
//   punchOutDevice?: string;
//   notes?: string;
// }

// export interface ICreateAttendanceInput {
//   userId: number;
//   date: string;
//   totalHours?: number;
//   breakHours?: number;
//   status: string;
//   punchRecords: ICreateAttendancePunchInput[];
// }

// export interface IUpdateAttendanceInput {
//   userId?: number;
//   date?: string;
//   totalHours?: number;
//   breakHours?: number;
//   status?: string;
//   punchRecords: ICreateAttendancePunchInput[];
// }

export interface IGetAttendancesInput {
  userId?: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}
