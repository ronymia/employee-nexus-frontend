"use client";

import { motion } from "framer-motion";

interface ITableSkeletonProps {
  columns?: number;
  rows?: number;
}

export default function TableSkeleton({
  columns = 5,
  rows = 5,
}: ITableSkeletonProps) {
  // Container animation for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  // Row animation
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Shimmer animation for skeleton elements
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

  return (
    <motion.tbody
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <motion.tr
          key={rowIndex}
          className="border-primary-content"
          variants={rowVariants as any}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4">
              <div
                className={`h-16 border-t border-b border-primary-content flex items-center justify-start px-4 
                  ${colIndex === 0 ? "border-l rounded-l-box" : "border-l-0"}
                  ${
                    colIndex === columns - 1
                      ? "border-r rounded-r-box"
                      : "border-r-0"
                  }
                `}
              >
                {/* Skeleton content */}
                <div className="flex items-center gap-3 w-full">
                  {colIndex === 0 && (
                    // Avatar skeleton for first column
                    <motion.div
                      className="w-10 h-10 bg-gray-200 rounded-full"
                      variants={shimmerVariants as any}
                      initial="initial"
                      animate="animate"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <motion.div
                      className={`h-3 bg-gray-200 rounded ${
                        colIndex === 0 ? "w-32" : "w-24"
                      }`}
                      variants={shimmerVariants as any}
                      initial="initial"
                      animate="animate"
                    />
                    {colIndex === 0 && (
                      <motion.div
                        className="h-2 bg-gray-200 rounded w-20"
                        variants={shimmerVariants as any}
                        initial="initial"
                        animate="animate"
                      />
                    )}
                  </div>
                </div>
              </div>
            </td>
          ))}
          {/* Actions column skeleton */}
          <td className="text-right">
            <div className="flex items-center justify-start gap-x-1.5 border-t border-b border-r border-primary-content rounded-r-box h-16 pr-3">
              <div className="flex gap-2">
                {[1, 2, 3].map((btnIndex) => (
                  <motion.div
                    key={btnIndex}
                    className="w-8 h-8 bg-gray-200 rounded"
                    variants={shimmerVariants as any}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: btnIndex * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </td>
        </motion.tr>
      ))}
    </motion.tbody>
  );
}
