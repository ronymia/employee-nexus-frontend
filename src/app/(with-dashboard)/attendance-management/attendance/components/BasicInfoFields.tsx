import { EmployeeSelect } from "@/components/input-fields";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import dayjs from "dayjs";
import { IWorkSchedule } from "@/types";

// ==================== BASIC INFO FIELDS COMPONENT ====================
/**
 * Renders employee and date selection fields
 * Employee field is disabled in update mode to prevent changes
 *
 * @param actionType - create or update mode
 */
interface IBasicInfoFieldsProps {
  actionType: "create" | "update";
  calendarData?: any; // Calendar data from employee calendar API
  workSchedule?: IWorkSchedule; // Employee work schedule for weekend detection
}

export default function BasicInfoFields({
  actionType,
  calendarData,
  workSchedule,
}: IBasicInfoFieldsProps) {
  // ==================== CALCULATE WEEKEND DATES ====================
  /**
   * Generate all weekend dates for the current year based on work schedule
   */
  const getWeekendDates = () => {
    if (!workSchedule?.schedules) return [];

    // Find which days are weekends (where isWeekend = true)
    const weekendDays = workSchedule.schedules
      .filter((schedule) => schedule.isWeekend)
      .map((schedule) => schedule.dayOfWeek); // 0 = Sunday, 1 = Monday, etc.

    if (weekendDays.length === 0) return [];

    // Generate all dates for the current year that match weekend days
    const startOfYear = dayjs().startOf("year");
    const endOfYear = dayjs().endOf("year");
    const weekendDates = [];

    let current = startOfYear;
    while (current.isBefore(endOfYear) || current.isSame(endOfYear, "day")) {
      if (weekendDays.includes(current.day())) {
        weekendDates.push({
          date: current.format("DD-MM-YYYY"),
          title: "Weekend (Can mark as overtime)",
          className: "bg-purple-100 border-2 border-purple-400 text-purple-500",
          disabled: false,
        });
      }
      current = current.add(1, "day");
    }

    return weekendDates;
  };
  return (
    <div className="border border-primary/20 rounded-lg p-4">
      <h4 className="text-base font-semibold mb-3 text-primary">
        Basic Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EMPLOYEE SELECTION */}
        <EmployeeSelect
          dataAuto="userId"
          name="userId"
          label="Employee"
          placeholder="Select Employee"
          required={true}
          disabled={actionType === "update"}
        />

        {/* DATE SELECTION */}
        <CustomDatePicker
          dataAuto="date"
          name="date"
          label="Date"
          placeholder="Select Date"
          required={true}
          disabled={actionType === "update"}
          formatDate="DD-MM-YYYY"
          disableAfterDate={dayjs().format("DD-MM-YYYY")}
          disableBeforeDate={
            calendarData?.employeeCalendar?.data?.joiningDate
              ? dayjs(calendarData.employeeCalendar.data.joiningDate).format(
                  "DD-MM-YYYY",
                )
              : undefined
          }
          disabledDates={
            calendarData?.employeeCalendar?.data?.attendances?.map(
              (att: any) => ({
                date: dayjs(att.date).format("DD-MM-YYYY"),
                title: `Attendance already exists: ${att.status}`,
                className:
                  "bg-green-100 border-2 border-green-500 text-green-700 disabled:opacity-100",
              }),
            ) || []
          }
          specialDates={
            calendarData?.employeeCalendar?.data
              ? [
                  // Mark weekend dates
                  ...getWeekendDates(),
                  // Mark leave dates as overtime opportunity
                  ...(calendarData.employeeCalendar.data.leaves?.flatMap(
                    (leave: any) => {
                      const start = dayjs(leave.startDate);
                      const end = leave.endDate ? dayjs(leave.endDate) : start;
                      const dates = [];
                      let current = start;
                      while (
                        current.isBefore(end) ||
                        current.isSame(end, "day")
                      ) {
                        dates.push({
                          date: current.format("DD-MM-YYYY"),
                          title: `Leave Day - ${leave.status} (Can mark as overtime)`,
                          className: "bg-yellow-100 border-2 border-yellow-400",
                          disabled: false,
                        });
                        current = current.add(1, "day");
                      }
                      return dates;
                    },
                  ) || []),
                  // Mark holiday dates
                  ...(calendarData.employeeCalendar.data.holidays?.flatMap(
                    (holiday: any) => {
                      const start = dayjs(holiday.startDate);
                      const end = holiday.endDate
                        ? dayjs(holiday.endDate)
                        : start;
                      const dates = [];
                      let current = start;
                      while (
                        current.isBefore(end) ||
                        current.isSame(end, "day")
                      ) {
                        dates.push({
                          date: current.format("DD-MM-YYYY"),
                          title: `Holiday: ${holiday.name} (Can mark as overtime)`,
                          className: "bg-green-100 border-2 border-green-400",
                          disabled: false,
                        });
                        current = current.add(1, "day");
                      }
                      return dates;
                    },
                  ) || []),
                ]
              : undefined
          }
        />
      </div>
    </div>
  );
}
