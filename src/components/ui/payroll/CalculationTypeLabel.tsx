"use client";

import { CalculationType } from "@/types";

// ==================== INTERFACES ====================
interface ICalculationTypeLabelProps {
  type: CalculationType;
  className?: string;
}

// ==================== COMPONENT ====================
export default function CalculationTypeLabel({
  type,
  className = "",
}: ICalculationTypeLabelProps) {
  const getLabel = () => {
    switch (type) {
      case CalculationType.FIXED_AMOUNT:
        return "Fixed Amount";
      case CalculationType.PERCENTAGE_OF_BASIC:
        return "Percentage of Basic Salary";
      case CalculationType.PERCENTAGE_OF_GROSS:
        return "Percentage of Gross Salary";
      case CalculationType.HOURLY_RATE:
        return "Hourly Rate";
      default:
        return (type as any).replace(/_/g, " ");
    }
  };

  return <span className={`text-inherit ${className}`}>{getLabel()}</span>;
}
