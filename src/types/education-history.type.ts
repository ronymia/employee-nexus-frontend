export interface IEducationHistory {
  id: number;
  userId: number;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  country: string;
  city?: string;
  startDate: string; // Format: "MM-YYYY" or "YYYY"
  endDate?: string; // Format: "MM-YYYY" or "YYYY"
  isCurrentlyStudying: boolean;
  grade?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEducationHistoryFormData {
  id?: number;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  country: string;
  city?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  grade?: string;
  description?: string;
}
