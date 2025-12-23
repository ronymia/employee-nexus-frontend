"use client";

import Link from "next/link";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BiArrowBack } from "react-icons/bi";

// ==================== EMPLOYEE NOT FOUND COMPONENT ====================
export default function EmployeeNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 md:p-6">
      <div className="max-w-md w-full">
        {/* CARD CONTAINER */}
        <div className="bg-linear-to-br from-white to-red-50/30 border-2 border-red-200/50 rounded-xl p-6 md:p-8 shadow-xl text-center">
          {/* ICON */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <HiOutlineUserGroup className="text-5xl md:text-6xl text-red-600" />
            </div>
          </div>

          {/* HEADING */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Employee Not Found
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            The employee you're looking for doesn't exist or may have been
            removed. Please check the employee ID and try again.
          </p>

          {/* ACTION BUTTON */}
          <Link
            href="/user-management/employees"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <BiArrowBack className="text-xl" />
            <span>Back to Employees</span>
          </Link>

          {/* ADDITIONAL HELP */}
          <div className="mt-6 pt-6 border-t border-red-200">
            <p className="text-xs md:text-sm text-gray-500">
              Need help?{" "}
              <Link
                href="/support"
                className="text-red-600 hover:text-red-700 font-medium underline"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
