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
  // GET WINDOW WIDTH
  // REDUX STATE DISPATCH
  // GET CURRENT PATH
  const pathname = usePathname();
  // SUBMENU OPEN STATE
  const [detailsOpen, setDetailsOpen] = useState(false);

  // HANDLE LINK CLICK TOGGLE SIDEBAR
  const handleLinkClick = () => {
    setIsSidebarOpen(false);
    // if (windowInnerWidth < 768) {
    //   setDetailsOpen(false);
    // }
  };

  // GET ACTIVE SUBMENU
  const isSubmenuActive = subMenus?.some((menu) => menu.path === pathname);

  // CHECK IF MENU HAS SUBMENU
  const hasChildren = subMenus && subMenus.length > 0;

  // IF SUB MENU IS ACTIVE, OPEN PARENT MENU
  useEffect(() => {
    if (isSubmenuActive) setDetailsOpen(true);
    return () => {};
  }, [isSubmenuActive]);

  // HANDLE MENU VISIBILITY

  // RENDER
  return (
    <Fragment key={`${label}-${path}`}>
      {hasChildren ? (
        <details
          open={detailsOpen}
          onToggle={(e) => setDetailsOpen(e.currentTarget.open)}
          className={""}
        >
          <summary
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-colors cursor-pointer group
                            ${
                              isSubmenuActive
                                ? "bg-primary text-sm md:text-base font-medium text-base-300"
                                : "hover:bg-secondary-content"
                            }
                            `}
          >
            <div
              className={` flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                isSubmenuActive
                  ? "bg-[#bb0606] text-base-300"
                  : "group-hover:bg-base-100 group-hover:text-primary"
              }`}
            >
              {<Icon className="w-4 h-4" />}
            </div>

            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap flex-grow text-heading"
            >
              {label}
            </motion.span>

            <IoIosArrowUp
              className={`transform transition-transform duration-200 ${
                detailsOpen ? "rotate-0" : "rotate-180"
              }`}
            />
          </summary>

          {/* SUB MENU ITEMS  */}
          <AnimatePresence initial={false} key={`submenu-${label}`}>
            {detailsOpen && (
              <motion.div
                key="submenu-content"
                className={`flex flex-col pl-5 pt-0.5`}
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                {subMenus
                  ?.filter((child) => child.show)
                  .map((child) => (
                    <Link
                      key={child.path}
                      href={child?.path}
                      onClick={handleLinkClick}
                      className={`flex items-center justify-start gap-2.5 p-1.5 cursor-pointer text-sm border-l-2 drop-shadow-md group
                                                        ${
                                                          pathname ===
                                                          child?.path
                                                            ? "text-primary font-medium bg-primary-content border-l-primary"
                                                            : "hover:bg-primary-content  border-l-base-300"
                                                        }
                                                      `}
                    >
                      <div
                        className={`rounded-full w-3 h-3 ${
                          child?.path === pathname
                            ? "bg-primary"
                            : "hover:bg-primary bg-primary-content group-hover:bg-primary group-hover:text-base-300"
                        }`}
                      />
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
          className={`
            flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group
            ${
              path === pathname
                ? "bg-primary text-sm md:text-base font-medium text-base-300"
                : "hover:bg-secondary-content"
            }
          `}
        >
          {/* ICON */}
          <div
            className={`
              flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
              ${
                pathname === path
                  ? "bg-[#bb0606] text-base-300"
                  : "bg-base-200 text-muted group-hover:bg-base-100 group-hover:text-primary"
              }
            `}
          >
            <Icon className="w-4 h-4" />
          </div>

          {/* LABEL */}
          {label}
        </Link>
      )}
    </Fragment>
  );
}
