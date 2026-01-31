import { PiCheckCircle, PiClock, PiXCircle, PiPackage } from "react-icons/pi";

// ==================== INTERFACES ====================
interface IAssetStatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

// ==================== COMPONENT ====================
export default function AssetStatusBadge({
  status,
  size = "sm",
  showIcon = true,
}: IAssetStatusBadgeProps) {
  // ==================== HELPER FUNCTIONS ====================
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
      case "assigned":
      case "assign":
        return {
          className: "badge-success",
          icon: <PiCheckCircle size={16} />,
          label: "Assigned",
        };
      case "returned":
        return {
          className: "badge-info",
          icon: <PiClock size={16} />,
          label: "Returned",
        };
      case "unassigned":
        return {
          className: "badge-warning",
          icon: <PiPackage size={16} />,
          label: "Unassigned",
        };
      case "damaged":
      case "damage":
        return {
          className: "badge-error",
          icon: <PiXCircle size={16} />,
          label: "Damaged",
        };
      case "lost":
        return {
          className: "badge-error",
          icon: <PiXCircle size={16} />,
          label: "Lost",
        };
      default:
        return {
          className: "badge-ghost",
          icon: <PiPackage size={16} />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClass =
    size === "lg" ? "badge-lg" : size === "md" ? "badge-md" : "badge-sm";

  // ==================== RENDER ====================
  return (
    <span
      className={`badge ${sizeClass} ${config.className} gap-1 font-semibold`}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
}
