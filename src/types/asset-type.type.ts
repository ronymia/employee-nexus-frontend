export interface IAssetType {
  id: number;
  name: string;
  description: string;
  status: string;
  businessId?: number;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}
