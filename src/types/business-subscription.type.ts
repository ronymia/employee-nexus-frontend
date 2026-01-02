import { ISubscriptionPlan } from "./subscription-plan.type";

export interface IBusinessSubscription {
  businessId: number;
  subscriptionPlanId: number;
  subscriptionPlan: ISubscriptionPlan;
  trialEndDate: Date;
  startDate: Date;
  endDate: Date;
  status: string;
}
