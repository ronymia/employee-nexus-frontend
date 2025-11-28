import * as z from "zod";

export const onboardingProcessSchema = z.object({
  id: z.number({ error: `Onboarding Process ID must be number` }).optional(),
  name: z
    .string({ error: `Name is Required` })
    .nonempty({ error: "Name can not be empty" }),
  description: z.string({ error: `Description is Required` }).nonempty({
    error: "Description can not be empty",
  }),
  isRequired: z.boolean({ error: `Requirement is Required` }),
});

export type IOnboardingProcessFormData = z.infer<
  typeof onboardingProcessSchema
>;
