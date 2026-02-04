import { IDepartment } from "./departments.type";
import { IDesignation } from "./designation.type";
import { IEmploymentStatus } from "./employment-status.type";
import { IWorkSite } from "./work-sites.type";
import { IWorkSchedule } from "./work-schedules.type";
import { IUser } from "./user.type";
import { IEmployeeSalary } from "./employee-salary.type";
import { IEmployeePayrollComponent } from "./employee-payroll-component.type";
import { IPayslipAdjustment } from "./payslip-adjustment.type";
// import { IEmployeeDepartment } from "./employee-department.type";
// import { IEmployeeDesignation } from "./employee-designation.type";
// import { IEmployeeEmploymentStatus } from "./employee-employment-status.type";
// import { IEmployeeWorkSchedule } from "./employee-work-schedule.type";
// import { IEmployeeWorkSite } from "./employee-work-site.type";

export interface IEmployeeDetails {
  userId: number;
  user: IUser;
  employeeId?: string;
  joiningDate: string;
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
  salary: IEmployeeSalary;
  employeePayrollComponents: IEmployeePayrollComponent[];
  employeePayslipAdjustments: IPayslipAdjustment[];
}

export interface IEmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

// export interface IEmployee {
//   id: number;
//   userId: number;
//   employeeId?: string;
//   joiningDate: string;
//   // salaryPerMonth?: number;
//   nidNumber?: string;
//   // departments: IEmployeeDepartment[];
//   // designations: IEmployeeDesignation[];
//   // employmentStatuses: IEmployeeEmploymentStatus[];
//   // workSchedules: IEmployeeWorkSchedule[];
//   // workSites: IEmployeeWorkSite[];
//   department: IDepartment;
//   designation: IDesignation;
//   employmentStatus: IEmploymentStatus;
//   workSchedule: IWorkSchedule;
//   workSites: IWorkSite[];
// }

export interface IEmployeeCalendarData {
  joiningDate: Date;
  registrationDate: Date;
  attendances: {
    date: string;
    status: string;
    totalMinutes: number;
    breakMinutes: number;
    overtimeMinutes: number;
  }[];
  leaves: {
    startDate: Date;
    endDate: Date;
    status: string;
    leaveDuration: string;
    totalMinutes: number;
  }[];
  holidays: {
    startDate: Date;
    endDate: Date;
    name: string;
    description: string;
    isPaid: boolean;
    holidayType: string;
    isRecurring: boolean;
  }[];
}

export interface IEmployeeCalendarDataResponse {
  employeeCalendar: {
    success: boolean;
    statusCode: number;
    message: string;
    data: IEmployeeCalendarData;
  };
}
