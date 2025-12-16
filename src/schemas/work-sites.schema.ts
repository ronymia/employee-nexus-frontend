import * as z from "zod";

// Location Tracking Type Enum - matching backend
export enum LocationTrackingType {
  NONE = "NONE", // No location validation
  MANUAL = "MANUAL", // Manual selection
  GEO_FENCING = "GEO_FENCING", // GPS-based radius check
  IP_WHITELIST = "IP_WHITELIST", // IP address validation
}

export const workSiteSchema = z
  .object({
    id: z.number({ error: `Work Site ID must be number` }).optional(),
    name: z
      .string({ error: `Name is Required` })
      .nonempty({ error: "Name can not be empty" }),
    description: z.string().optional(),
    status: z.string().optional(),
    address: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    locationTrackingType: z
      .nativeEnum(LocationTrackingType)
      .default(LocationTrackingType.NONE),
    maxRadius: z.union([z.number(), z.string()]).optional(),
    ipAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate GEO_FENCING requirements
    if (data.locationTrackingType === LocationTrackingType.GEO_FENCING) {
      if (!data.address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Address is required for Geo-Fencing",
          path: ["address"],
        });
      }
      if (!data.lat) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Latitude is required for Geo-Fencing",
          path: ["lat"],
        });
      }
      if (!data.lng) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Longitude is required for Geo-Fencing",
          path: ["lng"],
        });
      }
      if (!data.maxRadius) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max Radius is required for Geo-Fencing",
          path: ["maxRadius"],
        });
      }
    }

    // Validate IP_WHITELIST requirements
    if (data.locationTrackingType === LocationTrackingType.IP_WHITELIST) {
      if (!data.ipAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "IP Address is required for IP Whitelist",
          path: ["ipAddress"],
        });
      }
    }
  });

export type IWorkSiteFormData = z.infer<typeof workSiteSchema>;
