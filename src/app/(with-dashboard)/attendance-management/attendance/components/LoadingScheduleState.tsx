import { motion } from "framer-motion";
import { PiClock } from "react-icons/pi";

// ==================== LOADING SCHEDULE STATE COMPONENT ====================
/**
 * Displays animated skeleton loader while fetching work schedule
 * Features shimmer effects and pulsing dots for modern UX
 */
export default function LoadingScheduleState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="border border-primary/20 rounded-lg p-6 bg-linear-to-br from-primary/5 to-transparent"
    >
      <div className="space-y-4">
        {/* HEADER WITH ROTATING CLOCK ICON */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <PiClock className="text-primary text-xl" />
          </motion.div>

          {/* SKELETON SHIMMER BARS */}
          <div className="flex-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-5 bg-primary/20 rounded-md overflow-hidden relative"
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-primary/30 to-transparent"
              />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-4 bg-primary/10 rounded-md mt-2 overflow-hidden relative"
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
                className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-primary/20 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* STATUS TEXT WITH PULSING DOTS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-base-content/60"
        >
          <span>Fetching work schedule</span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            •
          </motion.span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          >
            •
          </motion.span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          >
            •
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
