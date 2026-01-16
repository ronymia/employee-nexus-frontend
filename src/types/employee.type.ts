import { IDepartment } from "./departments.type";
import { IDesignation } from "./designation.type";
import { IEmploymentStatus } from "./employment-status.type";
import { IWorkSite } from "./work-sites.type";
import { IWorkSchedule } from "./work-schedules.type";
// import { IEmployeeDepartment } from "./employee-department.type";
// import { IEmployeeDesignation } from "./employee-designation.type";
// import { IEmployeeEmploymentStatus } from "./employee-employment-status.type";
// import { IEmployeeWorkSchedule } from "./employee-work-schedule.type";
// import { IEmployeeWorkSite } from "./employee-work-site.type";

export interface IEmployeeDetails {
  userId: number;
  employeeId?: string;
  joiningDate: string;
  // salaryPerMonth?: number;
  nidNumber?: string;
  // departments: IEmployeeDepartment[];
  // designations: IEmployeeDesignation[];
  // employmentStatuses: IEmployeeEmploymentStatus[];
  // workSchedules: IEmployeeWorkSchedule[];
  // workSites: IEmployeeWorkSite[];
  department: IDepartment;
  designation: IDesignation;
  employmentStatus: IEmploymentStatus;
  workSchedule: IWorkSchedule;
  workSites: IWorkSite[];
}

export interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}
