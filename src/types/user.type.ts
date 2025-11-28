import { Status } from "./common";

export interface IProfile {
  id: number;
  fullName: string;
  userId: number;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string; // format "DD-MM-YYYY"
  gender: "MALE" | "FEMALE";
  maritalStatus: "SINGLE" | "MARRIED";
  phone: string;
  postcode: string;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  roleId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedBy: Date;
  profile: IProfile;
}

export interface IUserFormData {
  id?: number;
  name: string;
  email: string;
  roleId: number;
  status: Status;
  profile: {
    fullName: string;
    address: string;
    city: string;
    country: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE";
    maritalStatus: "SINGLE" | "MARRIED";
    phone: string;
    postcode: string;
  };
}

export interface IUserWithRole extends IUser {
  role?: {
    id: number;
    name: string;
  };
}

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
