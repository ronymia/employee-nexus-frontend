"use client";

import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

// Days of the week
const DAYS = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

export default function WeekendSelector() {
  const { watch, setValue } = useFormContext();
  const [selectedWeekends, setSelectedWeekends] = useState<number[]>([0, 6]); // Default: Sunday and Saturday

  // Initialize weekend days on mount
  useEffect(() => {
    setValue("weekendDays", selectedWeekends);
  }, []);

  // Update weekend days when selection changes
  useEffect(() => {
    setValue("weekendDays", selectedWeekends);
  }, [selectedWeekends, setValue]);

  const toggleWeekend = (dayValue: number) => {
    setSelectedWeekends((prev) => {
      if (prev.includes(dayValue)) {
        return prev.filter((d) => d !== dayValue);
      } else {
        return [...prev, dayValue];
      }
    });
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-base-200">
      <h3 className="text-lg font-medium">Select Weekend Days</h3>
      <p className="text-sm text-gray-600">
        Choose which days are considered weekends
      </p>

      <div className="grid grid-cols-4 gap-3">
        {DAYS.map((day) => (
          <button
            key={day.value}
            type="button"
            onClick={() => toggleWeekend(day.value)}
            className={`btn btn-sm ${
              selectedWeekends.includes(day.value)
                ? "btn-primary"
                : "btn-outline"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {selectedWeekends.length > 0 && (
        <div className="mt-3 p-3 bg-base-100 rounded-lg">
          <p className="text-sm font-medium">
            Selected Weekends:{" "}
            {selectedWeekends.length === 0
              ? "None"
              : DAYS.filter((d) => selectedWeekends.includes(d.value))
                  .map((d) => d.label)
                  .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
