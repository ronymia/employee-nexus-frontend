export interface IWorkSite {
  id: number;
  name: string;
  description: string;
  status: string;
  address?: string;
  isLocationEnabled?: boolean;
  isGeoLocationEnabled?: boolean;
  maxRadius?: number;
  isIpEnabled?: boolean;
  ipAddress?: string;
  businessId?: number;
  createdAt: string;
  updatedAt: string;
}
