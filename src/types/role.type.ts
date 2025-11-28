export interface IRole {
  id: number;
  name: string;
  businessId: number;
}

export interface IRolesResponse {
  message: string;
  statusCode: number;
  success: boolean;
  data: IRole[];
}
