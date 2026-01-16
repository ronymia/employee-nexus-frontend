import {
  PiCheckCircle,
  PiClock,
  PiHourglassHigh,
  PiPauseCircle,
  PiProhibit,
  PiWarningCircle,
  PiXCircle,
} from "react-icons/pi";
import { motion } from "motion/react";

// ==================== INTERFACES ====================
interface IStatusBadgeProps {
  status: string;
  onClick?: () => void;
}

interface IStatusConfig {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

// ==================== COMPONENT ====================
const StatusBadge = ({ status, onClick }: IStatusBadgeProps) => {
  // ==================== STATUS CONFIGURATION ====================
  const getStatusConfig = (status: string): IStatusConfig => {
    const normalizedStatus = status.toUpperCase();

    switch (normalizedStatus) {
      case "TRIAL":
        return {
          icon: <PiHourglassHigh className="text-lg" />,
          label: "Trial",
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-300",
        };

      case "ACTIVE":
        return {
          icon: <PiCheckCircle className="text-lg" />,
          label: "Active",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-300",
        };

      case "EXPIRED":
        return {
          icon: <PiXCircle className="text-lg" />,
          label: "Expired",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-300",
        };

      case "CANCELLED":
        return {
          icon: <PiProhibit className="text-lg" />,
          label: "Cancelled",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-300",
        };

      case "SUSPENDED":
        return {
          icon: <PiPauseCircle className="text-lg" />,
          label: "Suspended",
          bgColor: "bg-orange-50",
          textColor: "text-orange-700",
          borderColor: "border-orange-300",
        };

      case "PENDING":
        return {
          icon: <PiClock className="text-lg" />,
          label: "Pending",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-300",
        };

      // FALLBACK FOR LEGACY STATUSES
      case "INACTIVE":
        return {
          icon: <PiWarningCircle className="text-lg" />,
          label: "Inactive",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-300",
        };

      default:
        return {
          icon: <PiWarningCircle className="text-lg" />,
          label: status,
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
          borderColor: "border-gray-200",
        };
    }
  };

  const config = getStatusConfig(status);

  // ==================== RENDER ====================
  return (
    <motion.div
      role="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all cursor-pointer shrink-0 ${config.bgColor} ${config.textColor} ${config.borderColor} hover:shadow-md hover:scale-105`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {config.icon}
      <span className="font-semibold">{config.label}</span>
    </motion.div>
  );
};

export default StatusBadge;
