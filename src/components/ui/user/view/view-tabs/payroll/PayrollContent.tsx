"use client";

import { useState } from "react";
import PaySlipContent from "../payslip/PaySlipContent";
import EmployeePayrollComponent from "./EmployeePayrollComponent";

interface IPayrollContentProps {
  userId: number;
}

export default function PayrollContent({ userId }: IPayrollContentProps) {
  const [activeSubTab, setActiveSubTab] = useState<"payslip" | "components">(
    "components",
  );

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab("components")}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeSubTab === "components"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Payroll Components
        </button>
        <button
          onClick={() => setActiveSubTab("payslip")}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeSubTab === "payslip"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Payslip
        </button>
      </div>

      <div className="mt-4">
        {activeSubTab === "payslip" && <PaySlipContent userId={userId} />}
        {activeSubTab === "components" && (
          <EmployeePayrollComponent userId={userId} />
        )}
      </div>
    </div>
  );
}
