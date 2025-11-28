import * as z from "zod";

export const businessSettingsSchema = z.object({
  businessStartDay: z.coerce.number().min(0).max(6),
  businessTimeZone: z.string().optional(),
  currency: z.string().optional(),
  deleteReadNotifications: z.boolean().optional(),
  identifierPrefix: z.string().optional(),
  isSelfRegistered: z.boolean().optional(),
  theme: z.string().optional(),
});

export type IBusinessSettingsFormData = z.infer<typeof businessSettingsSchema>;
