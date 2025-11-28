"use client";

import { motion } from "motion/react";

interface ITabProps {
  tabs: { title: string; id: string; Icon?: React.ElementType }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  gridColumns?: string;
  animationLayoutId?: string;
  testId?: string;
  containerWidth?: string;
  borderRadius?: string;
  className?: string;
}

export default function CustomTab({
  tabs,
  activeTab,
  onTabChange,
  gridColumns = "grid-cols-3",
  animationLayoutId = "active-tab-pill",
  testId,
  containerWidth = "w-full sm:w-[370px]",
  borderRadius = "rounded-[5px]",
  className = "",
}: ITabProps) {
  return (
    <div data-testid={`container-${testId}`} className={className}>
      <div
        className={`bg-gray-100 border border-primary text-sm transition-all duration-200 ${containerWidth} grid ${borderRadius} ${gridColumns} p-1 h-12`}
      >
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            data-testid={`tab-${testId}-${tab.title}`}
            onClick={() => onTabChange(tab.id)}
            className={`relative cursor-pointer ${borderRadius}`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId={animationLayoutId}
                className={`${borderRadius} bg-linear-to-tl to-primary shadow-md from-primary absolute inset-0`}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            <span
              className={`relative justify-center flex items-center gap-x-1 text-xs md:text-sm font-medium ${
                activeTab === tab.id ? "text-base-300" : ""
              }`}
            >
              {tab.Icon && <tab.Icon className="text-lg" />}
              {tab.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
