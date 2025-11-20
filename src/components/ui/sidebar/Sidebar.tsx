'"use client";';

import {
  MdOutlineBusinessCenter,
  MdOutlineDashboard,
  MdOutlineSubscriptions,
  MdSettings,
} from "react-icons/md";
import SidebarGenerator from "./SidebarGenerator";
import { VscFileSubmodule } from "react-icons/vsc";
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
  const { permissions } = useAppStore((state) => state);
  console.log({ permissions });
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
      Icon: VscFileSubmodule,
      label: "Recruitment",
      path: "/recruitment",
      show: true,
      subMenus: [
        {
          Icon: VscFileSubmodule,
          label: "Job Types",
          path: "/recruitment/job-types",
          show: permissionGuard(PermissionResource.JOB_TYPE, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Recruitment Processes",
          path: "/recruitment/recruitment-processes",
          show: permissionGuard(PermissionResource.RECRUITMENT_PROCESS, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Onboarding Processes",
          path: "/recruitment/onboarding-processes",
          show: permissionGuard(PermissionResource.ONBOARDING_PROCESS, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
        {
          Icon: VscFileSubmodule,
          label: "Job Platforms",
          path: "/recruitment/job-platforms",
          show: permissionGuard(PermissionResource.JOB_PLATFORM, [
            PermissionAction.READ,
          ]),
          subMenus: [],
        },
      ],
    },
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
