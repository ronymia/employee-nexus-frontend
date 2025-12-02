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

export interface ICreateHolidayInput {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  isPaid: boolean;
  holidayType: HolidayType;
  businessId?: number;
}

export interface IUpdateHolidayInput {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isRecurring?: boolean;
  isPaid?: boolean;
  holidayType?: HolidayType;
}
