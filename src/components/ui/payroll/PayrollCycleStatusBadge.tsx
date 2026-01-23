"use client";

import { PayrollCycleStatus } from "@/types";
import { PiCheckCircle, PiClock, PiFileText } from "react-icons/pi";

// ==================== INTERFACES ====================
interface IPayrollCycleStatusBadgeProps {
  status: PayrollCycleStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ==================== COMPONENT ====================
export default function PayrollCycleStatusBadge({
  status,
  size = "md",
  className = "",
}: IPayrollCycleStatusBadgeProps) {
  const sizeClasses = {
    sm: "badge-sm py-2 px-2 text-[10px]",
    md: "badge-md py-3 px-3",
    lg: "badge-lg py-4 px-4",
  };

  const iconSize = size === "sm" ? 12 : size === "md" ? 14 : 16;

  switch (status) {
    case PayrollCycleStatus.DRAFT:
      return (
        <span
          className={`badge badge-ghost gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiFileText size={iconSize} className="shrink-0" />
          Draft
        </span>
      );
    case PayrollCycleStatus.PROCESSING:
      return (
        <span
          className={`badge badge-warning gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiClock size={iconSize} className="shrink-0" />
          Processing
        </span>
      );
    case PayrollCycleStatus.APPROVED:
      return (
        <span
          className={`badge badge-info gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiCheckCircle size={iconSize} className="shrink-0" />
          Approved
        </span>
      );
    case PayrollCycleStatus.PAID:
      return (
        <span
          className={`badge badge-success gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiCheckCircle size={iconSize} className="shrink-0" />
          Paid
        </span>
      );
    case PayrollCycleStatus.CANCELLED:
      return (
        <span
          className={`badge badge-error gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiFileText size={iconSize} className="shrink-0" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className={`badge badge-ghost ${sizeClasses[size]} ${className}`}>
          {status}
        </span>
      );
  }
}
