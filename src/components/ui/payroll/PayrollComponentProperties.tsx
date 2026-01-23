"use client";

// ==================== INTERFACES ====================
interface IPayrollComponentPropertiesProps {
  isTaxable?: boolean;
  isStatutory?: boolean;
  size?: "sm" | "md";
  className?: string;
}

// ==================== COMPONENT ====================
export default function PayrollComponentProperties({
  isTaxable,
  isStatutory,
  size = "sm",
  className = "",
}: IPayrollComponentPropertiesProps) {
  if (!isTaxable && !isStatutory) return null;

  const badgeSize = size === "sm" ? "badge-sm py-2" : "badge-md py-3";

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {isTaxable && (
        <span className={`badge ${badgeSize} badge-warning`}>Taxable</span>
      )}
      {isStatutory && (
        <span className={`badge ${badgeSize} badge-info`}>Statutory</span>
      )}
    </div>
  );
}
