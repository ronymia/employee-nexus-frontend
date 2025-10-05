import { emailRegex } from "@/libs/regex";
import * as z from "zod";

export const userRegisterWithBusinessSchema = z.object({
  user: z.object({
    id: z.number({ error: "User ID is required" }).optional(),
    fullName: z
      .string({ error: "Full name is required" })
      .nonempty({ error: "Full name is required" }),
    email: z
      .string({ error: "Email is required" })
      .nonempty({ error: "Email can not be empty" })
      .regex(emailRegex, { error: "Invalid email" }),
    password: z
      .string({ error: "Password is required" })
      .nonempty({ error: "Password is required" }),
    phone: z
      .string({ error: "Phone is required" })
      .nonempty({ error: "Phone is required" }),
    dateOfBirth: z
      .string({ error: "Date of birth is required" })
      .nonempty({ error: "Date of birth is required" }),
    maritalStatus: z
      .string({ error: "Marital status is required" })
      .nonempty({ error: "Marital status is required" }),
    address: z
      .string({ error: "Address is required" })
      .nonempty({ error: "Address is required" }),
    city: z
      .string({ error: "City is required" })
      .nonempty({ error: "City is required" }),
    country: z
      .string({ error: "Country is required" })
      .nonempty({ error: "Country is required" }),
    postcode: z
      .string({ error: "Postcode is required" })
      .nonempty({ error: "Postcode is required" }),
    gender: z
      .string({ error: "Gender is required" })
      .nonempty({ error: "Gender is required" }),
  }),
  business: z.object({
    name: z
      .string({ error: "Business name is required" })
      .nonempty({ error: "Business name is required" }),
    email: z
      .string({ error: "Email is required" })
      .nonempty({ error: "Email can not be empty" })
      .regex(emailRegex, { error: "Invalid email" }),
    phone: z
      .string({ error: "Phone is required" })
      .nonempty({ error: "Phone is required" }),
    numberOfEmployeesAllowed: z
      .number({ error: "Number of employees is required" })
      .min(0, { error: "Number of employees is required" }),
    address: z
      .string({ error: "Address is required" })
      .nonempty({ error: "Address is required" }),
    city: z
      .string({ error: "City is required" })
      .nonempty({ error: "City is required" }),
    country: z
      .string({ error: "Country is required" })
      .nonempty({ error: "Country is required" }),
    postcode: z
      .string({ error: "Postcode is required" })
      .nonempty({ error: "Postcode is required" }),
    registrationDate: z
      .string({ error: "Registration Date is required" })
      .nonempty({ error: "Registration Date is required" }),
    subscriptionPlanId: z
      .string({ error: "Subscription plan is required" })
      .nonempty({ error: "Subscription plan is required" }),
  }),
});

export type IUserRegisterWithBusiness = z.infer<
  typeof userRegisterWithBusinessSchema
>;
