import * as z from "zod";

export const userSchema = z.object({
  id: z.number({ error: `User ID must be number` }).optional(),
  name: z
    .string({ error: `Name is Required` })
    .nonempty({ error: "Name can not be empty" }),
  email: z
    .string({ error: `Email is Required` })
    .email({ error: "Invalid email format" }),
  password: z
    .string({ error: `Password is Required` })
    .min(6, { error: "Password must be at least 6 characters" })
    .optional(),
  roleId: z.number({ error: "Role ID must be a number" }),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    error: "Status must be either ACTIVE or INACTIVE",
  }),
  profile: z.object({
    fullName: z
      .string({ error: `Full Name is Required` })
      .nonempty({ error: "Full Name can not be empty" }),
    address: z
      .string({ error: `Address is Required` })
      .nonempty({ error: "Address can not be empty" }),
    city: z
      .string({ error: `City is Required` })
      .nonempty({ error: "City can not be empty" }),
    country: z
      .string({ error: `Country is Required` })
      .nonempty({ error: "Country can not be empty" }),
    dateOfBirth: z
      .string({ error: `Date of Birth is Required` })
      .nonempty({ error: "Date of Birth can not be empty" }),
    gender: z.enum(["MALE", "FEMALE"], {
      error: "Gender must be either MALE or FEMALE",
    }),
    maritalStatus: z.enum(["SINGLE", "MARRIED"], {
      error: "Marital Status must be either SINGLE or MARRIED",
    }),
    phone: z
      .string({ error: `Phone is Required` })
      .nonempty({ error: "Phone can not be empty" }),
    postcode: z
      .string({ error: `Postcode is Required` })
      .nonempty({ error: "Postcode can not be empty" }),
  }),
});

export type IUserFormData = z.infer<typeof userSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ error: `Current Password is Required` })
      .nonempty({ error: "Current Password can not be empty" }),
    newPassword: z
      .string({ error: `New Password is Required` })
      .min(6, { error: "New Password must be at least 6 characters" }),
    confirmPassword: z
      .string({ error: `Confirm Password is Required` })
      .nonempty({ error: "Confirm Password can not be empty" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type IChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const userProfileSchema = z.object({
  fullName: z
    .string({ error: `Full Name is Required` })
    .nonempty({ error: "Full Name can not be empty" }),
  address: z
    .string({ error: `Address is Required` })
    .nonempty({ error: "Address can not be empty" }),
  city: z
    .string({ error: `City is Required` })
    .nonempty({ error: "City can not be empty" }),
  country: z
    .string({ error: `Country is Required` })
    .nonempty({ error: "Country can not be empty" }),
  dateOfBirth: z
    .string({ error: `Date of Birth is Required` })
    .nonempty({ error: "Date of Birth can not be empty" }),
  gender: z.string({ error: "Gender is required" }),
  maritalStatus: z.string({ error: "Marital Status is required" }),
  phone: z
    .string({ error: `Phone is Required` })
    .nonempty({ error: "Phone can not be empty" }),
  postcode: z
    .string({ error: `Postcode is Required` })
    .nonempty({ error: "Postcode can not be empty" }),
});

export type IUserProfileFormData = z.infer<typeof userProfileSchema>;
