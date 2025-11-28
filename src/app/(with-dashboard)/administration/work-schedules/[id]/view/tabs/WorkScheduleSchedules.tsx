// components/WorkScheduleSchedules.tsx
import { IDaySchedule } from "@/types";
import { generateWeekDays } from "@/utils/date-time.utils";

interface WorkScheduleSchedulesProps {
  schedules: IDaySchedule[];
}

export default function WorkScheduleSchedules({
  schedules,
}: WorkScheduleSchedulesProps) {
  const weekDays = generateWeekDays({ startOfWeekDay: 0 });

  return (
    <div className={`max-w-3xl mx-auto p-6 space-y-6`}>
      <div className={`bg-base-300 p-6 rounded-lg shadow`}>
        <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
        <div className="space-y-2">
          {schedules.map((schedule) => {
            const dayName = weekDays.find(
              (day) => day.value === schedule.day
            )?.name;
            return (
              <div
                key={schedule.id}
                className="flex justify-between items-center p-3 bg-white rounded border"
              >
                <span className="font-medium">{dayName}</span>
                <div className="flex items-center space-x-4">
                  <span>
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                  {schedule.isWeekend && (
                    <span className="text-red-500 text-sm">(Weekend)</span>
                  )}
                </div>
              </div>
            );
          })}
          {schedules.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No schedules configured
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
