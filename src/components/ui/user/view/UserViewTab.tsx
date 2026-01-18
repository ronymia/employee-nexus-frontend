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
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import { useMemo } from "react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface Tab {
  id: string;
  label: string;
  icon: IconType;
  permission?: string;
}

const ALL_TABS: Tab[] = [
  {
    id: "profile",
    label: "Profile",
    icon: PiUser,
    permission: Permissions.ProfileRead,
  },
  {
    id: "employment-details",
    label: "Employment Details",
    icon: PiUser,
    permission: Permissions.ProfileRead,
  },
  {
    id: "education",
    label: "Education History",
    icon: PiGraduationCap,
    permission: Permissions.EducationHistoryRead,
  },
  {
    id: "experience",
    label: "Experience",
    icon: PiBriefcase,
    permission: Permissions.JobHistoryRead,
  },
  {
    id: "schedule",
    label: "Work Schedule",
    icon: PiCalendar,
    permission: Permissions.WorkScheduleRead,
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: PiClipboardText,
    permission: Permissions.AttendanceRead,
  },
  {
    id: "leave",
    label: "Leave Management",
    icon: PiClock,
    permission: Permissions.LeaveRead,
  },
  {
    id: "payslip",
    label: "Pay Slip",
    icon: PiReceipt,
    permission: Permissions.PayrollItemRead,
  },
  {
    id: "projects",
    label: "Projects",
    icon: PiFolderOpen,
    permission: Permissions.ProjectRead,
  },
  {
    id: "documents",
    label: "Documents",
    icon: PiFileText,
    permission: Permissions.DocumentRead,
  },
  {
    id: "notes",
    label: "Notes",
    icon: PiClipboardText,
    permission: Permissions.NoteRead,
  },
  {
    id: "letters",
    label: "Letters",
    icon: PiEnvelope,
    permission: Permissions.DocumentRead,
  },
  {
    id: "assets",
    label: "Assets",
    icon: PiWallet,
    permission: Permissions.AssetRead,
  },
  {
    id: "social",
    label: "Social Links",
    icon: PiShareNetwork,
    permission: Permissions.SocialLinkRead,
  },
];

export default function ProfileTabs({
  activeTab,
  setActiveTab,
}: ProfileTabsProps) {
  const { hasPermission } = usePermissionGuard();

  // Filter tabs based on permissions
  const TABS = useMemo(() => {
    return ALL_TABS.filter((tab) => {
      if (!tab.permission) return true;
      return hasPermission(tab.permission);
    });
  }, [hasPermission]);
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
