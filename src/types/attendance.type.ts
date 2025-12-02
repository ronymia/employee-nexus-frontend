export interface IAttendancePunch {
  id?: number;
  attendanceId?: number;
  projectId?: number;
  workSiteId?: number;
  punchIn: string;
  punchOut?: string;
  breakStart?: string;
  breakEnd?: string;
  workHours?: number;
  breakHours?: number;
  punchInIp?: string;
  punchOutIp?: string;
  punchInLat?: number;
  punchInLng?: number;
  punchOutLat?: number;
  punchOutLng?: number;
  punchInDevice?: string;
  punchOutDevice?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAttendance {
  id: number;
  userId: number;
  user?: {
    id: number;
    email: string;
    profile?: {
      fullName: string;
      avatar?: string;
    };
  };
  date: string;
  totalHours?: number;
  breakHours?: number;
  status: string;
  punchRecords: IAttendancePunch[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateAttendancePunchInput {
  projectId?: number;
  workSiteId?: number;
  punchIn: string;
  punchOut?: string;
  breakStart?: string;
  breakEnd?: string;
  workHours?: number;
  breakHours?: number;
  punchInIp?: string;
  punchOutIp?: string;
  punchInLat?: number;
  punchInLng?: number;
  punchOutLat?: number;
  punchOutLng?: number;
  punchInDevice?: string;
  punchOutDevice?: string;
  notes?: string;
}

export interface ICreateAttendanceInput {
  userId: number;
  date: string;
  totalHours?: number;
  breakHours?: number;
  status: string;
  punchRecords: ICreateAttendancePunchInput[];
}

export interface IUpdateAttendanceInput {
  userId?: number;
  date?: string;
  totalHours?: number;
  breakHours?: number;
  status?: string;
}

export interface IGetAttendancesInput {
  userId?: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}
