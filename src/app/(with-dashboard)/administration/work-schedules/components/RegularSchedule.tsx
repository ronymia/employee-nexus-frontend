"use client";

import CustomTimeInput from "@/components/form/input/CustomTimeInput";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

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

export default function RegularSchedule() {
  const { watch, setValue } = useFormContext();
  const startTime = watch("regularStartTime");
  const endTime = watch("regularEndTime");
  const weekendDays = watch("weekendDays") || [0, 6];

  // Update all days with the same time when start/end time changes
  useEffect(() => {
    if (startTime && endTime) {
      const schedules = DAYS.map((day) => ({
        dayOfWeek: day.value,
        isWeekend: weekendDays.includes(day.value),
        timeSlots: [
          {
            startTime: startTime,
            endTime: endTime,
          },
        ],
      }));
      setValue("schedules", schedules);
    }
  }, [startTime, endTime, weekendDays, setValue]);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-base-200 border-primary-content">
      <h3 className="text-lg font-medium">Regular Schedule</h3>
      <p className="text-sm text-gray-600">
        Set the same start and end time for all days of the week
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* START TIME */}
        <CustomTimeInput name="regularStartTime" label="Start Time" required />

        {/* END TIME */}
        <CustomTimeInput name="regularEndTime" label="End Time" required />
      </div>

      {/* Preview */}
      {startTime && endTime && (
        <div className="mt-4 p-3 bg-base-100 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Schedule Preview:</h4>
          <div className="text-sm text-gray-600">
            All days: {startTime} - {endTime}
          </div>
        </div>
      )}
    </div>
  );
}
