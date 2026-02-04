import * as z from "zod";

export const payrollCycleSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is Required" }),
  frequency: z.string().min(1, { message: "Frequency is Required" }),
  periodStart: z.string().min(1, { message: "Period Start Date is Required" }),
  periodEnd: z.string().min(1, { message: "Period End Date is Required" }),
  paymentDate: z.string().min(1, { message: "Payment Date is Required" }),
  notes: z.string().optional(),
});

export type IPayrollCycleFormData = z.infer<typeof payrollCycleSchema>;
