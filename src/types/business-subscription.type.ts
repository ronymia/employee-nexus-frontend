import { IBusiness } from "./business.type";
import { ISubscriptionPlan } from "./subscription-plan.type";

export interface IBusinessSubscription {
  id: number;
  businessId: number;
  business: IBusiness;
  subscriptionPlanId: number;
  subscriptionPlan: ISubscriptionPlan;
  trialEndDate: Date;
  startDate: Date;
  endDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
