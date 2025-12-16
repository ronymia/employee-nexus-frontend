import React from "react";
import { PiRadioButtonFill, PiXCircle } from "react-icons/pi";

interface IStatusBadgeProps {
  status: string;
  onClick?: () => void;
}

const StatusBadge = ({ status, onClick }: IStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          icon: <PiRadioButtonFill className="text-success text-lg" />,
          label: "Active",
          className: "border-base-100 text-success",
        };
      case "inactive":
        return {
          icon: <PiXCircle className="text-error text-lg" />,
          label: "Inactive",
          className: "border-error text-error",
        };
      default:
        return {
          icon: null,
          label: status,
          className: "border-base-300 text-base-content",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      role="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 text-sm font-medium transition-colors hover:bg-base-200 cursor-pointer ${config.className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

export default StatusBadge;
