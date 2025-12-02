export interface IDocument {
  id: number;
  userId: number;
  title: string;
  description?: string;
  attachment: string; // File path or URL
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocumentFormData {
  id?: number;
  title: string;
  description?: string;
  attachment: File | string; // File object for upload or string path
}
