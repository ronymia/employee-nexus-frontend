"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  PiX,
  PiClock,
  PiMapPin,
  PiFolder,
  PiCalendar,
  PiUser,
} from "react-icons/pi";
import dayjs from "dayjs";
import { IAttendance } from "@/types/attendance.type";

// ==================== INTERFACES ====================
interface IAttendanceRecordProps {
  attendance: IAttendance | null;
  isOpen: boolean;
  onClose: () => void;
}

interface IEmployeeInfoCardProps {
  employeeName: string;
  date: string;
}

interface IHoursSummaryCardProps {
  totalHours: number;
  breakHours: number;
  workHours: number;
  status: string;
}

interface IPunchRecordCardProps {
  record: any;
  index: number;
}

// ==================== HELPER FUNCTIONS ====================

// Format work hours to "Xh Ym" format
function formatWorkHours(hours: number | undefined): string {
  if (!hours || hours === 0) return "0h 0m";

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h ${minutes}m`;
  }
}

// ==================== SUB-COMPONENTS ====================

// Employee Information Card
function EmployeeInfoCard({ employeeName, date }: IEmployeeInfoCardProps) {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <PiUser size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-base-content/60">Employee</p>
            <p className="font-semibold text-base-content">{employeeName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <PiCalendar size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-base-content/60">Date</p>
            <p className="font-semibold text-base-content">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hours Summary Card
function HoursSummaryCard({
  totalHours,
  breakHours,
  workHours,
  status,
}: IHoursSummaryCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-base-200 rounded-lg p-4">
        <p className="text-xs text-base-content/60 mb-1">Total Hours</p>
        <p className="text-2xl font-bold text-success">
          {totalHours?.toFixed(2) || "0.00"}h
        </p>
      </div>
      <div className="bg-base-200 rounded-lg p-4">
        <p className="text-xs text-base-content/60 mb-1">Break Hours</p>
        <p className="text-2xl font-bold text-warning">
          {breakHours?.toFixed(2) || "0.00"}h
        </p>
      </div>
      <div className="bg-base-200 rounded-lg p-4">
        <p className="text-xs text-base-content/60 mb-1">Work Hours</p>
        <p className="text-2xl font-bold text-info">
          {workHours?.toFixed(2) || "0.00"}h
        </p>
      </div>
      <div className="bg-base-200 rounded-lg p-4">
        <p className="text-xs text-base-content/60 mb-1">Status</p>
        <span
          className={`badge ${
            status === "approved"
              ? "badge-success"
              : status === "rejected"
              ? "badge-error"
              : "badge-warning"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

// Punch Record Card
function PunchRecordCard({ record, index }: IPunchRecordCardProps) {
  return (
    <div className="bg-base-200 rounded-lg p-4 border border-base-300">
      {/* PUNCH RECORD DATE HEADER */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-primary/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <PiCalendar size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-base-content/60 font-medium">
              Punch Date
            </p>
            <p className="text-sm font-semibold text-base-content">
              {record.punchIn
                ? dayjs(record.punchIn).format("MMM DD, YYYY")
                : "N/A"}
            </p>
          </div>
        </div>
        <span className="badge badge-ghost badge-sm">Record #{index + 1}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PUNCH IN */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
            <PiClock size={20} className="text-success" />
          </div>
          <div>
            <p className="text-xs text-base-content/60">Punch In</p>
            <p className="font-semibold text-base-content">
              {record.punchIn
                ? dayjs(record.punchIn).format("MMM DD, hh:mm A")
                : "N/A"}
            </p>
            {record.punchInDevice && (
              <p className="text-xs text-base-content/60 mt-1">
                {record.punchInDevice}
              </p>
            )}
          </div>
        </div>

        {/* PUNCH OUT */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
            <PiClock size={20} className="text-error" />
          </div>
          <div>
            <p className="text-xs text-base-content/60">Punch Out</p>
            <p className="font-semibold text-base-content">
              {record.punchOut ? (
                <>
                  {dayjs(record.punchOut).format("MMM DD, hh:mm A")}
                  {/* Show badge if punch out is on different day */}
                  {record.punchIn &&
                    !dayjs(record.punchOut).isSame(
                      dayjs(record.punchIn),
                      "day"
                    ) && (
                      <span className="ml-2 badge badge-warning badge-xs">
                        Next Day
                      </span>
                    )}
                </>
              ) : (
                "Not punched out"
              )}
            </p>
            {record.punchOutDevice && (
              <p className="text-xs text-base-content/60 mt-1">
                {record.punchOutDevice}
              </p>
            )}
          </div>
        </div>

        {/* WORK HOURS */}
        {record.workHours !== undefined && record.workHours > 0 && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center">
              <PiClock size={20} className="text-info" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">Work Hours</p>
              <p className="font-semibold text-info">
                {formatWorkHours(record.workHours)}
              </p>
            </div>
          </div>
        )}

        {/* BREAK TIME */}
        {record.breakStart && record.breakEnd && (
          <>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <PiClock size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-xs text-base-content/60">Break Start</p>
                <p className="font-semibold text-base-content">
                  {dayjs(record.breakStart).format("hh:mm A")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <PiClock size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-xs text-base-content/60">Break End</p>
                <p className="font-semibold text-base-content">
                  {dayjs(record.breakEnd).format("hh:mm A")}
                </p>
              </div>
            </div>
          </>
        )}

        {/* LOCATION */}
        {record.workSite && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center">
              <PiMapPin size={20} className="text-info" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">Location</p>
              <p className="font-semibold text-base-content">
                {record.workSite.name}
              </p>
            </div>
          </div>
        )}

        {/* PROJECT */}
        {record.project && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <PiFolder size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">Project</p>
              <p className="font-semibold text-base-content">
                {record.project.name}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* NOTES */}
      {record.notes && (
        <div className="mt-4 pt-4 border-t border-base-300">
          <p className="text-xs text-base-content/60 mb-1">Notes</p>
          <p className="text-sm text-base-content">{record.notes}</p>
        </div>
      )}
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function AttendanceRecord({
  attendance,
  isOpen,
  onClose,
}: IAttendanceRecordProps) {
  if (!attendance) return null;

  // EXTRACT PUNCH RECORD DATA
  const punchRecords = attendance.punchRecords || [];
  const firstPunch = punchRecords[0];

  // ANIMATION VARIANTS
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          {/* MODAL CONTAINER */}
          <motion.div
            className="bg-base-100 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            variants={modalVariants as any}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="sticky top-0 bg-base-100 border-b border-base-300 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-base-content">
                  Attendance Record
                </h2>
                <p className="text-sm text-base-content/60 mt-1">
                  Detailed punch in/out information
                </p>
              </div>
              <button
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <PiX size={20} />
              </button>
            </div>

            {/* CONTENT */}
            <motion.div
              className="p-6 space-y-6"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {/* EMPLOYEE INFO CARD */}
              <motion.div variants={itemVariants}>
                <EmployeeInfoCard
                  employeeName={attendance.user?.profile?.fullName || "N/A"}
                  date={dayjs(attendance.date).format("MMM DD, YYYY")}
                />
              </motion.div>

              {/* HOURS SUMMARY */}
              <motion.div variants={itemVariants}>
                <HoursSummaryCard
                  totalHours={attendance.totalHours || 0}
                  breakHours={attendance.breakHours || 0}
                  workHours={firstPunch?.workHours || 0}
                  status={attendance.status}
                />
              </motion.div>

              {/* PUNCH RECORDS */}
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold text-base-content mb-4">
                  Punch Records
                </h3>
                <div className="space-y-4">
                  {punchRecords.map((record, index) => (
                    <motion.div key={record.id} variants={itemVariants}>
                      <PunchRecordCard record={record} index={index} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* FOOTER */}
            <div className="sticky bottom-0 bg-base-100 border-t border-base-300 px-6 py-4 flex justify-end">
              <button onClick={onClose} className="btn btn-primary">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
