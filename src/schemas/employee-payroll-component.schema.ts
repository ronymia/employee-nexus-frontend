import { z } from "zod";

export const assignPayrollComponentSchema = z.object({
  payrollComponentId: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Please select a component"),
  value: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? 0 : Number(val))),
  effectiveFrom: z.string().min(1, "Effective from date is required"),
  effectiveTo: z.string().optional(),
  notes: z.string().optional(),
});

export type IAssignPayrollComponentFormData = z.infer<
  typeof assignPayrollComponentSchema
>;
