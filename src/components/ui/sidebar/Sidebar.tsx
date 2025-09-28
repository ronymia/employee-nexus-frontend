'"use client";';

import {
  MdOutlineBusinessCenter,
  MdOutlineDashboard,
  MdOutlineSubscriptions,
} from "react-icons/md";
import SidebarGenerator from "./SidebarGenerator";
import { VscFileSubmodule } from "react-icons/vsc";
import MenuToggle from "./MenuToggle";
import type { IMenuItems } from "@/types";
import { motion } from "motion/react";
import type { Dispatch, SetStateAction } from "react";
import { menuNames } from "@/constants/menu";

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
      show: true,
      subMenus: [],
    },
    {
      Icon: MdOutlineSubscriptions,
      label: menuNames.subscription_plans,
      path: "/subscription-plans",
      show: true,
      subMenus: [],
    },
    {
      Icon: VscFileSubmodule,
      label: menuNames.system_modules,
      path: "/system-modules",
      show: true,
      subMenus: [],
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
