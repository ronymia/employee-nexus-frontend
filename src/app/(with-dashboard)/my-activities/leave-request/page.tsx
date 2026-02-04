"use client";

// ==================== EXTERNAL IMPORTS ====================
import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { TableColumnType, ILeave, LeaveDuration } from "@/types";
import {
  PiCheckCircle,
  PiXCircle,
  PiPlusCircle,
  PiClock,
  PiCalendar,
  PiCalendarPlus,
} from "react-icons/pi";
import { LiaUserClockSolid } from "react-icons/lia";
import { GET_LEAVES } from "@/graphql/leave.api";
import { customFormatDate } from "@/utils/date-format.utils";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import useAuthGuard from "@/hooks/useAuthGuard";
import useAppStore from "@/hooks/useAppStore";
import PageHeader from "@/components/ui/PageHeader";
import CustomTable from "@/components/table/CustomTable";
import OverviewCard from "@/components/card/OverviewCard";
import AttendanceStatusBadge from "@/components/ui/AttendanceStatusBadge";
import { motion } from "motion/react";

// ==================== LOCAL IMPORTS ====================
import LeaveRequestForm from "./LeaveRequestForm";
// Import LeaveRecord from the leave management module to reuse it
import LeaveRecord from "@/app/(with-dashboard)/leave-management/leave-records/components/LeaveRecord";

// ==================== SUB-COMPONENTS ====================

// DURATION LABEL
function getDurationLabel(duration: LeaveDuration): string {
  switch (duration) {
    case LeaveDuration.SINGLE_DAY:
      return "Single Day";
    case LeaveDuration.MULTI_DAY:
      return "Multi Day";
    case LeaveDuration.HALF_DAY:
      return "Half Day";
    default:
      return duration;
  }
}

// LEAVE STATS COMPONENT
function LeaveOverview({ leaves }: { leaves: ILeave[] }) {
  // Calculate stats from leaves list
  const pending = leaves.filter((l) => l.status === "pending").length;
  const approved = leaves.filter((l) => l.status === "approved").length;
  const rejected = leaves.filter((l) => l.status === "rejected").length;
  const singleDay = leaves.filter(
    (l) => l.leaveDuration === LeaveDuration.SINGLE_DAY,
  ).length;
  const multiDay = leaves.filter(
    (l) => l.leaveDuration === LeaveDuration.MULTI_DAY,
  ).length;
  const total = leaves.length;

  const stats = [
    {
      title: "Pending",
      value: pending,
      Icon: PiClock,
      bgColor: "bg-[#fff7d6]",
      decorationColor: "bg-[#ffeea3]",
      iconColor: "text-[#b08800]",
      subText: `out of ${total}`,
      description: "Your leave requests awaiting approval.",
    },
    {
      title: "Approved",
      value: approved,
      Icon: PiCheckCircle,
      bgColor: "bg-[#e3f9eb]",
      decorationColor: "bg-[#bcf0cf]",
      iconColor: "text-[#1f8c54]",
      subText: `out of ${total}`,
      description: "Your approved leave requests.",
    },
    {
      title: "Rejected",
      value: rejected,
      Icon: PiXCircle,
      bgColor: "bg-[#ffe3e3]",
      decorationColor: "bg-[#ffc2c2]",
      iconColor: "text-[#c92a2a]",
      subText: `out of ${total}`,
      description: "Your rejected leave requests.",
    },
    {
      title: "Single Day",
      value: singleDay,
      Icon: PiCalendar,
      bgColor: "bg-[#e0f2ff]",
      decorationColor: "bg-[#bae0ff]",
      iconColor: "text-[#1a7bc7]",
      subText: `out of ${total}`,
      description: "Requests for a single day leave.",
    },
    {
      title: "Multi Day",
      value: multiDay,
      Icon: PiCalendarPlus,
      bgColor: "bg-[#edebff]",
      decorationColor: "bg-[#d0c9ff]",
      iconColor: "text-[#5b4eb1]",
      subText: `out of ${total}`,
      description: "Requests spanning multiple days.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <OverviewCard
            stat={stat}
            handler={undefined}
            isLoading={false}
            position={stats.length - 1 === index ? "right" : "left"}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function LeaveRequestPage() {
  useAuthGuard();
  const user = useAppStore((state) => state.user);

  // ==================== LOCAL STATE ====================
  // LEAVE RECORD MODAL STATE
  const [selectedLeave, setSelectedLeave] = useState<ILeave | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // POPUP STATE MANAGEMENT
  const { popupOption, setPopupOption } = usePopupOption();

  // ==================== GRAPHQL QUERIES ====================
  // FETCH LEAVES FOR LOGGED-IN USER
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
        userId: Number(user?.id),
      },
    },
    skip: !user?.id,
  });

  const leaves = leavesData?.leaves?.data || [];

  // ==================== HANDLERS ====================
  // VIEW RECORD HANDLER
  const handleViewRecord = (leave: ILeave) => {
    setSelectedLeave(leave);
    setIsRecordModalOpen(true);
  };

  // ==================== TABLE CONFIGURATION ====================
  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Leave details",
      accessorKey: "customLeaveRecord",
      show: true,
    },
    {
      key: "2",
      header: "Leave Type",
      accessorKey: "customLeaveType",
      show: true,
    },
    {
      key: "3",
      header: "Duration",
      accessorKey: "customDuration",
      show: true,
    },
    {
      key: "4",
      header: "Leave Period",
      accessorKey: "customLeavePeriod",
      show: true,
    },
    {
      key: "5",
      header: "Leave Hours",
      accessorKey: "customTotalHours",
      show: true,
    },
    {
      key: "6",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="My Leave Requests"
        subtitle="Submit and track your leave requests"
      />

      {/* LEAVE OVERVIEW */}
      <LeaveOverview leaves={leaves} />

      {/* LEAVE TABLE */}
      <CustomTable
        isLoading={loading}
        actions={[]} // No actions for employee view
        columns={columns}
        setColumns={setColumns}
        searchConfig={{
          searchable: loading ? false : true,
          debounceDelay: 500,
          defaultField: "customLeaveType",
          searchableFields: [
            { label: "Leave Type", value: "customLeaveType" },
            { label: "Status", value: "status" },
          ],
        }}
        dataSource={leaves.map((row) => ({
          ...row,
          customLeaveRecord: (
            <button
              onClick={() => handleViewRecord(row)}
              className="btn btn-sm btn-ghost gap-2 text-primary hover:bg-primary/10"
              title="View Leave Details"
            >
              <LiaUserClockSolid size={24} />
              <span className="hidden sm:inline">View Details</span>
            </button>
          ),
          customLeaveType: row.leaveType?.name || "N/A",
          customDuration: getDurationLabel(row.leaveDuration),
          customLeavePeriod: row.endDate
            ? `${customFormatDate(row.startDate)} - ${customFormatDate(
                row.endDate,
              )}`
            : customFormatDate(row.startDate),
          customTotalHours: `${row.totalMinutes}h`,
          customStatus: <AttendanceStatusBadge status={row.status} />,
        }))}
      >
        <button
          className="btn btn-primary gap-2"
          onClick={() =>
            setPopupOption({
              open: true,
              closeOnDocumentClick: true,
              actionType: "create",
              form: "leave",
              data: null,
              title: "Create Leave Request",
            })
          }
        >
          <PiPlusCircle size={18} />
          Add Leave
        </button>
      </CustomTable>

      {/* LEAVE FORM MODAL */}
      <CustomPopup
        customWidth="70%"
        popupOption={popupOption}
        setPopupOption={setPopupOption}
      >
        {popupOption.form === "leave" && (
          <LeaveRequestForm
            leave={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={() => {
              setPopupOption({
                ...popupOption,
                open: false,
              });
              refetch();
            }}
          />
        )}
      </CustomPopup>

      {/* LEAVE RECORD MODAL */}
      <LeaveRecord
        leave={selectedLeave}
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setSelectedLeave(null);
        }}
      />
    </div>
  );
}
