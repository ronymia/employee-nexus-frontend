"use client";

import Navbar from "@/components/ui/navbar/Navbar";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import useAuthGuard from "@/hooks/useAuthGuard";
import useDimensions from "@/hooks/useDimensions";
import { AnimatePresence, motion } from "motion/react";
import React, { useRef, useState } from "react";

export default function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(isSidebarOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);
  const { isAuthenticated } = useAuthGuard();

  // if (!isAuthenticated) {
  //   return <div>Redirecting...</div>;
  // }

  return (
    <div className={`h-screen p-4 bg-[#f9fbfc] overflow-hidden relative`}>
      {/* Sidebar */}
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />
      {/* SIDEBAR MENU */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            key={`sidebar`}
            layout
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: isSidebarOpen ? 260 : 0,
              opacity: isSidebarOpen ? 1 : 0,
            }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={`flex flex-col shadow-lg bg-base-300 text-primary rounded-box overflow-auto pb-5 h-full absolute top-0 left-0 z-10`}
          >
            <motion.nav
              initial={false}
              animate={isOpen ? "open" : "closed"}
              custom={height}
              ref={containerRef}
              className={`pt-16`}
            >
              <Sidebar
                setIsSidebarOpen={setIsSidebarOpen}
                setIsOpen={setIsOpen}
              />
            </motion.nav>
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Main Content Area */}
      {/* CONTENT */}
      <motion.div
        layout
        className={`bg-base-300 rounded-box overflow-auto h-[calc(100vh-80px)] p-3 mt-4`}
      >
        {children}
      </motion.div>
    </div>
  );
}
