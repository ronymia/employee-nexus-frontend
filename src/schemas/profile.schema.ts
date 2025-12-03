import * as z from "zod";

export const emergencyContactSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .nonempty({ error: "Name cannot be empty" }),
  phone: z.string().optional(),
  relation: z.string().optional(),
});

export type IEmergencyContactFormData = z.infer<typeof emergencyContactSchema>;

export const socialLinksSchema = z.object({
  facebook: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
});

export type ISocialLinksFormData = z.infer<typeof socialLinksSchema>;
