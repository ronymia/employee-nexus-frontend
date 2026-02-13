export interface IPunchInInput {
  projectId: number;
  workSiteId: number;
  punchInIp: string;
  punchInLat: number;
  punchInLng: number;
  punchInDevice: string;
}

export interface IPunchIn {
  id: number;
  punchIn: string;
  projectId: number;
  workSiteId: number;
}
export interface IPunchInResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IPunchIn;
}

export interface IPunchOutInput {
  punchId: number;
  punchOutIp: string;
  punchOutLat: number;
  punchOutLng: number;
  punchOutDevice: string;
  notes?: string;
}

export interface IPunchOut {
  id: number;
  punchOut: string;
  projectId: number;
  workSiteId: number;
}
export interface IPunchOutResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IPunchOut;
}
