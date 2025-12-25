"use client";

import { motion } from "framer-motion";

// ==================== CUSTOM LOADING COMPONENT ====================
export default function CustomLoading() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative">
        {/* ANIMATED LOGO */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* EMPLOYEE TEXT WITH LETTER ANIMATION */}
          <div className="flex items-center">
            {["E", "m", "p", "l", "o", "y", "e", "e"].map((letter, index) => (
              <motion.span
                key={`employee-${index}`}
                className="text-3xl font-bold text-primary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* NEXUS TEXT WITH LETTER ANIMATION */}
          <div className={`flex items-center`}>
            {["N", "e", "x", "u", "s"].map((letter, index) => (
              <motion.span
                key={`nexus-${index}`}
                className={`text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.8 + index * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* PULSING DOTS LOADING INDICATOR */}
        <motion.div
          className="flex justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 rounded-full bg-primary"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* CIRCULAR SPINNER AROUND LOGO */}
        <motion.div
          className="absolute inset-0 -m-8 border-4 border-transparent border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
