export interface IJobHistory {
  id: number;
  userId: number;
  jobTitle: string;
  companyName: string;
  employmentType: string; // "Full-time", "Part-time", "Contract", "Freelance"
  country: string;
  city?: string;
  startDate: string; // Format: "MM-YYYY" or "YYYY"
  endDate?: string; // Format: "MM-YYYY" or "YYYY"
  responsibilities?: string;
  achievements?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobHistoryFormData {
  id?: number;
  jobTitle: string;
  companyName: string;
  employmentType: string;
  country: string;
  city?: string;
  startDate: string;
  endDate?: string;
  responsibilities?: string;
  achievements?: string;
}

export enum EmploymentType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  CONTRACT = "Contract",
  FREELANCE = "Freelance",
  INTERNSHIP = "Internship",
}
