"use client";

import { motion, AnimatePresence } from "motion/react";
import { PiX, PiCalendar, PiUser, PiBriefcase } from "react-icons/pi";
import { ILeave, LeaveDuration } from "@/types";
import AttendanceStatusBadge from "@/components/ui/AttendanceStatusBadge";
import { customFormatDate, FORMAT_PRESETS } from "@/utils/date-format.utils";

// ==================== INTERFACES ====================
interface ILeaveRecordProps {
  leave: ILeave | null;
  isOpen: boolean;
  onClose: () => void;
}

interface IInfoCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
}

// ==================== SUB-COMPONENTS ====================

// Info Card
function InfoCard({ label, value, icon: Icon }: IInfoCardProps) {
  return (
    <div className="bg-base-200 rounded-lg p-4 flex items-start gap-4">
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-primary" />
        </div>
      )}
      <div>
        <p className="text-xs text-base-content/60 mb-1">{label}</p>
        <div className="text-sm font-semibold text-base-content">{value}</div>
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
}: {
  reviewerName?: string;
  reviewedAt?: string;
  remarks?: string;
  status: string;
}) {
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
                {customFormatDate(reviewedAt, FORMAT_PRESETS.DISPLAY_DATETIME)}
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

// ==================== MAIN COMPONENT ====================
export default function LeaveRecord({
  leave,
  isOpen,
  onClose,
}: ILeaveRecordProps) {
  if (!leave) return null;

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
                  Leave Details
                </h2>
                <p className="text-sm text-base-content/60 mt-1">
                  Information about leave request
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
              {/* PRIMARY INFO */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <InfoCard
                  label="Employee"
                  value={leave.user?.profile?.fullName || "N/A"}
                  icon={PiUser}
                />
                <InfoCard
                  label="Leave Type"
                  value={leave.leaveType?.name || "N/A"}
                  icon={PiBriefcase}
                />
              </motion.div>

              {/* DURATION & PERIOD */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="bg-base-200 rounded-lg p-4">
                  <p className="text-xs text-base-content/60 mb-1">Duration</p>
                  <p className="text-lg font-semibold capitalize">
                    {leave.leaveDuration === LeaveDuration.SINGLE_DAY
                      ? "Single Day"
                      : leave.leaveDuration === LeaveDuration.MULTI_DAY
                        ? "Multi Day"
                        : "Half Day"}
                  </p>
                </div>
                <div className="bg-base-200 rounded-lg p-4">
                  <p className="text-xs text-base-content/60 mb-1">
                    Total Hours
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {leave.totalMinutes}h
                  </p>
                </div>
                <div className="bg-base-200 rounded-lg p-4">
                  <p className="text-xs text-base-content/60 mb-1">Status</p>
                  <AttendanceStatusBadge status={leave.status} />
                </div>
              </motion.div>

              {/* LEAVE PERIOD DATE */}
              <motion.div variants={itemVariants}>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <PiCalendar size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 mb-1">
                      Leave Period
                    </p>
                    <p className="text-lg font-bold text-base-content">
                      {customFormatDate(leave.startDate)}
                      {leave.endDate && (
                        <>
                          <span className="mx-2 text-base-content/40">-</span>
                          {customFormatDate(leave.endDate)}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* REVIEW INFO */}
              <motion.div variants={itemVariants}>
                <ReviewInfoCard
                  reviewerName={leave.reviewer?.profile?.fullName}
                  reviewedAt={leave.reviewedAt}
                  remarks={leave.remarks}
                  status={leave.status}
                />
              </motion.div>

              {/* NOTES */}
              {leave.notes && (
                <motion.div variants={itemVariants}>
                  <div className="bg-base-200 rounded-lg p-4">
                    <p className="text-xs text-base-content/60 mb-2 font-semibold">
                      Reason / Notes
                    </p>
                    <p className="text-sm text-base-content bg-base-100 p-3 rounded border border-base-300">
                      {leave.notes}
                    </p>
                  </div>
                </motion.div>
              )}
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
