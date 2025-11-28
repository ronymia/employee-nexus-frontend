import * as z from "zod";

export const leaveTypeSchema = z.object({
  id: z.number({ error: `Leave Type ID must be number` }).optional(),
  name: z
    .string({ error: `Name is Required` })
    .nonempty({ error: "Name can not be empty" }),
  leaveType: z.enum(["PAID", "UNPAID"], {
    error: "Leave Type must be either PAID or UNPAID",
  }),
  leaveHours: z.coerce
    .number({ error: `Leave Hours must be a number` })
    .min(0, { error: "Leave Hours cannot be negative" }),
  leaveRolloverType: z.enum(["NONE", "CARRY_OVER", "CARRY_FORWARD"], {
    error: "Invalid Leave Rollover Type",
  }),
  carryOverLimit: z.coerce
    .number({ error: `Carry Over Limit must be a number` })
    .min(0, { error: "Carry Over Limit cannot be negative" })
    .optional(),
  employmentStatuses: z
    .array(z.number({ error: "Employment Status ID must be a number" }))
    .min(1, { error: "At least one employment status must be selected" }),
});

export type ILeaveTypeFormData = z.infer<typeof leaveTypeSchema>;
