"use client";

import ProfileAvatar from "./ProfileAvatar";
import { MdMenuOpen } from "react-icons/md";
import type { Dispatch, SetStateAction } from "react";

interface INavbarProps {
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setIsSidebarOpen }: INavbarProps) {
  return (
    <nav
      key="navbar"
      className={`h-20 px-3 flex items-center justify-end md:justify-between rounded-box bg-base-300 shadow`}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <MdMenuOpen
          size={36}
          onClick={() => setIsSidebarOpen(true)}
          className=""
        />
        {/* <QuickSearchSearchInput /> */}
      </div>

      {/* RIGHT SIDE */}
      <ProfileAvatar />
    </nav>
  );
}
