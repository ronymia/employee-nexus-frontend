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
import {
  PermissionAction,
  PermissionResource,
} from "@/constants/permissions.constant";

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
  const { permissionGuard, hasPermission } = usePermissionGuard();
  const { permissions, user } = useAppStore((state) => state);
  console.log({ user });
  const menuItems: IMenuItems[] = [
    // DEFAULT USER SIDEBAR
    {
      Icon: MdOutlineDashboard,
      label: menuNames.dashboard,
      path: "/dashboard",
      show: true,
      subMenus: [],
    },
    {
      Icon: IoNotificationsOutline,
      label: menuNames.notifications,
      path: "/notifications",
      show: true,
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
      show: true,
      subMenus: [],
    },
    {
      Icon: PiClock,
      label: menuNames.my_activities,
      path: "/my-activities",
      show: true,
      subMenus: [
        {
          Icon: PiClock,
          label: "Attendance Request",
          path: "/my-activities/attendance-request",
          show: true,
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Leave Request",
          path: "/my-activities/leave-request",
          show: true,
          subMenus: [],
        },
      ],
    },
    {
      Icon: MdOutlineBusinessCenter,
      label: menuNames.business,
      path: "/businesses",
      show: permissionGuard(
        PermissionResource.BUSINESS,
        [PermissionAction.READ, PermissionAction.CREATE],
        true
      ),
      subMenus: [],
    },
    {
      Icon: MdOutlineSubscriptions,
      label: menuNames.subscription_plans,
      path: "/subscription-plans",
      show: permissionGuard(
        PermissionResource.SUBSCRIPTION_PLAN,
        [PermissionAction.READ, PermissionAction.CREATE],
        true
      ),
      subMenus: [],
    },
    {
      Icon: VscFileSubmodule,
      label: menuNames.features,
      path: "/features",
      show: permissionGuard(
        PermissionResource.FEATURE,
        [PermissionAction.READ, PermissionAction.CREATE],
        true
      ),
      subMenus: [],
    },
    {
      Icon: MdOutlineBusinessCenter,
      label: menuNames.projects,
      path: "/projects",
      show: permissionGuard(
        PermissionResource.PROJECT,
        [PermissionAction.READ, PermissionAction.CREATE],
        true
      ),
      subMenus: [],
    },
    // USER MANAGEMENT MENU
    {
      Icon: FiUsers,
      label: "User Management",
      path: "/user-management",
      show: permissionGuard(
        PermissionResource.USER,
        [PermissionAction.READ],
        true
      ),
      subMenus: [
        {
          Icon: FiUsers,
          label: "Employees",
          path: "/user-management/employees",
          show: permissionGuard(PermissionResource.USER, [
            PermissionAction.READ,
          ]),
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
      show: true,
      subMenus: [
        {
          Icon: VscFileSubmodule,
          label: "Designation",
          path: "/administration/designations",
          show: permissionGuard(PermissionResource.DESIGNATION, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Work Sites",
          path: "/administration/work-sites",
          show: permissionGuard(PermissionResource.WORK_SITE, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Employment Status",
          path: "/administration/employment-status",
          show: permissionGuard(PermissionResource.EMPLOYMENT_STATUS, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Leave Types",
          path: "/administration/leave-types",
          show: permissionGuard(PermissionResource.LEAVE_TYPE, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Departments",
          path: "/administration/departments",
          show: permissionGuard(PermissionResource.DEPARTMENT, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Work Schedules",
          path: "/administration/work-schedules",
          show: permissionGuard(PermissionResource.WORK_SCHEDULE, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
      ],
    },
    // ASSET MANAGEMENT MENU
    {
      Icon: VscFileSubmodule,
      label: "Asset Management",
      path: "/asset-management",
      show: true,
      subMenus: [
        {
          Icon: VscFileSubmodule,
          label: "Asset Types",
          path: "/asset-management/asset-types",
          show: permissionGuard(PermissionResource.ASSET_TYPE, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Assets",
          path: "/asset-management/assets",
          show: permissionGuard(PermissionResource.ASSET, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
      ],
    },
    // ATTENDANCE MANAGEMENT MENU
    {
      Icon: PiClock,
      label: menuNames.attendance_management,
      path: "/attendance-management",
      show: true,
      subMenus: [
        {
          Icon: PiClock,
          label: "Attendance",
          path: "/attendance-management/attendance",
          show: true,
          subMenus: [],
        },
      ],
    },
    // LEAVE MANAGEMENT MENU
    {
      Icon: VscFileSubmodule,
      label: menuNames.leave_management,
      path: "/leave-management",
      show: true,
      subMenus: [
        {
          Icon: VscFileSubmodule,
          label: "Leave Records",
          path: "/leave-management/leave-records",
          show: true,
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Holidays",
          path: "/leave-management/holidays",
          show: true,
          subMenus: [],
        },
      ],
    },
    // PAYROLL MANAGEMENT MENU
    {
      Icon: MdOutlineBusinessCenter,
      label: menuNames.payroll_management,
      path: "/payroll-management",
      show: true,
      subMenus: [
        {
          Icon: VscFileSubmodule,
          label: "Payroll Components",
          path: "/payroll-management/payroll-components",
          show: true,
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Payroll Cycles",
          path: "/payroll-management/payroll-cycles",
          show: true,
          subMenus: [],
        },
        {
          Icon: PiReceipt,
          label: "All Payslips",
          path: "/payroll-management/payslips",
          show: true,
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
        permissionGuard(PermissionResource.ATTENDANCE_SETTINGS, [
          PermissionAction.READ,
        ]) ||
        permissionGuard(PermissionResource.LEAVE_SETTINGS, [
          PermissionAction.READ,
        ]) ||
        permissionGuard(PermissionResource.BUSINESS_SETTINGS, [
          PermissionAction.READ,
        ]),
      subMenus: [
        {
          Icon: VscFileSubmodule,
          label: "Attendance Settings",
          path: "/settings/attendance-settings",
          show: permissionGuard(PermissionResource.ATTENDANCE_SETTINGS, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Leave Settings",
          path: "/settings/leave-settings",
          show: permissionGuard(PermissionResource.LEAVE_SETTINGS, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Business Settings",
          path: "/settings/business-settings",
          show: permissionGuard(PermissionResource.BUSINESS_SETTINGS, [
            PermissionAction.READ,
          ]),
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
