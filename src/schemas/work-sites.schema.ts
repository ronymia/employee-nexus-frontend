import * as z from "zod";

export const workSiteSchema = z.object({
  id: z.number({ error: `Work Site ID must be number` }).optional(),
  name: z
    .string({ error: `Name is Required` })
    .nonempty({ error: "Name can not be empty" }),
  description: z
    .string({ error: `Description is Required` })
    .nonempty({ error: "Description can not be empty" }),
  address: z.string().optional(),
  isLocationEnabled: z.union([z.boolean(), z.string()]).optional(),
  isGeoLocationEnabled: z.union([z.boolean(), z.string()]).optional(),
  maxRadius: z.union([z.number(), z.string()]).optional(),
  isIpEnabled: z.union([z.boolean(), z.string()]).optional(),
  ipAddress: z.string().optional(),
});

export type IWorkSiteFormData = z.infer<typeof workSiteSchema>;
