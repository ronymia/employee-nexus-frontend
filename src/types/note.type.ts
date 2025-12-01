export interface INote {
  id: number;
  userId: number;
  createdBy: number;
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  title: string;
  content: string;
  category?: string; // "Performance", "Incident", "General", "Feedback"
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INoteFormData {
  id?: number;
  title: string;
  content: string;
  category?: string;
  isPrivate: boolean;
}

export enum NoteCategory {
  PERFORMANCE = "Performance",
  INCIDENT = "Incident",
  GENERAL = "General",
  FEEDBACK = "Feedback",
}
