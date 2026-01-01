import { IAssetType } from "./asset-type.type";
import { IUser } from "./user.type";

export interface IAsset {
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
  asset?: IAsset;
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
