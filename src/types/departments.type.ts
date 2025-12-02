import { IBusiness } from "./business.type";
import { IUser } from "./user.type";
import { Status } from "./common.type";

export interface IDepartment {
  id?: number;
  parentId?: number;
  parent?: IDepartment;
  name: string;
  description: string;
  status: Status;
  businessId?: number;
  business?: IBusiness;
  managerId?: number;
  manager?: IUser;
  createdBy?: number;
  creator?: IUser;
  children?: IDepartment[];
  createdAt?: string;
  updatedAt?: string;
}
