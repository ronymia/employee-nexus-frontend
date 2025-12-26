"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import moment from "moment";
import {
  PiCalendarBlank,
  PiClock,
  PiCheckCircle,
  PiXCircle,
  PiWarning,
  PiCaretLeft,
  PiCaretRight,
  PiAirplaneTilt,
  PiFile,
  PiDownload,
} from "react-icons/pi";
import { GET_LEAVES } from "@/graphql/leave.api";
import CustomLoading from "@/components/loader/CustomLoading";

interface ILeaveType {
  id: number;
  name: string;
}

interface IUser {
  id: number;
  email: string;
  profile?: {
    fullName: string;
  };
}

interface ILeave {
  id: number;
  userId: number;
  leaveTypeId: number;
  leaveYear: number;
  leaveDuration: string;
  startDate: string;
  endDate?: string;
  totalHours: number;
  status: string;
  reviewedAt?: string;
  reviewedBy?: number;
  rejectionReason?: string;
  attachments?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
  leaveType?: ILeaveType;
  reviewer?: IUser;
}

interface LeaveContentProps {
  userId: number;
}

export default function LeaveContent({ userId }: LeaveContentProps) {
  const [currentYear, setCurrentYear] = useState(moment().year());
  const [selectedLeave, setSelectedLeave] = useState<ILeave | null>(null);

  // Fetch leaves for the user
  const {
    data: leavesData,
    loading,
    refetch,
  } = useQuery<{
    leaves: {
      data: ILeave[];
    };
  }>(GET_LEAVES, {
    variables: {
      query: {
        userId: userId,
        leaveYear: currentYear,
      },
    },
    skip: !userId,
  });

  const leaves = leavesData?.leaves?.data || [];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <PiCheckCircle size={20} className="text-success" />;
      case "rejected":
        return <PiXCircle size={20} className="text-error" />;
      case "pending":
        return <PiWarning size={20} className="text-warning" />;
      default:
        return <PiAirplaneTilt size={20} className="text-base-content/60" />;
    }
  };

  const getStatusBadge = (status: string) => {
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
      default:
        return (
          <span className="badge badge-ghost gap-1">
            <PiAirplaneTilt size={14} />
            {status}
          </span>
        );
    }
  };

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case "full_day":
        return "Full Day";
      case "first_half":
        return "First Half";
      case "second_half":
        return "Second Half";
      case "custom_hours":
        return "Custom Hours";
      default:
        return duration;
    }
  };

  // Refetch when year changes
  const handleYearChange = (newYear: number) => {
    setCurrentYear(newYear);
    refetch({
      query: {
        userId: userId,
        leaveYear: newYear,
      },
    });
  };

  // Calculate yearly stats
  const yearlyStats = {
    pending: leaves.filter((l: ILeave) => l.status === "pending").length,
    approved: leaves.filter((l: ILeave) => l.status === "approved").length,
    rejected: leaves.filter((l: ILeave) => l.status === "rejected").length,
    totalDays: leaves
      .filter((l: ILeave) => l.status === "approved")
      .reduce((sum: number, l: ILeave) => {
        if (l.leaveDuration === "full_day") {
          return (
            sum +
            (l.endDate
              ? moment(l.endDate).diff(moment(l.startDate), "days") + 1
              : 1)
          );
        } else if (
          l.leaveDuration === "first_half" ||
          l.leaveDuration === "second_half"
        ) {
          return sum + 0.5;
        } else {
          return sum + l.totalHours / 8;
        }
      }, 0),
    totalHours: leaves
      .filter((l: ILeave) => l.status === "approved")
      .reduce((sum: number, l: ILeave) => sum + (l.totalHours || 0), 0),
  };

  // Group leaves by month
  const leavesByMonth = leaves.reduce((acc: any, leave: ILeave) => {
    const month = moment(leave.startDate).format("MMMM YYYY");
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(leave);
    return acc;
  }, {});

  if (loading) {
    return <CustomLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Year Navigation */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-base-content">
            Leave Records
          </h3>
          <p className="text-sm text-base-content/60">Year {currentYear}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => handleYearChange(currentYear - 1)}
          >
            <PiCaretLeft size={20} />
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => handleYearChange(moment().year())}
          >
            Current Year
          </button>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => handleYearChange(currentYear + 1)}
          >
            <PiCaretRight size={20} />
          </button>
        </div>
      </div>

      {/* Yearly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <PiWarning size={20} className="text-warning" />
            <div>
              <p className="text-xs text-base-content/60">Pending</p>
              <p className="text-lg font-bold text-warning">
                {yearlyStats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <PiCheckCircle size={20} className="text-success" />
            <div>
              <p className="text-xs text-base-content/60">Approved</p>
              <p className="text-lg font-bold text-success">
                {yearlyStats.approved}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-error/10 border border-error/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <PiXCircle size={20} className="text-error" />
            <div>
              <p className="text-xs text-base-content/60">Rejected</p>
              <p className="text-lg font-bold text-error">
                {yearlyStats.rejected}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <PiCalendarBlank size={20} className="text-primary" />
            <div>
              <p className="text-xs text-base-content/60">Total Days</p>
              <p className="text-lg font-bold text-primary">
                {yearlyStats.totalDays.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <PiClock size={20} className="text-info" />
            <div>
              <p className="text-xs text-base-content/60">Total Hours</p>
              <p className="text-lg font-bold text-info">
                {yearlyStats.totalHours.toFixed(1)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Records by Month */}
      {leaves.length === 0 ? (
        <div className="bg-base-100 rounded-lg shadow-sm border border-primary/20 p-12 text-center">
          <PiAirplaneTilt
            size={48}
            className="text-base-content/20 mx-auto mb-4"
          />
          <p className="text-base-content/60">
            No leave records found for {currentYear}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.keys(leavesByMonth)
            .sort((a, b) => moment(b, "MMMM YYYY").diff(moment(a, "MMMM YYYY")))
            .map((month) => (
              <div
                key={month}
                className="bg-base-100 rounded-lg shadow-sm border border-primary/20 p-4"
              >
                <h4 className="text-sm font-semibold text-base-content mb-3">
                  {month}
                </h4>
                <div className="space-y-2">
                  {leavesByMonth[month].map((leave: ILeave) => (
                    <div
                      key={leave.id}
                      className="bg-base-200/50 rounded-lg p-4 border border-base-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedLeave(leave)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <PiAirplaneTilt size={18} className="text-primary" />
                          <span className="font-semibold text-base-content">
                            {leave.leaveType?.name || "Leave"}
                          </span>
                        </div>
                        {getStatusBadge(leave.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-base-content/60">Period</p>
                          <p className="text-base-content/80">
                            {leave.endDate
                              ? `${moment(leave.startDate).format(
                                  "MMM DD"
                                )} - ${moment(leave.endDate).format(
                                  "MMM DD, YYYY"
                                )}`
                              : moment(leave.startDate).format("MMM DD, YYYY")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">
                            Duration
                          </p>
                          <p className="text-base-content/80">
                            {getDurationLabel(leave.leaveDuration)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">
                            Total Hours
                          </p>
                          <p className="text-base-content/80">
                            {leave.totalHours}h
                          </p>
                        </div>
                      </div>

                      {leave.notes && (
                        <div className="mt-2 pt-2 border-t border-base-300">
                          <p className="text-xs text-base-content/60 italic">
                            {leave.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Selected Leave Details Modal */}
      {selectedLeave && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLeave(null)}
        >
          <div
            className="bg-base-100 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-base-100 border-b border-base-300 p-6 flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <PiAirplaneTilt size={24} />
                  {selectedLeave.leaveType?.name || "Leave Details"}
                </h4>
                <p className="text-sm text-base-content/60 mt-1">
                  {selectedLeave.endDate
                    ? `${moment(selectedLeave.startDate).format(
                        "MMMM DD"
                      )} - ${moment(selectedLeave.endDate).format(
                        "MMMM DD, YYYY"
                      )}`
                    : moment(selectedLeave.startDate).format("MMMM DD, YYYY")}
                </p>
              </div>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedLeave(null)}
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-base-content/60 mb-1">Status</p>
                  {getStatusBadge(selectedLeave.status)}
                </div>
                <div>
                  <p className="text-xs text-base-content/60 mb-1">Duration</p>
                  <p className="font-semibold">
                    {getDurationLabel(selectedLeave.leaveDuration)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-base-content/60 mb-1">
                    Total Hours
                  </p>
                  <p className="font-semibold">{selectedLeave.totalHours}h</p>
                </div>
                <div>
                  <p className="text-xs text-base-content/60 mb-1">
                    Leave Year
                  </p>
                  <p className="font-semibold">{selectedLeave.leaveYear}</p>
                </div>
              </div>

              {/* Period Details */}
              <div className="bg-base-200/50 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-base-content mb-3">
                  Period Details
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-base-content/60 mb-1">
                      Start Date
                    </p>
                    <p className="text-sm text-base-content/80">
                      {moment(selectedLeave.startDate).format("MMMM DD, YYYY")}
                    </p>
                  </div>
                  {selectedLeave.endDate && (
                    <div>
                      <p className="text-xs text-base-content/60 mb-1">
                        End Date
                      </p>
                      <p className="text-sm text-base-content/80">
                        {moment(selectedLeave.endDate).format("MMMM DD, YYYY")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedLeave.notes && (
                <div className="bg-base-200/50 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-base-content mb-2">
                    Notes
                  </h5>
                  <p className="text-sm text-base-content/80">
                    {selectedLeave.notes}
                  </p>
                </div>
              )}

              {/* Review Details */}
              {(selectedLeave.reviewedAt || selectedLeave.rejectionReason) && (
                <div className="bg-base-200/50 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-base-content mb-3">
                    Review Details
                  </h5>
                  <div className="space-y-2">
                    {selectedLeave.reviewedAt && (
                      <div>
                        <p className="text-xs text-base-content/60 mb-1">
                          Reviewed At
                        </p>
                        <p className="text-sm text-base-content/80">
                          {moment(selectedLeave.reviewedAt).format(
                            "MMMM DD, YYYY hh:mm A"
                          )}
                        </p>
                      </div>
                    )}
                    {selectedLeave.reviewer && (
                      <div>
                        <p className="text-xs text-base-content/60 mb-1">
                          Reviewed By
                        </p>
                        <p className="text-sm text-base-content/80">
                          {selectedLeave.reviewer.profile?.fullName ||
                            selectedLeave.reviewer.email}
                        </p>
                      </div>
                    )}
                    {selectedLeave.rejectionReason && (
                      <div>
                        <p className="text-xs text-base-content/60 mb-1">
                          Rejection Reason
                        </p>
                        <p className="text-sm text-error">
                          {selectedLeave.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {selectedLeave.attachments &&
                selectedLeave.attachments.length > 0 && (
                  <div className="bg-base-200/50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-base-content mb-3">
                      Attachments
                    </h5>
                    <div className="space-y-2">
                      {selectedLeave.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <PiFile size={16} />
                          <span>Attachment {index + 1}</span>
                          <PiDownload size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {/* Timestamps */}
              <div className="bg-base-200/50 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-base-content mb-3">
                  Timestamps
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-base-content/60 mb-1">
                      Created At
                    </p>
                    <p className="text-sm text-base-content/80">
                      {moment(selectedLeave.createdAt).format(
                        "MMMM DD, YYYY hh:mm A"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 mb-1">
                      Updated At
                    </p>
                    <p className="text-sm text-base-content/80">
                      {moment(selectedLeave.updatedAt).format(
                        "MMMM DD, YYYY hh:mm A"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-base-100 rounded-lg shadow-sm border border-primary/20 p-4">
        <h5 className="text-sm font-semibold text-base-content mb-3">Legend</h5>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <PiWarning size={16} className="text-warning" />
            <span className="text-xs">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <PiCheckCircle size={16} className="text-success" />
            <span className="text-xs">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <PiXCircle size={16} className="text-error" />
            <span className="text-xs">Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
