"use client";

import { PayrollItemStatus } from "@/types";
import { PiCheckCircle, PiClock, PiWarning, PiXCircle } from "react-icons/pi";

// ==================== INTERFACES ====================
interface IPayrollItemStatusBadgeProps {
  status: PayrollItemStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ==================== COMPONENT ====================
export default function PayrollItemStatusBadge({
  status,
  size = "md",
  className = "",
}: IPayrollItemStatusBadgeProps) {
  const sizeClasses = {
    sm: "badge-sm py-2 px-2 text-[10px]",
    md: "badge-md py-3 px-3",
    lg: "badge-lg py-4 px-4",
  };

  const iconSize = size === "sm" ? 12 : size === "md" ? 14 : 16;

  switch (status) {
    case PayrollItemStatus.PENDING:
      return (
        <span
          className={`badge badge-warning gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiClock size={iconSize} className="shrink-0" />
          Pending
        </span>
      );
    case PayrollItemStatus.APPROVED:
      return (
        <span
          className={`badge badge-info gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiCheckCircle size={iconSize} className="shrink-0" />
          Approved
        </span>
      );
    case PayrollItemStatus.PAID:
      return (
        <span
          className={`badge badge-success gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiCheckCircle size={iconSize} className="shrink-0" />
          Paid
        </span>
      );
    case PayrollItemStatus.ON_HOLD:
      return (
        <span
          className={`badge badge-ghost gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiWarning size={iconSize} className="shrink-0" />
          On Hold
        </span>
      );
    case PayrollItemStatus.CANCELLED:
      return (
        <span
          className={`badge badge-error gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiXCircle size={iconSize} className="shrink-0" />
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
