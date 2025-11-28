import * as z from "zod";

export const leaveSettingsSchema = z.object({
  startMonth: z.coerce
    .number({ error: `Start Month must be a number` })
    .min(0, { error: "Month must be between 0 and 11" })
    .max(11, { error: "Month must be between 0 and 11" }),
  autoApproval: z.boolean({ error: "Auto Approval must be a boolean" }),
});

export type ILeaveSettingsFormData = z.infer<typeof leaveSettingsSchema>;
