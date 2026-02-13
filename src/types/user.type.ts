import { IBusiness } from "./business.type";
import { IMeta } from "./common.type";
import { IEmergencyContact, IEmployeeDetails } from "./employee.type";
import { ISocialLinks } from "./social-links.type";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
}

export interface IRole {
  id: number;
  name: string;
  businessId?: number;
}

export interface IProfile {
  id: number;
  fullName: string;
  userId: number;
  address: string;
  city: string;
  country: string;
  dateOfBirth: Date; // format "DD-MM-YYYY"
  gender: "MALE" | "FEMALE";
  maritalStatus: "SINGLE" | "MARRIED";
  phone: string;
  postcode: string;
  profilePicture: string | null;
  emergencyContact?: IEmergencyContact;
  socialLinks: ISocialLinks;
  createdAt: Date;
  updatedAt: Date;
}
export interface IUser {
  id: number;
  name: string;
  email: string;
  role?: IRole;
  roleId: number;
  status: string;
  profile: IProfile;
  business: IBusiness;
  employee: IEmployeeDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserArrayResponse {
  users: {
    message: string;
    statusCode: number;
    success: boolean;
    data: IUser[];
    meta: IMeta;
  };
}
