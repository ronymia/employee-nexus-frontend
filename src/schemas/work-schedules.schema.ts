import * as z from "zod";

// Time slot schema for flexible schedules
const timeSlotSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

// Schedule schema for individual days
const scheduleSchema = z.object({
  day: z.number().min(0).max(6), // 0 = Sunday, 6 = Saturday
  isWeekend: z.boolean(),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "At least one time slot is required"),
});

export const workScheduleSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    scheduleType: z
      .enum(["REGULAR", "SCHEDULED", "FLEXIBLE"])
      .default("REGULAR"),
    breakType: z.enum(["PAID", "UNPAID"]),
    breakHours: z.coerce.number().min(0, "Break hours must be 0 or more"),
    schedules: z.array(scheduleSchema).optional().default([]),
  })
  .superRefine((data, ctx) => {
    // Only validate schedules on submission (when other required fields are filled)
    if (
      data.name &&
      data.description &&
      (!data.schedules || data.schedules.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one schedule is required",
        path: ["schedules"],
      });
    }
  });

export type IWorkScheduleFormData = z.infer<typeof workScheduleSchema>;
