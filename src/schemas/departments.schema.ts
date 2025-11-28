import * as z from "zod";

export const departmentSchema = z.object({
  id: z.number({ error: `Department ID must be number` }).optional(),
  name: z
    .string({ error: `Name is Required` })
    .nonempty({ error: "Name can not be empty" }),
  description: z
    .string({ error: `Description is Required` })
    .nonempty({ error: "Description can not be empty" }),
  parentId: z
    .number({ error: "Parent Department ID must be a number" })
    .optional(),
  managerId: z.number({ error: "Manager ID must be a number" }).optional(),
});

export type IDepartmentFormData = z.infer<typeof departmentSchema>;
