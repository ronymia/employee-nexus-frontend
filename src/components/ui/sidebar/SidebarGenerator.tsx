"use client";

import {
  Fragment,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { IoIosArrowUp } from "react-icons/io";
import { AnimatePresence, motion } from "motion/react";
import { IMenuItems } from "@/types";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface ISidebarGeneratorProps extends IMenuItems {
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SidebarGenerator({
  Icon,
  label,
  path,
  subMenus,
  setIsSidebarOpen,
}: ISidebarGeneratorProps) {
  const pathname = usePathname();
  const [detailsOpen, setDetailsOpen] = useState(false);

  // HANDLE LINK CLICK TOGGLE SIDEBAR
  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  // GET ACTIVE SUBMENU
  const isSubmenuActive = subMenus?.some((menu) => menu.path === pathname);

  // CHECK IF MENU HAS SUBMENU
  const hasChildren = subMenus && subMenus.length > 0;

  // IF SUB MENU IS ACTIVE, OPEN PARENT MENU
  useEffect(() => {
    if (isSubmenuActive) setDetailsOpen(true);
  }, [isSubmenuActive]);

  // RENDER
  return (
    <Fragment key={`${label}-${path}`}>
      {hasChildren ? (
        <details
          open={detailsOpen}
          onToggle={(e) => setDetailsOpen(e.currentTarget.open)}
        >
          <summary
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-200 cursor-pointer group ${
              isSubmenuActive
                ? "bg-primary text-base-300 font-medium"
                : "hover:bg-base-200"
            }`}
          >
            {/* ICON */}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                isSubmenuActive
                  ? "bg-primary-content text-primary"
                  : "bg-base-200 group-hover:bg-base-300"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>

            {/* LABEL */}
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap grow text-sm md:text-base"
            >
              {label}
            </motion.span>

            {/* ARROW ICON */}
            <IoIosArrowUp
              className={`w-4 h-4 transform transition-transform duration-200 ${
                detailsOpen ? "rotate-0" : "rotate-180"
              }`}
            />
          </summary>

          {/* SUB MENU ITEMS */}
          <AnimatePresence initial={false}>
            {detailsOpen && (
              <motion.div
                key="submenu-content"
                className="flex flex-col pl-5 pt-1 pb-1 bg-base-100/50"
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
              >
                {subMenus
                  ?.filter((child) => child.show)
                  .map((child) => (
                    <Link
                      key={child.path}
                      href={child?.path}
                      onClick={handleLinkClick}
                      className={`flex items-center px-3 py-2 text-sm transition-all duration-200 border-b-2 border-b-primary-content ${
                        pathname === child?.path
                          ? "bg-primary-content text-primary font-medium border-l-2 border-l-primary"
                          : "hover:bg-base-300 border-l-base-300"
                      }`}
                    >
                      {child?.label}
                    </Link>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </details>
      ) : (
        <Link
          href={path}
          onClick={handleLinkClick}
          className={`flex items-center gap-2.5 px-3 py-2.5 transition-all duration-200 group ${
            path === pathname
              ? "bg-primary text-base-300 font-medium"
              : "hover:bg-base-200"
          }`}
        >
          {/* ICON */}
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
              pathname === path
                ? "bg-primary-content text-primary"
                : "bg-base-200 group-hover:bg-base-300"
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>

          {/* LABEL */}
          <span className="text-sm md:text-base">{label}</span>
        </Link>
      )}
    </Fragment>
  );
}
