"use client";

import HorizontalScrollbar from "@/components/scrollbar/HorizontalScrollbar";
import {
  PiUser,
  PiGraduationCap,
  PiBriefcase,
  PiCalendar,
  PiClipboardText,
  PiClock,
  PiFileText,
  PiEnvelope,
  PiWallet,
  PiReceipt,
  PiFolderOpen,
  PiShareNetwork,
} from "react-icons/pi";
import type { IconType } from "react-icons";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface Tab {
  id: string;
  label: string;
  icon: IconType;
}

const TABS: Tab[] = [
  { id: "profile", label: "Profile", icon: PiUser },
  { id: "education", label: "Education History", icon: PiGraduationCap },
  { id: "experience", label: "Experience", icon: PiBriefcase },
  { id: "schedule", label: "Work Schedule", icon: PiCalendar },
  { id: "attendance", label: "Attendance", icon: PiClipboardText },
  { id: "leave", label: "Leave Management", icon: PiClock },
  { id: "payslip", label: "Pay Slip", icon: PiReceipt },
  { id: "projects", label: "Projects", icon: PiFolderOpen },
  { id: "documents", label: "Documents", icon: PiFileText },
  { id: "notes", label: "Notes", icon: PiClipboardText },
  { id: "letters", label: "Letters", icon: PiEnvelope },
  { id: "assets", label: "Assets", icon: PiWallet },
  { id: "social", label: "Social Links", icon: PiShareNetwork },
];

export default function ProfileTabs({
  activeTab,
  setActiveTab,
}: ProfileTabsProps) {
  return (
    <HorizontalScrollbar>
      <div className="flex gap-1 min-w-max">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-3 text-sm whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-base-content/70 hover:text-base-content"
              }`}
            >
              <Icon className="text-lg" />
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </HorizontalScrollbar>
  );
}
