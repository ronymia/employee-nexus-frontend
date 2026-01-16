'"use client";';

import {
  MdOutlineBusinessCenter,
  MdOutlineDashboard,
  MdOutlineSubscriptions,
  MdSettings,
} from "react-icons/md";
import { PiClock, PiReceipt } from "react-icons/pi";
import { IoNotificationsOutline } from "react-icons/io5";
import SidebarGenerator from "./SidebarGenerator";
import { VscFileSubmodule } from "react-icons/vsc";
import { FiUsers } from "react-icons/fi";
import MenuToggle from "./MenuToggle";
import type { IMenuItems } from "@/types";
import { motion } from "motion/react";
import type { Dispatch, SetStateAction } from "react";
import { menuNames } from "@/constants/menu";
import useAppStore from "@/hooks/useAppStore";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";

const navVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

interface ISidebarProps {
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({
  setIsSidebarOpen,
  setIsOpen,
}: ISidebarProps) {
  const { hasPermission } = usePermissionGuard();
  const { user } = useAppStore((state) => state);

  // console.log({ permissions });
  // Extract role name without the number suffix (e.g., "employee#1" -> "employee")
  const getRoleName = (roleName?: string) => {
    if (!roleName) return "";
    return roleName.split("#")[0].toLowerCase();
  };

  const userRole = getRoleName(user?.role?.name);
  const menuItems: IMenuItems[] = [
    // DEFAULT USER SIDEBAR
    {
      Icon: MdOutlineDashboard,
      label: menuNames.dashboard,
      path: "/dashboard",
      show: userRole !== "super_admin",
      subMenus: [],
    },
    {
      Icon: IoNotificationsOutline,
      label: menuNames.notifications,
      path: "/notifications",
      show: userRole !== "super_admin",
      subMenus: [],
    },
    {
      Icon: FiUsers,
      label: menuNames.profile,
      path: "/profile",
      show: true,
      subMenus: [],
    },
    {
      Icon: PiReceipt,
      label: menuNames.payslips,
      path: "/payslips",
      show: userRole !== "owner" && userRole !== "super_admin",
      subMenus: [],
    },
    {
      Icon: PiClock,
      label: menuNames.my_activities,
      path: "/my-activities",
      show:
        (hasPermission(Permissions.AttendanceCreate) &&
          userRole === "employee") ||
        (hasPermission(Permissions.LeaveCreate) && userRole === "employee") ||
        userRole === "employee",
      subMenus: [
        {
          Icon: PiClock,
          label: "Attendance Request",
          path: "/my-activities/attendance-request",
          show:
            (hasPermission(Permissions.AttendanceCreate) &&
              userRole === "employee") ||
            userRole === "employee",
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Leave Request",
          path: "/my-activities/leave-request",
          show:
            (hasPermission(Permissions.LeaveCreate) &&
              userRole === "employee") ||
            userRole === "employee",
          subMenus: [],
        },
      ],
    },
    {
      Icon: MdOutlineBusinessCenter,
      label: menuNames.business,
      path: "/businesses",
      show:
        hasPermission(Permissions.BusinessRead) &&
        hasPermission(Permissions.BusinessCreate),
      subMenus: [],
    },
    {
      Icon: MdOutlineSubscriptions,
      label: menuNames.subscription_plans,
      path: "/subscription-plans",
      show:
        hasPermission(Permissions.SubscriptionPlanRead) &&
        hasPermission(Permissions.SubscriptionPlanCreate),
      subMenus: [],
    },
    {
      Icon: VscFileSubmodule,
      label: menuNames.features,
      path: "/features",
      show:
        hasPermission(Permissions.FeatureRead) &&
        hasPermission(Permissions.FeatureCreate),
      subMenus: [],
    },
    {
      Icon: MdOutlineBusinessCenter,
      label: menuNames.projects,
      path: "/projects",
      show:
        hasPermission(Permissions.ProjectRead) ||
        hasPermission(Permissions.ProjectCreate),
      subMenus: [],
    },
    // USER MANAGEMENT MENU
    {
      Icon: FiUsers,
      label: "User Management",
      path: "/user-management",
      show:
        hasPermission(Permissions.UserRead) &&
        hasPermission(Permissions.UserCreate) &&
        userRole !== "super_admin",
      subMenus: [
        {
          Icon: FiUsers,
          label: "All Personnel",
          path: "/user-management/all-users",
          show: hasPermission(Permissions.UserRead),
          subMenus: [],
        },
        {
          Icon: FiUsers,
          label: "Employees",
          path: "/user-management/employees",
          show: hasPermission(Permissions.UserRead),
          subMenus: [],
        },
        {
          Icon: FiUsers,
          label: "Admins",
          path: "/user-management/admins",
          show: hasPermission(Permissions.UserRead),
          subMenus: [],
        },
        {
          Icon: FiUsers,
          label: "Managers",
          path: "/user-management/managers",
          show: hasPermission(Permissions.UserRead),
          subMenus: [],
        },
      ],
    },
    // {
    //   Icon: VscFileSubmodule,
    //   label: "Recruitment",
    //   path: "/recruitment",
    //   show: true,
    //   subMenus: [
    //     {
    //       Icon: VscFileSubmodule,
    //       label: "Job Types",
    //       path: "/recruitment/job-types",
    //       show: permissionGuard(PermissionResource.JOB_TYPE, [
    //         PermissionAction.READ,
    //       ]),
    //       subMenus: [],
    //     },
    //     {
    //       Icon: VscFileSubmodule,
    //       label: "Recruitment Processes",
    //       path: "/recruitment/recruitment-processes",
    //       show: permissionGuard(PermissionResource.RECRUITMENT_PROCESS, [
    //         PermissionAction.READ,
    //       ]),
    //       subMenus: [],
    //     },
    //     {
    //       Icon: VscFileSubmodule,
    //       label: "Onboarding Processes",
    //       path: "/recruitment/onboarding-processes",
    //       show: permissionGuard(PermissionResource.ONBOARDING_PROCESS, [
    //         PermissionAction.READ,
    //       ]),
    //       subMenus: [],
    //     },
    //     {
    //       Icon: VscFileSubmodule,
    //       label: "Job Platforms",
    //       path: "/recruitment/job-platforms",
    //       show: permissionGuard(PermissionResource.JOB_PLATFORM, [
    //         PermissionAction.READ,
    //       ]),
    //       subMenus: [],
    //     },
    //   ],
    // },
    {
      Icon: VscFileSubmodule,
      label: "Administration",
      path: "/administration",
      show:
        (hasPermission(Permissions.DesignationRead) ||
          hasPermission(Permissions.WorkSiteRead) ||
          hasPermission(Permissions.EmploymentStatusRead) ||
          hasPermission(Permissions.LeaveTypeRead) ||
          hasPermission(Permissions.DepartmentRead) ||
          hasPermission(Permissions.WorkScheduleRead)) &&
        hasPermission(Permissions.WorkScheduleCreate),
      subMenus: [
        {
          Icon: VscFileSubmodule,
          label: "Designation",
          path: "/administration/designations",
          show: hasPermission(Permissions.DesignationRead),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Work Sites",
          path: "/administration/work-sites",
          show: hasPermission(Permissions.WorkSiteRead),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Employment Status",
          path: "/administration/employment-status",
          show: hasPermission(Permissions.EmploymentStatusRead),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Leave Types",
          path: "/administration/leave-types",
          show: hasPermission(Permissions.LeaveTypeRead),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Departments",
          path: "/administration/departments",
          show: hasPermission(Permissions.DepartmentRead),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Work Schedules",
          path: "/administration/work-schedules",
          show: hasPermission(Permissions.WorkScheduleRead),
          subMenus: [],
        },
      ],
    },
    // ASSET MANAGEMENT MENU
    {
      Icon: VscFileSubmodule,
      label: "Asset Management",
      path: "/asset-management",
      show:
        (hasPermission(Permissions.AssetTypeRead) ||
          hasPermission(Permissions.AssetRead)) &&
        userRole !== "employee",
      subMenus: [
        {
          Icon: VscFileSubmodule,
          label: "Asset Types",
          path: "/asset-management/asset-types",
          show: hasPermission(Permissions.AssetTypeRead),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Assets",
          path: "/asset-management/assets",
          show: hasPermission(Permissions.AssetRead),
          subMenus: [],
        },
      ],
    },
    // ATTENDANCE MANAGEMENT MENU
    {
      Icon: PiClock,
      label: menuNames.attendance_management,
      path: "/attendance-management",
      show:
        (hasPermission(Permissions.AttendanceRead) ||
          hasPermission(Permissions.AttendanceCreate)) &&
        userRole !== "employee",
      subMenus: [
        {
          Icon: PiClock,
          label: "Attendance",
          path: "/attendance-management/attendance",
          show:
            hasPermission(Permissions.AttendanceRead) &&
            userRole !== "employee",
          subMenus: [],
        },
      ],
    },
    // LEAVE MANAGEMENT MENU
    {
      Icon: VscFileSubmodule,
      label: menuNames.leave_management,
      path: "/leave-management",
      show:
        (hasPermission(Permissions.LeaveRead) ||
          hasPermission(Permissions.HolidayRead)) &&
        userRole !== "employee",
      subMenus: [
        {
          Icon: VscFileSubmodule,
          label: "Leave Records",
          path: "/leave-management/leave-records",
          show: hasPermission(Permissions.LeaveRead) && userRole !== "employee",
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Holidays",
          path: "/leave-management/holidays",
          show:
            hasPermission(Permissions.HolidayRead) && userRole !== "employee",
          subMenus: [],
        },
      ],
    },
    // PAYROLL MANAGEMENT MENU
    {
      Icon: MdOutlineBusinessCenter,
      label: menuNames.payroll_management,
      path: "/payroll-management",
      show:
        (hasPermission(Permissions.PayrollComponentRead) ||
          hasPermission(Permissions.PayrollCycleRead) ||
          hasPermission(Permissions.PayrollItemRead)) &&
        userRole !== "employee",
      subMenus: [
        {
          Icon: VscFileSubmodule,
          label: "Payroll Components",
          path: "/payroll-management/payroll-components",
          show: hasPermission(Permissions.PayrollComponentRead),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Payroll Cycles",
          path: "/payroll-management/payroll-cycles",
          show: hasPermission(Permissions.PayrollCycleRead),
          subMenus: [],
        },
        {
          Icon: PiReceipt,
          label: "All Payslips",
          path: "/payroll-management/payslips",
          show: hasPermission(Permissions.PayrollItemRead),
          subMenus: [],
        },
      ],
    },
    // SETTINGS MENU
    {
      Icon: MdSettings,
      label: "Settings",
      path: "/settings",
      show:
        (hasPermission(Permissions.AttendanceSettingsRead) ||
          hasPermission(Permissions.LeaveSettingsRead) ||
          hasPermission(Permissions.BusinessSettingsRead)) &&
        userRole !== "employee",
      subMenus: [
        {
          Icon: VscFileSubmodule,
          label: "Attendance Settings",
          path: "/settings/attendance-settings",
          show: hasPermission(Permissions.AttendanceSettingsRead),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Leave Settings",
          path: "/settings/leave-settings",
          show: hasPermission(Permissions.LeaveSettingsRead),
          subMenus: [],
        },
      ],
    },
  ];

  return (
    <>
      {/* SIDEBAR ITEMS */}
      <motion.ul variants={navVariants}>
        {menuItems
          .filter((item) => item.show)
          .map((item) => (
            <SidebarGenerator
              key={item.path}
              Icon={item.Icon}
              label={item.label}
              path={item.path}
              subMenus={item.subMenus}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          ))}
      </motion.ul>
      {
        <MenuToggle
          toggle={() => {
            setIsOpen(false);
            setIsSidebarOpen(false);
          }}
          className={`absolute top-4 right-4`}
        />
      }
    </>
  );
}
