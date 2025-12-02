export interface IMeta {
  total: number;
  page: number;
  limit: number;
  skip: number;
}

export interface IResponse<T> {
  data: T;
  meta: IMeta;
}

export interface IErrorResponse {
  message: string;
  code: number;
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
