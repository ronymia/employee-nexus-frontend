import { IDepartment } from "./departments.type";

export interface IEmployeeDepartment {
  userId: number;
  departmentId: number;
  department: IDepartment;
}
