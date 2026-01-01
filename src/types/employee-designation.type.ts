import { IDesignation } from "./designation.type";

export interface IEmployeeDesignation {
  userId: number;
  designationId: number;
  designation: IDesignation;
}
