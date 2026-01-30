import { IEmployeeDetails } from "./employee.type";
import { IUser } from "./user.type";

export interface IProjectMember {
  id: number;
  userId: number;
  employee: IEmployeeDetails;
  role?: string;
  joinedAt?: string;
}

export interface IProject {
  id: number;
  name: string;
  description?: string;
  cover?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  businessId?: number;
  business?: {
    id: number;
    name: string;
  };
  createdBy?: number;
  creator?: IUser;
  projectMembers?: IProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface IUserProjectMember {
  id: number;
  role?: string;
  projectId: number;
  userId: number;
  project: IProject;
  user: IUser;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  remarks?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserProjectMemberArrayResponse {
  projectMembers: {
    data: IUserProjectMember[];
  };
}

export interface IProjectResponse {
  projectById: {
    data: IProject;
  };
}

export interface IProjectArrayResponse {
  projects: {
    data: IProject[];
  };
}
