import { z } from "zod";

export const projectSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    cover: z.string().min(1, "Cover image is required"),
    status: z.enum(["pending", "ongoing", "complete"], {
      errorMap: () => ({
        message: "Status must be pending, ongoing, or complete",
      }),
    }),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      // If status is complete, endDate is required
      if (
        data.status === "complete" &&
        (!data.endDate || data.endDate.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required when status is complete",
      path: ["endDate"],
    }
  );

export type ProjectFormData = z.infer<typeof projectSchema>;
