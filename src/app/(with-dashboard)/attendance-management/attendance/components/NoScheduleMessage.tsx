import { motion } from "motion/react";
import { PiCalendarX } from "react-icons/pi";

// ==================== NO SCHEDULE MESSAGE COMPONENT ====================
/**
 * Displays warning message when employee has no work schedule assigned
 * Provides action button to navigate to work schedules page
 */
export default function NoScheduleMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border border-warning/30 rounded-lg p-6 bg-warning/5"
    >
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {/* WARNING ICON */}
        <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center">
          <PiCalendarX size={32} className="text-warning" />
        </div>

        {/* MESSAGE CONTENT */}
        <div>
          <h3 className="text-lg font-semibold text-base-content mb-2">
            No Work Schedule Assigned
          </h3>
          <p className="text-sm text-base-content/60 max-w-md">
            This employee does not have a work schedule assigned yet. Please
            assign a work schedule to this employee before creating attendance
            records.
          </p>
        </div>

        {/* ACTION BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            className="btn btn-sm btn-warning gap-2"
            onClick={() => window.open("/work-schedules", "_blank")}
          >
            <PiCalendarX size={16} />
            Assign Work Schedule
          </button>
        </div>
      </div>
    </motion.div>
  );
}
