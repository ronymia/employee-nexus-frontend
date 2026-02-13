"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

// ==================== CUSTOM LOADING COMPONENT ====================
export default function CustomLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(prev + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full min-h-[400px] overflow-hidden">
      <div className="relative">
        {/* ANIMATED LOGO WITH WAVE EFFECT */}
        <motion.div
          className="flex items-center gap-2 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          {/* SHIMMER OVERLAY */}
          <motion.div
            className="absolute inset-0 -inset-x-4"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)",
              opacity: 0.3,
            }}
            animate={{
              x: ["-200%", "200%"],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1.5,
            }}
          />

          {/* EMPLOYEE TEXT WITH WAVE ANIMATION */}
          <div className="flex items-center">
            {["E", "m", "p", "l", "o", "y", "e", "e"].map((letter, index) => (
              <motion.span
                key={`employee-${index}`}
                className="text-4xl font-bold text-primary drop-shadow-lg relative"
                initial={{ opacity: 0, y: -30, rotateX: -90 }}
                animate={{
                  opacity: 1,
                  y: [0, -10, 0],
                  rotateX: 0,
                }}
                transition={{
                  delay: index * 0.08,
                  y: {
                    duration: 1.8,
                    repeat: Infinity,
                    delay: index * 0.12,
                    ease: "easeInOut",
                  },
                  opacity: { duration: 0.4 },
                  rotateX: { duration: 0.6, ease: "easeOut" },
                }}
              >
                {letter}
                {/* Letter glow */}
                <motion.span
                  className="absolute inset-0 text-primary blur-sm"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.1,
                  }}
                >
                  {letter}
                </motion.span>
              </motion.span>
            ))}
          </div>

          {/* NEXUS TEXT WITH WAVE ANIMATION */}
          <div className="flex items-center">
            {["N", "e", "x", "u", "s"].map((letter, index) => (
              <motion.span
                key={`nexus-${index}`}
                className="text-4xl font-bold bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent drop-shadow-lg relative"
                style={{
                  backgroundSize: "200% 100%",
                }}
                initial={{ opacity: 0, y: 30, rotateX: 90 }}
                animate={{
                  opacity: 1,
                  y: [0, -10, 0],
                  rotateX: 0,
                  backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                }}
                transition={{
                  delay: 0.64 + index * 0.08,
                  y: {
                    duration: 1.8,
                    repeat: Infinity,
                    delay: 0.64 + index * 0.12,
                    ease: "easeInOut",
                  },
                  opacity: { duration: 0.4 },
                  rotateX: { duration: 0.6, ease: "easeOut" },
                  backgroundPosition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* PROGRESS BAR */}
        <motion.div
          className="absolute -bottom-12 left-0 right-0 max-w-[200px] mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="h-1 w-full bg-primary/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.div>

        {/* FLOATING BUBBLES */}
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={`bubble-${index}`}
            className="absolute rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20"
            style={{
              width: `${12 + index * 4}px`,
              height: `${12 + index * 4}px`,
              top: "50%",
              left: "50%",
              marginTop: `-${6 + index * 2}px`,
              marginLeft: `-${6 + index * 2}px`,
            }}
            animate={{
              y: [0, -100, -200],
              x: [0, Math.cos(index) * 30, Math.cos(index + Math.PI) * 20],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.8],
            }}
            transition={{
              duration: 3 + index * 0.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: index * 0.8,
            }}
          />
        ))}
      </div>
    </div>
  );
}
