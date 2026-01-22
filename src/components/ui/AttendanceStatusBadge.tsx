import { PiCheckCircle, PiXCircle, PiWarning, PiMinus } from "react-icons/pi";

interface IAttendanceStatusBadgeProps {
  status: string;
}

export default function AttendanceStatusBadge({
  status,
}: IAttendanceStatusBadgeProps) {
  if (!status) return null;

  switch (status.toLowerCase()) {
    case "approved":
      return (
        <span className="badge badge-success gap-1">
          <PiCheckCircle size={14} />
          Approved
        </span>
      );
    case "rejected":
      return (
        <span className="badge badge-error gap-1">
          <PiXCircle size={14} />
          Rejected
        </span>
      );
    case "pending":
      return (
        <span className="badge badge-warning gap-1">
          <PiWarning size={14} />
          Pending
        </span>
      );
    case "present":
      return (
        <span className="badge badge-success gap-1">
          <PiCheckCircle size={14} />
          Present
        </span>
      );
    case "absent":
      return (
        <span className="badge badge-error gap-1">
          <PiXCircle size={14} />
          Absent
        </span>
      );
    case "late":
      return (
        <span className="badge badge-warning gap-1">
          <PiWarning size={14} />
          Late
        </span>
      );
    case "half_day":
      return (
        <span className="badge badge-info gap-1">
          <PiMinus size={14} />
          Half Day
        </span>
      );
    default:
      return <span className="badge badge-ghost min-w-[80px]">{status}</span>;
  }
}
