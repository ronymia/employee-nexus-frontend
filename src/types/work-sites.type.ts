import { LocationTrackingType } from "@/schemas";

export interface IWorkSite {
  id: number;
  name: string;
  description: string;
  status?: string;
  address?: string;
  lat?: number;
  lng?: number;
  maxRadius?: number;
  ipAddress?: string;
  locationTrackingType?: LocationTrackingType;
  businessId?: number;
  createdAt: string;
  updatedAt: string;
}
