import { z } from "zod";

export const employeeSchema = z.object({
  id: z.number({ error: `User ID must be number` }).optional(),
  user: z.object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      // .min(6, "Password must be at least 6 characters")
      .optional(),
    roleId: z
      .number()
      .min(1, "Role is required")
      .or(z.string().min(1, "Role is required")),
    businessId: z.number().optional(),
  }),
  profile: z.object({
    fullName: z.string().min(1, "Full name is required"),
    dateOfBirth: z.string(),
    gender: z.string(),
    maritalStatus: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
    postcode: z.string(),
    profilePicture: z.string().optional(),
  }),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    phone: z.string(),
    relation: z.string(),
  }),
  departmentId: z.number().min(1, "Department is required"),
  designationId: z.number().min(1, "Designation is required"),
  employmentStatusId: z.number().min(1, "Employment Status is required"),
  workSiteIds: z.array(z.number().min(1, "Work Site is required")),
  workScheduleId: z.number().min(1, "Work Schedule is required"),
  joiningDate: z.string(),
  salaryPerMonth: z
    .number()
    .or(z.string().min(1, "Salary per month is required")),
  employeeId: z.string().optional(),
  nidNumber: z.string().min(1, "NID number is required"),
  rotaType: z.string().optional().default("day_based"),
  workingDaysPerWeek: z
    .number("Working days per week is required")
    .or(z.string().min(1, "Working days per week is required")),
  workingHoursPerWeek: z
    .number("Working hours per week is required")
    .or(z.string().min(1, "Working hours per week is required")),
});

export type IEmployeeFormData = z.infer<typeof employeeSchema>;
