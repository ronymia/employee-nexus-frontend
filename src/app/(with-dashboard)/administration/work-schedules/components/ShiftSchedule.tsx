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

export default function ShiftSchedule() {
  const { watch, setValue } = useFormContext();
  const daySchedules = watch("shiftSchedules") || {};

  // Initialize schedules array whenever day schedules change
  useEffect(() => {
    const schedules = DAYS.map((day) => ({
      day: day.value,
      isWeekend: day.isWeekend,
      timeSlots: [
        {
          startTime: daySchedules[day.value]?.startTime || "",
          endTime: daySchedules[day.value]?.endTime || "",
        },
      ],
    })).filter(
      (schedule) =>
        schedule.timeSlots[0].startTime && schedule.timeSlots[0].endTime
    );

    if (schedules.length > 0) {
      setValue("schedules", schedules);
    }
  }, [daySchedules, setValue]);

  const handleTimeChange = (
    dayValue: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const currentSchedules = { ...daySchedules };
    if (!currentSchedules[dayValue]) {
      currentSchedules[dayValue] = { startTime: "", endTime: "" };
    }
    currentSchedules[dayValue][field] = value;
    setValue("shiftSchedules", currentSchedules);
  };

  const weekendDays = watch("weekendDays") || [0, 6];

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-base-200">
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
              name={`shiftSchedules.${day.value}.startTime`}
              label=""
              placeholder="Start Time"
            />
            <CustomTimeInput
              name={`shiftSchedules.${day.value}.endTime`}
              label=""
              placeholder="End Time"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
