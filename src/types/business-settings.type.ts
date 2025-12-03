export interface IBusinessSetting {
  id: number;
  businessId: number;
  businessStartDay: string;
  businessTimeZone: string;
  currency: string;
  deleteReadNotifications: string;
  identifierPrefix: string;
  isSelfRegistered: boolean;
  theme: string;
}

export interface IUpdateBusinessSettingInput {
  businessStartDay?: number | null;
  businessTimeZone?: string | null;
  currency?: string | null;
  deleteReadNotifications?: string;
  identifierPrefix?: string | null;
  isSelfRegistered?: boolean | null;
  theme?: string | null;
}
