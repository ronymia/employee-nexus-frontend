import { motion } from "framer-motion";
import { PiCalendarCheck, PiUserCircle } from "react-icons/pi";

// ==================== SELECTION PROMPT COMPONENT ====================
/**
 * Displays animated prompt message when employee and date are not selected
 * Guides user to select required fields before adding punch records
 */
export default function SelectionPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="border border-primary/20 rounded-lg p-6 bg-linear-to-br from-primary/5 to-transparent"
    >
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {/* ICONS */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <PiUserCircle size={24} className="text-primary" />
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-primary/40 text-2xl"
          >
            +
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <PiCalendarCheck size={24} className="text-primary" />
          </motion.div>
        </div>

        {/* MESSAGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <p className="text-sm text-base-content/70 font-medium">
            Select an employee and date to continue
          </p>
          <p className="text-xs text-base-content/50 mt-1">
            Choose from the fields above to add punch records
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
