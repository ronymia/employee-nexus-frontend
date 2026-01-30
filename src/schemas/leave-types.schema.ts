import * as z from "zod";

export const leaveTypeSchema = z.object({
  id: z.number({ error: `Leave Type ID must be number` }).optional(),
  name: z
    .string({ error: `Name is Required` })
    .nonempty({ error: "Name can not be empty" }),
  leaveType: z.enum(["PAID", "UNPAID"], {
    error: "Leave Type must be either PAID or UNPAID",
  }),
  leaveMinutes: z.coerce
    .number({ error: "Leave minutes must be a number" })
    .min(1, { error: "Leave minutes must be at least 1" }),
  leaveRolloverType: z.enum(["NONE", "PARTIAL_ROLLOVER", "FULL_ROLLOVER"], {
    error: "Invalid Leave Rollover Type",
  }),
  carryOverLimit: z.coerce
    .number({ error: `Carry Over Limit must be a number` })
    .min(0, { error: "Carry Over Limit cannot be negative" })
    .optional(),
  employmentStatuses: z
    .array(z.number({ error: "Employment Status ID must be a number" }))
    .optional(),
});

export type ILeaveTypeFormData = z.infer<typeof leaveTypeSchema>;
