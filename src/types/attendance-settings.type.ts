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

export interface IAttendanceSettingsFormData {
  punchInTimeTolerance: number;
  workAvailabilityDefinition: number;
  punchInOutAlert: boolean;
  punchInOutInterval: number;
  autoApproval: boolean;
  isGeoLocationEnabled: boolean;
  googleMapApiKey?: string;
}

export enum AttendanceTab {
  PREFERENCE = "preference",
  DEFINITIONS = "definitions",
  GEOLOCATION = "geolocation",
}
