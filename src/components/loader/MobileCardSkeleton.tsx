"use client";

import { motion } from "motion/react";

interface IMobileCardSkeletonProps {
  cards?: number;
  fields?: number;
}

export default function MobileCardSkeleton({
  cards = 3,
  fields = 5,
}: IMobileCardSkeletonProps) {
  // Container animation for staggered cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Shimmer animation
  const shimmerVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Field container for internal stagger
  const fieldContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col gap-4 mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: cards }).map((_, cardIndex) => (
        <motion.div
          key={cardIndex}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          variants={cardVariants as any}
        >
          {/* Card Header Skeleton */}
          <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <motion.div
              className="h-3 bg-gray-200 rounded w-20"
              variants={shimmerVariants as any}
              initial="initial"
              animate="animate"
            />
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((btnIndex) => (
                <motion.div
                  key={btnIndex}
                  className="w-8 h-8 bg-gray-200 rounded"
                  variants={shimmerVariants as any}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: btnIndex * 0.08 }}
                />
              ))}
            </div>
          </div>

          {/* Card Body Skeleton */}
          <motion.div
            className="p-4 flex flex-col gap-3"
            variants={fieldContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: fields }).map((_, fieldIndex) => (
              <motion.div
                key={fieldIndex}
                className="flex justify-between items-start gap-4"
                variants={fieldVariants as any}
              >
                {/* Label skeleton */}
                <motion.div
                  className="h-3 bg-gray-200 rounded w-24"
                  variants={shimmerVariants as any}
                  initial="initial"
                  animate="animate"
                />
                {/* Value skeleton */}
                <div className="flex-1 flex justify-end">
                  {fieldIndex === 0 ? (
                    // First field with avatar-like skeleton
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-8 h-8 bg-gray-200 rounded-full"
                        variants={shimmerVariants as any}
                        initial="initial"
                        animate="animate"
                      />
                      <div className="space-y-1">
                        <motion.div
                          className="h-3 bg-gray-200 rounded w-24"
                          variants={shimmerVariants as any}
                          initial="initial"
                          animate="animate"
                        />
                        <motion.div
                          className="h-2 bg-gray-200 rounded w-16"
                          variants={shimmerVariants as any}
                          initial="initial"
                          animate="animate"
                        />
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      className={`h-3 bg-gray-200 rounded ${
                        fieldIndex % 2 === 0 ? "w-32" : "w-24"
                      }`}
                      variants={shimmerVariants as any}
                      initial="initial"
                      animate="animate"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
