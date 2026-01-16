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
import {
  BusinessSubscriptionStatus,
  SUBSCRIPTION_STATUS_METADATA,
} from "@/types/enums/subscription-status.enum";

// ==================== INTERFACES ====================
interface ISubscriptionStatusBadgeProps {
  status: string | BusinessSubscriptionStatus;
  onClick?: () => void;
  showTooltip?: boolean;
  className?: string;
}

interface IStatusConfig {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  description?: string;
}

// ==================== COMPONENT ====================
const SubscriptionStatusBadge = ({
  status,
  onClick,
  showTooltip = false,
  className = "",
}: ISubscriptionStatusBadgeProps) => {
  // ==================== STATUS CONFIGURATION ====================
  const getStatusConfig = (status: string): IStatusConfig => {
    const normalizedStatus = status.toUpperCase() as BusinessSubscriptionStatus;

    switch (normalizedStatus) {
      case BusinessSubscriptionStatus.TRIAL:
        return {
          icon: <PiHourglassHigh className="text-lg shrink-0" />,
          label: "Trial",
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-300",
          description:
            SUBSCRIPTION_STATUS_METADATA[BusinessSubscriptionStatus.TRIAL]
              .description,
        };

      case BusinessSubscriptionStatus.ACTIVE:
        return {
          icon: <PiCheckCircle className="text-lg shrink-0" />,
          label: "Active",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-300",
          description:
            SUBSCRIPTION_STATUS_METADATA[BusinessSubscriptionStatus.ACTIVE]
              .description,
        };

      case BusinessSubscriptionStatus.EXPIRED:
        return {
          icon: <PiXCircle className="text-lg shrink-0" />,
          label: "Expired",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-300",
          description:
            SUBSCRIPTION_STATUS_METADATA[BusinessSubscriptionStatus.EXPIRED]
              .description,
        };

      case BusinessSubscriptionStatus.CANCELLED:
        return {
          icon: <PiProhibit className="text-lg shrink-0" />,
          label: "Cancelled",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-300",
          description:
            SUBSCRIPTION_STATUS_METADATA[BusinessSubscriptionStatus.CANCELLED]
              .description,
        };

      case BusinessSubscriptionStatus.SUSPENDED:
        return {
          icon: <PiPauseCircle className="text-lg shrink-0" />,
          label: "Suspended",
          bgColor: "bg-orange-50",
          textColor: "text-orange-700",
          borderColor: "border-orange-300",
          description:
            SUBSCRIPTION_STATUS_METADATA[BusinessSubscriptionStatus.SUSPENDED]
              .description,
        };

      case BusinessSubscriptionStatus.PENDING:
        return {
          icon: <PiClock className="text-lg shrink-0" />,
          label: "Pending",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-300",
          description:
            SUBSCRIPTION_STATUS_METADATA[BusinessSubscriptionStatus.PENDING]
              .description,
        };

      // FALLBACK FOR UNKNOWN STATUSES
      default:
        return {
          icon: <PiWarningCircle className="text-lg shrink-0" />,
          label: status,
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
          borderColor: "border-gray-200",
          description: "Unknown subscription status",
        };
    }
  };

  const config = getStatusConfig(status);

  // ==================== RENDER ====================
  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        role="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all cursor-pointer shrink-0 ${config.bgColor} ${config.textColor} ${config.borderColor} hover:shadow-md hover:scale-105`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        title={showTooltip ? config.description : undefined}
      >
        {config.icon}
        <span className="font-semibold">{config.label}</span>
      </motion.div>

      {/* TOOLTIP (OPTIONAL) */}
      {showTooltip && config.description && (
        <motion.div
          className="absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-xs">{config.description}</div>
          {/* TOOLTIP ARROW */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full">
            <div className="border-4 border-transparent border-b-gray-900" />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SubscriptionStatusBadge;
