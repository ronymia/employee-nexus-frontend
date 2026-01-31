import { z } from "zod";

export const payslipAdjustmentSchema = z.object({
  payrollComponentId: z.number().min(1, "Payroll component is required"),
  value: z.number().min(0, "Value must be positive"),
  remarks: z.string().optional(),
  appliedMonth: z.string().optional(),
  notes: z.string().optional(),
});

export type IPayslipAdjustmentFormData = z.infer<
  typeof payslipAdjustmentSchema
>;
