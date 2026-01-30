export enum HolidayType {
  PUBLIC = "PUBLIC",
  RELIGIOUS = "RELIGIOUS",
  COMPANY_SPECIFIC = "COMPANY_SPECIFIC",
  REGIONAL = "REGIONAL",
}

export interface IHoliday {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  isPaid: boolean;
  holidayType: HolidayType;
  businessId?: number;
  business?: {
    id: number;
    name: string;
  };
  createdBy?: number;
  creator?: {
    id: number;
    email: string;
    profile?: {
      fullName: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface IHolidayResponse {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  isPaid: boolean;
  holidayType: HolidayType;
  businessId?: number;
}

export interface IHolidayArrayResponse {
  holidays: {
    data: IHoliday[];
  };
}

export interface IHolidayOverview {
  total: number;
  public: number;
  religious: number;
  companySpecific: number;
  regional: number;
  recurring: number;
  paid: number;
  unpaid: number;
}

export interface IHolidayOverviewResponse {
  holidayOverview: {
    data: IHolidayOverview;
  };
}
