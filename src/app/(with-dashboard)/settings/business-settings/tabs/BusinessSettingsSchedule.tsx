// components/BusinessSettingsSchedule.tsx
"use client";
import { useMemo } from "react";
import { IBusinessSchedule } from "@/types";
import {
  convertTo12HourFormat,
  generateWeekDays,
} from "@/utils/date-time.utils";

interface BusinessSettingsScheduleProps {
  businessSchedules: IBusinessSchedule[];
}

// Helper to map numeric day to name
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function BusinessSettingsSchedule({
  businessSchedules,
}: BusinessSettingsScheduleProps) {
  // Determine current open status
  const now = new Date();

  return (
    <div className={`max-w-3xl mx-auto p-4 space-y-4`}>
      {/* Weekly schedule table */}
      <div className={`bg-white p-4 rounded-lg shadow`}>
        <div className={`flex items-center justify-between mb-3`}>
          <h3 className="text-lg font-semibold mb-3">Weekly Hours</h3>
          <button
            type={`button`}
            // onClick={onEdit}
            className={`bg-linear-to-tl to-primary shadow-md from-primary hover:bg-green-700 text-base-300 font-semibold px-3 py-1.5 rounded-md`}
          >
            Edit Schedule
          </button>
        </div>
        <ul className="divide-y divide-gray-200">
          {businessSchedules.map((schedule: any) => {
            const dayName = generateWeekDays({ startOfWeekDay: 0 })[
              schedule.day
            ];
            const isToday = schedule.day === now.getDay();
            const isClosed = schedule.isWeekend;
            const timeRange = isClosed
              ? "Closed"
              : `${convertTo12HourFormat(
                  schedule.startTime
                )} - ${convertTo12HourFormat(schedule.endTime)}`;

            return (
              <li
                key={schedule.id}
                className={`flex justify-between py-2 ${
                  isToday ? "font-semibold text-green-600" : ""
                } ${isClosed ? "text-gray-400 italic" : ""}`}
              >
                <span>{dayName.name}</span>
                <span>{timeRange}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
