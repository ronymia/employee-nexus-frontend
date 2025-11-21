export interface Project {
  id: number;
  name: string;
  description?: string;
  cover: string;
  status: string;
  startDate?: string;
  endDate?: string;
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
  projectMembers?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  name: string;
  description?: string;
  cover: string;
  status: string;
  startDate?: string;
  endDate?: string;
}
