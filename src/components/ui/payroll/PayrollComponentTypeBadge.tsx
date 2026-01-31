"use client";

import { ComponentType } from "@/types";
import { PiBuildings, PiCurrencyDollar, PiMinus } from "react-icons/pi";

// ==================== INTERFACES ====================
interface IPayrollComponentTypeBadgeProps {
  type: ComponentType;
  size?: "sm" | "md" | "lg";
  className?: string; // Additional custom classes
}

// ==================== COMPONENT ====================
export default function PayrollComponentTypeBadge({
  type,
  size = "md",
  className = "",
}: IPayrollComponentTypeBadgeProps) {
  const sizeClasses = {
    sm: "badge-sm py-2 px-2 text-[10px]",
    md: "badge-md py-3 px-3",
    lg: "badge-lg py-4 px-4",
  };

  const iconSize = size === "sm" ? 12 : size === "md" ? 14 : 16;

  switch (type) {
    case ComponentType.EARNING:
      return (
        <span
          className={`badge badge-success gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiCurrencyDollar size={iconSize} className="shrink-0" />
          Earning
        </span>
      );
    case ComponentType.DEDUCTION:
      return (
        <span
          className={`badge badge-error gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiMinus size={iconSize} className="shrink-0" />
          Deduction
        </span>
      );
    case ComponentType.EMPLOYER_COST:
      return (
        <span
          className={`badge badge-info gap-1 ${sizeClasses[size]} ${className}`}
        >
          <PiBuildings size={iconSize} className="shrink-0" />
          Employer Cost
        </span>
      );
    default:
      return (
        <span className={`badge badge-ghost ${sizeClasses[size]} ${className}`}>
          {type}
        </span>
      );
  }
}
