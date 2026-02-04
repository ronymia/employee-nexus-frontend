"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { IEmployeeAttendanceToday } from "@/types/dashboard.type";
import { PiPlayFill, PiStopFill } from "react-icons/pi";
import { customFormatDate } from "@/utils/date-format.utils";

interface ITodaysAttendanceCardProps {
  attendance: IEmployeeAttendanceToday;
}

export default function TodaysAttendanceCard({
  attendance,
}: ITodaysAttendanceCardProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClockedIn] = useState(attendance.status === "PRESENT");

  // Hydration fix
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mock Timer Logic (In real app, calculate from checkInTime)
  useEffect(() => {
    if (!isClockedIn) return;

    // Just a visual timer for demo based on mock check-in
    // In production, parse attendance.checkInTimeDiff
    const timer = setInterval(() => {
      // Logic to increment timer would go here
      // setElapsedTime(...)
    }, 1000);
    return () => clearInterval(timer);
  }, [isClockedIn]);

  if (!currentTime) return null; // Avoid hydration mismatch

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-base-content">
            Today's Attendance
          </h3>
          <p className="text-xs text-base-content/60">
            Todays Total: {attendance.workingHours || "00:00:00"}
          </p>
        </div>
        <div className="text-sm font-medium text-base-content/80">
          {customFormatDate(currentTime, "MMM DD, YYYY hh:mm A")}
        </div>
      </div>

      {/* Main Timer Card */}
      <div className="bg-blue-50/50 rounded-xl p-6 mb-4 border border-blue-100 relative overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl -mr-10 -mt-10"></div>

        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-4xl font-bold font-mono text-base-content tracking-wider">
              {isClockedIn ? "01:23:45" : "00:00:00"}
            </h2>
            <p className="text-xs text-base-content/50 mt-1 uppercase tracking-widest font-semibold">
              {isClockedIn ? "Clocked In" : "Not Clocked In"}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn border-0 text-white shadow-lg flex items-center gap-2 px-6 ${
              isClockedIn
                ? "bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                : "bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            }`}
          >
            {isClockedIn ? <PiStopFill size={20} /> : <PiPlayFill size={20} />}
            {isClockedIn ? "Clock Out" : "Clock In"}
          </motion.button>
        </div>
      </div>

      {/* Configuration / Selectors (Based on User Image) */}
      <div className="space-y-3 mb-6">
        {/* Location Selection */}
        <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-lg border border-gray-100 w-fit">
          <button className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-primary rounded-md shadow-xs flex items-center gap-1">
            Remote
            <span className="w-4 h-4 rounded-full bg-white/50 flex items-center justify-center text-[10px] ml-1">
              ×
            </span>
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-base-content/60 hover:text-primary transition-colors">
            Office
          </button>
        </div>

        {/* Project Selection / Search */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 rounded-lg border border-blue-100 text-xs font-medium text-primary">
            Apis
            <span className="cursor-pointer opacity-60 hover:opacity-100">
              ×
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 rounded-lg border border-blue-100 text-xs font-medium text-primary">
            LMS ...
            <span className="cursor-pointer opacity-60 hover:opacity-100">
              ×
            </span>
          </div>
          <input
            type="text"
            placeholder="Search pro..."
            className="flex-1 bg-transparent border-0 focus:ring-0 text-sm text-base-content placeholder:text-base-content/40 p-2"
          />
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 text-sm">
        <div>
          <span className="text-base-content/60 block text-xs mb-0.5">
            Scheduled
          </span>
          <span className="font-semibold text-base-content">08:00:00</span>
        </div>
        <div className="h-8 w-[1px] bg-gray-200"></div>
        <div className="text-right">
          <span className="text-base-content/60 block text-xs mb-0.5">
            Remaining
          </span>
          <span className="font-semibold text-base-content">08:00:00</span>
        </div>
      </div>
    </div>
  );
}
