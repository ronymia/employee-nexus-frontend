import { ISubscriptionPlan } from "./subscription-plan.type";
import { IUser } from "./user.type";

export interface IBusinessSchedule {
  id: number;
  businessId: number;
  day: string;
  startTime: string;
  endTime: string;
  // createdAt: string;
  // updatedAt: string;
}

export interface IBusiness {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postcode: string;
  numberOfEmployeesAllowed: string;
  registrationDate: string;
  status: string;
  subscriptionPlanId: number;
  subscriptionPlan: ISubscriptionPlan;
  userId: number;
  user: IUser;
  logo: string;
  website?: string;
  lat?: number;
  lng?: number;
  createdAt: string;
  updatedAt: string;
  businessSchedules: IBusinessSchedule[];
}
