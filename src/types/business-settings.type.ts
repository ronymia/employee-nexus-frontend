export interface IBusinessSetting {
  businessId: number;
  businessStartDay: number;
  businessTimeZone: string;
  currency: string;
  deleteReadNotifications: string;
  identifierPrefix: string;
  theme: string;
  googleApiKey?: string;
}
