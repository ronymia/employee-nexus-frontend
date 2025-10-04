import * as z from "zod";

export const subscriptionPlanSchema = z
  .object({
    id: z.number({ error: `Subscription ID must be number` }).optional(),
    name: z
      .string({ error: `Name is Required` })
      .nonempty({ error: "Name can not be empty" }),
    description: z
      .string({ error: `Description is Required` })
      .nonempty({ error: "Description can not be empty" }),
    price: z
      .number({ error: `Price is Required` })
      .gt(0, { error: `Price must be getter then 0` }),
    setupFee: z
      .number({ error: `Description is Required` })
      .gt(0, { error: "Setup Fee can not be empty" }),
    moduleIds: z
      .array(z.number(), { error: `Modules Must br Array` })
      .nonempty({ error: `At least one module is required` }),
  })
  .refine((data) => data.setupFee < data.price, {
    path: ["setupFee"],
    message: "Setup fee must be less than price",
  });

export type ISubscriptionPlanFormData = z.infer<typeof subscriptionPlanSchema>;
