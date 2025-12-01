export interface IUser {
  id: number;
  email: string;
  profile?: {
    fullName: string;
  };
}

export interface IAssetType {
  id: number;
  name: string;
}

export interface Asset {
  id: number;
  name: string;
  code: string;
  date: string;
  note?: string;
  assetTypeId?: number;
  assetType?: IAssetType;
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
  assetAssignments?: IAssetAssignment[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
  };
  userId?: number;
}

export interface IAssetAssignment {
  id: number;
  assetId: number;
  asset?: Asset;
  assignedTo: number;
  assignedToUser?: IUser;
  assignedBy: number;
  assignedByUser?: IUser;
  assignedAt: string;
  returnedAt?: string | null;
  status: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetInput {
  name: string;
  code: string;
  date: string;
  note?: string;
  assetTypeId?: number;
  image?: string;
}

export interface AssignAssetInput {
  assetId: number;
  assignedTo: number;
  assignedAt: string;
  note?: string;
}

export interface ReturnAssetInput {
  assetId: number;
  note?: string;
}
