export interface Asset {
  id: number;
  name: string;
  code: string;
  date: string;
  note?: string;
  assetTypeId?: number;
  assetType?: {
    id: number;
    name: string;
  };
  image?: string;
  status: string;
  businessId?: number;
  business?: {
    id: number;
    name: string;
  };
  createdBy?: number;
  creator?: {
    id: number;
    name: string;
  };
  assetAssignments?: any[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
  };
  userId?: number;
}

export interface AssetInput {
  name: string;
  code: string;
  date: string;
  note?: string;
  assetTypeId?: number;
  image?: string;
}
