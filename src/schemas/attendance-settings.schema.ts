import * as z from "zod";

export const attendanceSettingsSchema = z.object({
  punchInTimeTolerance: z.coerce
    .number({ error: `Punch In Time Tolerance must be a number` })
    .min(0, { error: "Tolerance cannot be negative" })
    .max(120, { error: "Tolerance cannot exceed 120 minutes" }),
  workAvailabilityDefinition: z.coerce
    .number({ error: `Work Availability Definition must be a number` })
    .min(0, { error: "Percentage cannot be negative" })
    .max(100, { error: "Percentage cannot exceed 100" }),
  punchInOutAlert: z.boolean({
    error: "Punch In/Out Alert must be a boolean",
  }),
  punchInOutInterval: z.coerce
    .number({ error: `Punch In/Out Interval must be a number` })
    .min(1, { error: "Interval must be at least 1 hour" }),
  autoApproval: z.boolean({ error: "Auto Approval must be a boolean" }),
  isGeoLocationEnabled: z.boolean({
    error: "Geo Location Enabled must be a boolean",
  }),
  googleMapApiKey: z.string().optional(),
});

export type IAttendanceSettingsFormData = z.infer<
  typeof attendanceSettingsSchema
>;
