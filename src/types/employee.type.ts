import { IDepartment } from "./departments.type";
import { IDesignation } from "./designation.type";
import { IEmploymentStatus } from "./employment-status.type";
import { IWorkSite } from "./work-sites.type";
import { IWorkSchedule } from "./work-schedules.type";
import { IProfile } from "./user.type";

export interface IEmergencyContact {
  name: string;
  phone?: string;
  relation?: string;
  createdAt?: string;
  updatedAt?: string;
  profileId?: number;
}

export interface IRole {
  id: number;
  name: string;
  businessId?: number;
}

export interface IEmployee {
  id: number;
  email: string;
  businessId: number;
  roleId: number;
  role?: IRole;
  status: string;
  profile?: IProfile;
  employee?: IEmployeeDetails;
  permissions?: string[];
  deletedBy?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IEmployeeDetails {
  userId: number;
  employeeId?: string;
  departmentId: number;
  designationId: number;
  employmentStatusId?: number;
  workScheduleId?: number;
  joiningDate: string;
  salaryPerMonth?: number;
  nidNumber?: string;
  rotaType?: string;
  workingDaysPerWeek?: number;
  workingHoursPerWeek?: number;
  department?: IDepartment;
  designation?: IDesignation;
  employmentStatus?: IEmploymentStatus;
  workSites?: {
    workSite: IWorkSite;
  }[];
  workSchedule?: IWorkSchedule;
}

export interface ICreateEmployeeInput {
  user: {
    email: string;
    password: string;
    roleId: number;
    businessId?: number;
  };
  profile: {
    fullName: string;
    dateOfBirth: string;
    gender?: string;
    maritalStatus?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postcode?: string;
    profilePicture?: string;
  };
  emergencyContact: {
    name: string;
    phone?: string;
    relation?: string;
  };
  departmentId: number;
  designationId: number;
  employmentStatusId?: number;
  workSiteId?: number;
  workScheduleId?: number;
  joiningDate?: string;
  salaryPerMonth?: number;
  employeeId?: string;
  nidNumber?: string;
  rotaType?: string;
  workingDaysPerWeek?: number;
  workingHoursPerWeek?: number;
}

export interface IUpdateEmployeeInput extends ICreateEmployeeInput {
  id: number;
}
