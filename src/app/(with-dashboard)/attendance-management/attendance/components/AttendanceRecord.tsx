"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  PiX,
  PiClock,
  PiMapPin,
  PiFolder,
  PiCalendar,
  PiUser,
} from "react-icons/pi";
import dayjs from "dayjs";
import { IAttendance, IAttendancePunch } from "@/types/attendance.type";
import { minutesToHoursAndMinutes } from "@/utils/time.utils";
import AttendanceStatusBadge from "@/components/ui/AttendanceStatusBadge";

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
  totalMinutes: number;
  overtimeMinutes: number;
  scheduleMinutes: number;
  status: string;
  type: string;
}

interface IReviewInfoCardProps {
  reviewerName?: string;
  reviewedAt?: Date | string;
  remarks?: string;
  status: string;
}

interface IPunchRecordCardProps {
  record: IAttendancePunch;
  index: number;
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
  totalMinutes,
  overtimeMinutes,
  scheduleMinutes,
  status,
  type,
}: IHoursSummaryCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-base-200 rounded-lg p-4">
        <p className="text-xs text-base-content/60 mb-1">Total Worked</p>
        <p className="text-2xl font-bold text-success">
          {minutesToHoursAndMinutes(totalMinutes)}
        </p>
      </div>
      <div className="bg-base-200 rounded-lg p-4">
        <p className="text-xs text-base-content/60 mb-1">Overtime</p>
        <p className="text-2xl font-bold text-warning">
          {minutesToHoursAndMinutes(overtimeMinutes)}
        </p>
      </div>
      <div className="bg-base-200 rounded-lg p-4">
        <p className="text-xs text-base-content/60 mb-1">Scheduled</p>
        <p className="text-2xl font-bold text-info">
          {minutesToHoursAndMinutes(scheduleMinutes)}
        </p>
      </div>
      <div className="bg-base-200 rounded-lg p-4">
        <p className="text-xs text-base-content/60 mb-1">Type</p>
        <p className="text-2xl font-bold text-base-content capitalize">
          {type}
        </p>
      </div>
      <div className="bg-base-200 rounded-lg p-4">
        <p className="text-xs text-base-content/60 mb-1">Status</p>
        <AttendanceStatusBadge status={status} />
      </div>
    </div>
  );
}

// Review Info Card
function ReviewInfoCard({
  reviewerName,
  reviewedAt,
  remarks,
  status,
}: IReviewInfoCardProps) {
  if (status === "pending" && !remarks) return null;

  return (
    <div
      className={`rounded-lg p-4 border ${
        status === "rejected"
          ? "bg-error/10 border-error/20"
          : "bg-base-200 border-base-300"
      }`}
    >
      <h3
        className={`text-sm font-semibold mb-3 ${
          status === "rejected" ? "text-error" : "text-base-content"
        }`}
      >
        Review Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviewerName && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-base-100 flex items-center justify-center">
              <PiUser size={16} className="text-base-content/60" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">Reviewed By</p>
              <p className="text-sm font-semibold text-base-content">
                {reviewerName}
              </p>
            </div>
          </div>
        )}
        {reviewedAt && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-base-100 flex items-center justify-center">
              <PiCalendar size={16} className="text-base-content/60" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">Review Date</p>
              <p className="text-sm font-semibold text-base-content">
                {dayjs(reviewedAt).format("MMM DD, YYYY hh:mm A")}
              </p>
            </div>
          </div>
        )}
      </div>
      {remarks && (
        <div className="mt-4 pt-3 border-t border-black/5">
          <p className="text-xs text-base-content/60 mb-1">Remarks</p>
          <p className="text-sm text-base-content italic">"{remarks}"</p>
        </div>
      )}
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
                      "day",
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
        {record.workMinutes !== undefined && record.workMinutes > 0 && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center">
              <PiClock size={20} className="text-info" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">Work Hours</p>
              <p className="font-semibold text-info">
                {minutesToHoursAndMinutes(record.workMinutes)}
              </p>
            </div>
          </div>
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
                  totalMinutes={attendance.totalMinutes || 0}
                  overtimeMinutes={attendance.overtimeMinutes || 0}
                  scheduleMinutes={attendance.scheduleMinutes || 0}
                  status={attendance.status}
                  type={attendance.type || "regular"}
                />
              </motion.div>

              {/* REVIEW INFO */}
              <motion.div variants={itemVariants}>
                <ReviewInfoCard
                  reviewerName={attendance.reviewer?.profile?.fullName}
                  reviewedAt={attendance.reviewedAt}
                  remarks={attendance.remarks}
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
