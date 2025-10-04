import * as z from "zod";
import { emailRegex, passwordRegex } from "@/libs/regex";

export const loginSchema = z.object({
  email: z
    .string(`Email is required`)
    .nonempty({ error: "Email is required" })
    .regex(emailRegex, { error: "Invalid email" }),
  password: z
    .string(`Password is required`)
    .nonempty({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters" })
    .max(32, { error: "Password must be at most 32 characters" })
    .regex(passwordRegex, {
      error:
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
    }),
});

export type ILoginFormData = z.infer<typeof loginSchema>;

export type ILoginResponse = {
  login: {
    user: any;
    accessToken: string;
  };
};

export type ILoginVariables = {
  email: string;
  password: string;
};
