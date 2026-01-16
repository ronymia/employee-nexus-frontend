import { IBusinessSubscription } from "./business-subscription.type";
import { IUser } from "./user.type";

export interface IBusinessSchedule {
  id: number;
  businessId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isWeekend?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBusiness {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postcode: string;
  registrationDate: Date;
  status: string;
  subscriptions: IBusinessSubscription[];
  subscription: IBusinessSubscription;
  ownerId: number;
  owner: IUser;
  logo: string;
  createdAt: Date;
  updatedAt: Date;
  businessSchedules: IBusinessSchedule[];
}
