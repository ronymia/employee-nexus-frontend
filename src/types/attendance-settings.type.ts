import { IBusiness } from "./business.type";

export interface IAttendanceSettings {
  id?: number;
  businessId: number;
  business?: IBusiness;
  punchInTimeTolerance: number;
  workAvailabilityDefinition: number;
  punchInOutAlert: boolean;
  punchInOutInterval: number;
  autoApproval: boolean;
  isGeoLocationEnabled: boolean;
}

export enum AttendanceTab {
  PREFERENCE = "preference",
  DEFINITIONS = "definitions",
  GEOLOCATION = "geolocation",
}

// ATTENDANCE DOMAIN TYPES
export type IAttendanceStatus = "early" | "regular" | "late";
export type IWorkQuality = "good" | "bad";
