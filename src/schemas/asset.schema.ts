import { z } from "zod";

export const assetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  date: z.string().min(1, "Date is required"),
  note: z.string().optional(),
  assetTypeId: z.number().optional(),
  image: z.instanceof(File).optional().or(z.string().optional()),
});

export type AssetFormData = z.infer<typeof assetSchema>;
