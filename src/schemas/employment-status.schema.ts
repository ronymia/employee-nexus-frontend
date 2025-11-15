import * as z from "zod";

export const employmentStatusSchema = z.object({
  id: z.number({ error: `Employment Status ID must be number` }).optional(),
  name: z
    .string({ error: `Name is Required` })
    .nonempty({ error: "Name can not be empty" }),
  description: z
    .string({ error: `Description is Required` })
    .nonempty({ error: "Description can not be empty" }),
});

export type IEmploymentStatusFormData = z.infer<typeof employmentStatusSchema>;
