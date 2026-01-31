import { z } from "zod";
import { ComponentType, CalculationType } from "@/types";

export const payrollComponentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .regex(
      /^[A-Z0-9_]+$/,
      "Code must contain only uppercase letters, numbers, and underscores",
    ),
  description: z.string().optional(),
  componentType: z.nativeEnum(ComponentType),
  calculationType: z.nativeEnum(CalculationType),
  defaultValue: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? undefined : Number(val)))
    .optional()
    .default(0),
  isTaxable: z.boolean().default(false),
  isStatutory: z.boolean().default(false),
});

export type IPayrollComponentFormData = z.infer<typeof payrollComponentSchema>;
