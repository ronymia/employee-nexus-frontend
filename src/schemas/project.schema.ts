import { z } from "zod";

export const projectSchema = z
  .object({
    id: z.number().optional(),
    name: z.string({ error: "Name is required" }).min(1, "Name is required"),
    description: z.string().optional(),
    status: z.enum(["planning", "ongoing", "complete"], {
      error: "Status must be planning, ongoing, or complete",
    }),
    startDate: z
      .string({ error: "Start date is required" })
      .min(1, "Start date is required"),
    endDate: z.string({ error: "End date is required" }).optional(),
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

export type IProjectFormData = z.infer<typeof projectSchema>;
