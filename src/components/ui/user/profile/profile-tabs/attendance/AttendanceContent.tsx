"use client";

import { useState } from "react";
import moment from "moment";
import {
  PiCalendarBlank,
  PiClock,
  PiMapPin,
  PiCheckCircle,
  PiXCircle,
  PiWarning,
  PiMinus,
  PiAirplaneTilt,
  PiCaretLeft,
  PiCaretRight,
  PiDesktop,
  PiGlobe,
} from "react-icons/pi";

interface IAttendancePunch {
  id: number;
  attendanceId: number;
  projectId?: number;
  workSiteId?: number;
  punchIn: string;
  punchOut?: string;
  breakStart?: string;
  breakEnd?: string;
  workHours?: number;
  breakHours?: number;
  punchInIp?: string;
  punchOutIp?: string;
  punchInLat?: number;
  punchInLng?: number;
  punchOutLat?: number;
  punchOutLng?: number;
  punchInDevice?: string;
  punchOutDevice?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface IAttendance {
  id: number;
  userId: number;
  date: string;
  totalHours?: number;
  breakHours?: number;
  status: string;
  punchRecords: IAttendancePunch[];
  createdAt: string;
  updatedAt: string;
}

interface AttendanceContentProps {
  userId: number;
  attendances?: IAttendance[];
}

export default function AttendanceContent({
  userId,
  attendances = [],
}: AttendanceContentProps) {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return <PiCheckCircle size={20} className="text-success" />;
      case "absent":
        return <PiXCircle size={20} className="text-error" />;
      case "late":
        return <PiWarning size={20} className="text-warning" />;
      case "half_day":
        return <PiMinus size={20} className="text-info" />;
      case "on_leave":
        return <PiAirplaneTilt size={20} className="text-base-content/40" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-success/20 border-success/40";
      case "absent":
        return "bg-error/20 border-error/40";
      case "late":
        return "bg-warning/20 border-warning/40";
      case "half_day":
        return "bg-info/20 border-info/40";
      case "on_leave":
        return "bg-base-content/10 border-base-content/20";
      default:
        return "bg-base-200 border-base-300";
    }
  };

  const renderCalendar = () => {
    const startOfMonth = currentMonth.clone().startOf("month");
    const endOfMonth = currentMonth.clone().endOf("month");
    const startDate = startOfMonth.clone().startOf("week");
    const endDate = endOfMonth.clone().endOf("week");

    const calendar = [];
    const day = startDate.clone();

    while (day.isBefore(endDate, "day")) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = day.format("YYYY-MM-DD");
        const attendance = attendances.find((a) =>
          moment(a.date).isSame(day, "day")
        );
        const isCurrentMonth = day.month() === currentMonth.month();
        const isToday = day.isSame(moment(), "day");

        week.push(
          <div
            key={dateStr}
            className={`border rounded-lg p-2 min-h-[80px] cursor-pointer transition-all ${
              !isCurrentMonth ? "opacity-30" : ""
            } ${isToday ? "ring-2 ring-primary" : ""} ${
              attendance ? getStatusColor(attendance.status) : "bg-base-100"
            } hover:shadow-md`}
            onClick={() => setSelectedDate(dateStr)}
          >
            <div className="flex justify-between items-start">
              <span
                className={`text-sm font-semibold ${
                  isToday ? "text-primary" : ""
                }`}
              >
                {day.format("D")}
              </span>
              {attendance && getStatusIcon(attendance.status)}
            </div>
            {attendance && (
              <div className="mt-1">
                <p className="text-xs text-base-content/80">
                  {attendance.totalHours
                    ? `${attendance.totalHours.toFixed(1)}h`
                    : "--"}
                </p>
              </div>
            )}
          </div>
        );
        day.add(1, "day");
      }
      calendar.push(
        <div key={day.format("W")} className="grid grid-cols-7 gap-2">
          {week}
        </div>
      );
    }

    return calendar;
  };

  const selectedAttendance = selectedDate
    ? attendances.find((a) => moment(a.date).isSame(selectedDate, "day"))
    : null;

  // Calculate monthly stats
  const monthlyStats = {
    present: attendances.filter((a) => a.status === "present").length,
    absent: attendances.filter((a) => a.status === "absent").length,
    late: attendances.filter((a) => a.status === "late").length,
    halfDay: attendances.filter((a) => a.status === "half_day").length,
    onLeave: attendances.filter((a) => a.status === "on_leave").length,
    totalHours: attendances.reduce((sum, a) => sum + (a.totalHours || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header with Month Navigation */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-base-content">
            Attendance Records
          </h3>
          <p className="text-sm text-base-content/60">
            {currentMonth.format("MMMM YYYY")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() =>
              setCurrentMonth(currentMonth.clone().subtract(1, "month"))
            }
          >
            <PiCaretLeft size={20} />
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setCurrentMonth(moment())}
          >
            Today
          </button>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() =>
              setCurrentMonth(currentMonth.clone().add(1, "month"))
            }
          >
            <PiCaretRight size={20} />
          </button>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-success/10 border border-success/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <PiCheckCircle size={20} className="text-success" />
            <div>
              <p className="text-xs text-base-content/60">Present</p>
              <p className="text-lg font-bold text-success">
                {monthlyStats.present}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-error/10 border border-error/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <PiXCircle size={20} className="text-error" />
            <div>
              <p className="text-xs text-base-content/60">Absent</p>
              <p className="text-lg font-bold text-error">
                {monthlyStats.absent}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <PiWarning size={20} className="text-warning" />
            <div>
              <p className="text-xs text-base-content/60">Late</p>
              <p className="text-lg font-bold text-warning">
                {monthlyStats.late}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <PiMinus size={20} className="text-info" />
            <div>
              <p className="text-xs text-base-content/60">Half Day</p>
              <p className="text-lg font-bold text-info">
                {monthlyStats.halfDay}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-base-200 border border-base-300 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <PiAirplaneTilt size={20} className="text-base-content/60" />
            <div>
              <p className="text-xs text-base-content/60">On Leave</p>
              <p className="text-lg font-bold">{monthlyStats.onLeave}</p>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <PiClock size={20} className="text-primary" />
            <div>
              <p className="text-xs text-base-content/60">Total Hours</p>
              <p className="text-lg font-bold text-primary">
                {monthlyStats.totalHours.toFixed(1)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-base-100 rounded-lg shadow-sm border border-primary/20 p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-base-content/80"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="space-y-2">{renderCalendar()}</div>
      </div>

      {/* Selected Date Details */}
      {selectedAttendance && (
        <div className="bg-base-100 rounded-lg shadow-sm border border-primary/20 p-6">
          <h4 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
            <PiCalendarBlank size={20} />
            {moment(selectedAttendance.date).format("MMMM DD, YYYY")}
          </h4>

          <div className="space-y-4">
            {/* Status and Hours */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-base-content/60 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedAttendance.status)}
                  <span className="font-semibold capitalize">
                    {selectedAttendance.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-base-content/60 mb-1">Total Hours</p>
                <p className="font-semibold">
                  {selectedAttendance.totalHours?.toFixed(2) || "0"}h
                </p>
              </div>
              <div>
                <p className="text-xs text-base-content/60 mb-1">Break Hours</p>
                <p className="font-semibold">
                  {selectedAttendance.breakHours?.toFixed(2) || "0"}h
                </p>
              </div>
              <div>
                <p className="text-xs text-base-content/60 mb-1">Work Hours</p>
                <p className="font-semibold">
                  {(
                    (selectedAttendance.totalHours || 0) -
                    (selectedAttendance.breakHours || 0)
                  ).toFixed(2)}
                  h
                </p>
              </div>
            </div>

            {/* Punch Records */}
            {selectedAttendance.punchRecords?.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-base-content mb-3">
                  Punch Records
                </h5>
                <div className="space-y-3">
                  {selectedAttendance.punchRecords.map((punch, index) => (
                    <div
                      key={punch.id}
                      className="bg-base-200/50 rounded-lg p-4 border border-base-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="badge badge-sm badge-primary">
                          Session {index + 1}
                        </span>
                        <span className="text-xs text-base-content/60">
                          {punch.workHours?.toFixed(2) || "0"}h worked
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <PiClock size={16} className="text-success" />
                            <span className="text-sm font-semibold">
                              Punch In
                            </span>
                          </div>
                          <p className="text-sm text-base-content/80 ml-6">
                            {moment(punch.punchIn).format("hh:mm:ss A")}
                          </p>
                          {punch.punchInDevice && (
                            <p className="text-xs text-base-content/60 ml-6 flex items-center gap-1">
                              <PiDesktop size={12} />
                              {punch.punchInDevice}
                            </p>
                          )}
                          {punch.punchInIp && (
                            <p className="text-xs text-base-content/60 ml-6 flex items-center gap-1">
                              <PiGlobe size={12} />
                              {punch.punchInIp}
                            </p>
                          )}
                        </div>

                        {punch.punchOut && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <PiClock size={16} className="text-error" />
                              <span className="text-sm font-semibold">
                                Punch Out
                              </span>
                            </div>
                            <p className="text-sm text-base-content/80 ml-6">
                              {moment(punch.punchOut).format("hh:mm:ss A")}
                            </p>
                            {punch.punchOutDevice && (
                              <p className="text-xs text-base-content/60 ml-6 flex items-center gap-1">
                                <PiDesktop size={12} />
                                {punch.punchOutDevice}
                              </p>
                            )}
                            {punch.punchOutIp && (
                              <p className="text-xs text-base-content/60 ml-6 flex items-center gap-1">
                                <PiGlobe size={12} />
                                {punch.punchOutIp}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {(punch.breakStart || punch.punchInLat) && (
                        <div className="mt-3 pt-3 border-t border-base-300 flex flex-wrap gap-4">
                          {punch.breakStart && punch.breakEnd && (
                            <div className="text-xs text-base-content/60">
                              Break:{" "}
                              {moment(punch.breakStart).format("hh:mm A")} -{" "}
                              {moment(punch.breakEnd).format("hh:mm A")} (
                              {punch.breakHours?.toFixed(2) || "0"}h)
                            </div>
                          )}
                          {punch.punchInLat && punch.punchInLng && (
                            <button
                              className="btn btn-xs btn-ghost gap-1"
                              onClick={() => {
                                window.open(
                                  `https://www.google.com/maps?q=${punch.punchInLat},${punch.punchInLng}`,
                                  "_blank"
                                );
                              }}
                            >
                              <PiMapPin size={14} />
                              View Location
                            </button>
                          )}
                        </div>
                      )}

                      {punch.notes && (
                        <div className="mt-3 pt-3 border-t border-base-300">
                          <p className="text-xs text-base-content/60 italic">
                            Note: {punch.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-base-100 rounded-lg shadow-sm border border-primary/20 p-4">
        <h5 className="text-sm font-semibold text-base-content mb-3">Legend</h5>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <PiCheckCircle size={16} className="text-success" />
            <span className="text-xs">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <PiXCircle size={16} className="text-error" />
            <span className="text-xs">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <PiWarning size={16} className="text-warning" />
            <span className="text-xs">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <PiMinus size={16} className="text-info" />
            <span className="text-xs">Half Day</span>
          </div>
          <div className="flex items-center gap-2">
            <PiAirplaneTilt size={16} className="text-base-content/60" />
            <span className="text-xs">On Leave</span>
          </div>
        </div>
      </div>
    </div>
  );
}
