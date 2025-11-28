"use client";

import CustomTimeInput from "@/components/form/input/CustomTimeInput";
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { MdDelete } from "react-icons/md";

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

interface TimeSlot {
  startTime: string;
  endTime: string;
}

export default function FlexibleSchedule() {
  const { watch, setValue } = useFormContext();
  const flexibleSchedules = watch("flexibleSchedules") || {};
  const weekendDays = watch("weekendDays") || [0, 6];

  // Initialize with one time slot per day
  useEffect(() => {
    if (Object.keys(flexibleSchedules).length === 0) {
      const initialSchedules: any = {};
      DAYS.forEach((day) => {
        initialSchedules[day.value] = [{ startTime: "", endTime: "" }];
      });
      setValue("flexibleSchedules", initialSchedules);
    }
  }, []);

  // Update schedules array whenever flexible schedules change
  useEffect(() => {
    const schedules = DAYS.map((day) => {
      const daySlots = flexibleSchedules[day.value] || [];
      const validSlots = daySlots.filter(
        (slot: TimeSlot) => slot.startTime && slot.endTime
      );

      return {
        day: day.value,
        isWeekend: weekendDays.includes(day.value),
        timeSlots: validSlots.length > 0 ? validSlots : [],
      };
    }).filter((schedule) => schedule.timeSlots.length > 0);

    if (schedules.length > 0) {
      setValue("schedules", schedules);
    }
  }, [flexibleSchedules, weekendDays, setValue]);

  const addTimeSlot = (dayValue: number) => {
    const currentSchedules = { ...flexibleSchedules };
    if (!currentSchedules[dayValue]) {
      currentSchedules[dayValue] = [];
    }
    currentSchedules[dayValue].push({ startTime: "", endTime: "" });
    setValue("flexibleSchedules", currentSchedules);
  };

  const removeTimeSlot = (dayValue: number, slotIndex: number) => {
    const currentSchedules = { ...flexibleSchedules };
    if (currentSchedules[dayValue] && currentSchedules[dayValue].length > 1) {
      currentSchedules[dayValue].splice(slotIndex, 1);
      setValue("flexibleSchedules", currentSchedules);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-base-200">
      <h3 className="text-lg font-medium">Flexible Schedule</h3>
      <p className="text-sm text-gray-600">
        Set multiple time slots for each day of the week
      </p>

      <div className="space-y-4">
        {DAYS.map((day) => {
          const daySlots = flexibleSchedules[day.value] || [
            { startTime: "", endTime: "" },
          ];

          return (
            <div
              key={day.value}
              className="p-4 bg-base-100 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">
                  {day.label}
                  {weekendDays.includes(day.value) && (
                    <span className="ml-2 text-xs text-gray-500">
                      (Weekend)
                    </span>
                  )}
                </h4>
                <button
                  type="button"
                  onClick={() => addTimeSlot(day.value)}
                  className="btn btn-sm btn-ghost text-primary"
                >
                  <PiPlusCircle className="text-lg" />
                  Add Time Slot
                </button>
              </div>

              {daySlots.map((slot: TimeSlot, slotIndex: number) => (
                <div
                  key={slotIndex}
                  className="grid grid-cols-[1fr,1fr,auto] gap-3 items-end"
                >
                  <CustomTimeInput
                    name={`flexibleSchedules.${day.value}.${slotIndex}.startTime`}
                    label={slotIndex === 0 ? "Start Time" : ""}
                    placeholder="Start Time"
                  />
                  <CustomTimeInput
                    name={`flexibleSchedules.${day.value}.${slotIndex}.endTime`}
                    label={slotIndex === 0 ? "End Time" : ""}
                    placeholder="End Time"
                  />
                  {daySlots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(day.value, slotIndex)}
                      className="btn btn-sm btn-error btn-outline mb-1"
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
