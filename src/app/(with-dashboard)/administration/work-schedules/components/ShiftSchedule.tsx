"use client";

import CustomTimeInput from "@/components/form/input/CustomTimeInput";
import { useFormContext } from "react-hook-form";

// Days of the week
const DAYS = [
  { label: "Sunday", value: 0, isWeekend: true },
  { label: "Monday", value: 1, isWeekend: false },
  { label: "Tuesday", value: 2, isWeekend: false },
  { label: "Wednesday", value: 3, isWeekend: false },
  { label: "Thursday", value: 4, isWeekend: false },
  { label: "Friday", value: 5, isWeekend: false },
  { label: "Saturday", value: 6, isWeekend: true },
];

export default function ShiftSchedule() {
  const { watch, setValue } = useFormContext();
  const daySchedules = watch("schedules") || {};

  // Initialize schedules array whenever day schedules change
  const weekendDays = watch("weekendDays") || [0, 6];

  console.log({ daySchedules });
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-base-200 border-primary-content">
      <h3 className="text-lg font-medium">Shift Schedule</h3>
      <p className="text-sm text-gray-600">
        Set different start and end times for each day of the week
      </p>

      <div className="space-y-3">
        {DAYS.map((day) => (
          <div
            key={day.value}
            className="grid grid-cols-3 gap-4 items-center p-3 bg-base-100 rounded-lg"
          >
            <div className="font-medium text-sm">
              {day.label}
              {weekendDays.includes(day.value) && (
                <span className="ml-2 text-xs text-gray-500">(Weekend)</span>
              )}
            </div>
            <CustomTimeInput
              name={`schedules.${day.value}.timeSlots.0.startTime`}
              label=""
              placeholder="Start Time"
            />
            <CustomTimeInput
              name={`schedules.${day.value}.timeSlots.0.endTime`}
              label=""
              placeholder="End Time"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
