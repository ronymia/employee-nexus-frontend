"use client";

// ==================== EXTERNAL IMPORTS ====================
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { TableColumnType, ILeave, LeaveDuration } from "@/types";
import useConfirmation from "@/hooks/useConfirmation";
import {
  PiCheck,
  PiX,
  PiCalendar,
  PiCalendarPlus,
  PiClock,
  PiCheckCircle,
  PiXCircle,
  PiWarning,
  PiPlusCircle,
  PiPencil,
  PiTrash,
} from "react-icons/pi";
import { LiaUserClockSolid } from "react-icons/lia";
import {
  GET_LEAVES,
  DELETE_LEAVE,
  APPROVE_LEAVE,
  REJECT_LEAVE,
  LEAVE_OVERVIEW,
} from "@/graphql/leave.api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import LeaveForm from "./LeaveForm";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import PageHeader from "@/components/ui/PageHeader";
import CustomTable from "@/components/table/CustomTable";
import OverviewCard from "@/components/card/OverviewCard";
import { motion } from "motion/react";

import { ILeaveOverviewResponse } from "@/types/leave.type";
import LeaveRecord from "./components/LeaveRecord";

dayjs.extend(customParseFormat);

// ==================== SUB-COMPONENTS ====================

// STATUS BADGE
function getStatusBadge(status: string) {
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
    case "cancelled":
      return (
        <span className="badge badge-ghost gap-1">
          <PiXCircle size={14} />
          Cancelled
        </span>
      );
    default:
      return <span className="badge badge-ghost">{status}</span>;
  }
}

// DURATION LABEL
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

function LeaveOverview() {
  const { data, loading, error } =
    useQuery<ILeaveOverviewResponse>(LEAVE_OVERVIEW);

  const summary = data?.leaveOverview?.data;

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="alert alert-error mb-6"
      >
        <PiXCircle size={24} />
        <span>Failed to load leave summary</span>
      </motion.div>
    );
  }

  const stats = [
    {
      title: "Pending",
      value: summary?.pending || 0,
      Icon: PiClock,
      bgColor: "bg-[#fff7d6]",
      decorationColor: "bg-[#ffeea3]",
      iconColor: "text-[#b08800]",
      subText: `out of ${summary?.total}`,
      description: "Leave requests awaiting approval.",
    },
    {
      title: "Approved",
      value: summary?.approved || 0,
      Icon: PiCheckCircle,
      bgColor: "bg-[#e3f9eb]",
      decorationColor: "bg-[#bcf0cf]",
      iconColor: "text-[#1f8c54]",
      subText: `out of ${summary?.total}`,
      description: "Leave requests that have been approved.",
    },
    {
      title: "Rejected",
      value: summary?.rejected || 0,
      Icon: PiXCircle,
      bgColor: "bg-[#ffe3e3]",
      decorationColor: "bg-[#ffc2c2]",
      iconColor: "text-[#c92a2a]",
      subText: `out of ${summary?.total}`,
      description: "Leave requests that have been rejected.",
    },
    {
      title: "Single Day",
      value: summary?.singleDay || 0,
      Icon: PiCalendar,
      bgColor: "bg-[#e0f2ff]",
      decorationColor: "bg-[#bae0ff]",
      iconColor: "text-[#1a7bc7]",
      subText: `out of ${summary?.total}`,
      description: "Leave requests for a single day.",
    },
    {
      title: "Multi Day",
      value: summary?.multiDay || 0,
      Icon: PiCalendarPlus,
      bgColor: "bg-[#edebff]",
      decorationColor: "bg-[#d0c9ff]",
      iconColor: "text-[#5b4eb1]",
      subText: `out of ${summary?.total}`,
      description: "Leave requests spanning multiple days.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
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
            isLoading={loading}
            position={stats.length - 1 === index ? "right" : "left"}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function LeaveRecordsPage() {
  // ==================== PERMISSIONS ====================
  const { hasPermission } = usePermissionGuard();

  // ====================HOOKS ====================
  const { confirm } = useConfirmation();

  // ==================== LOCAL STATE ====================
  // LEAVE RECORD MODAL STATE
  const [selectedLeave, setSelectedLeave] = useState<ILeave | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // POPUP STATE MANAGEMENT
  const { popupOption, setPopupOption } = usePopupOption();

  // ==================== GRAPHQL QUERIES ====================

  // FETCH LEAVE RECORDS
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
      query: {},
    },
  });

  const leaves = leavesData?.leaves?.data || [];

  // ==================== GRAPHQL MUTATIONS ====================
  // DELETE LEAVE
  const [deleteLeave] = useMutation(DELETE_LEAVE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_LEAVES, variables: { query: {} } },
      { query: LEAVE_OVERVIEW },
    ],
  });

  // APPROVE LEAVE
  const [approveLeave] = useMutation(APPROVE_LEAVE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_LEAVES, variables: { query: {} } },
      { query: LEAVE_OVERVIEW },
    ],
  });

  // REJECT LEAVE
  const [rejectLeave] = useMutation(REJECT_LEAVE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_LEAVES, variables: { query: {} } },
      { query: LEAVE_OVERVIEW },
    ],
  });

  // ==================== HANDLERS ====================
  // DELETE HANDLER
  // DELETE HANDLER
  const handleDelete = async (leave: ILeave) => {
    const itemName = leave.user?.profile?.fullName || "this employee";
    const itemDescription = `Leave Period: ${
      leave.endDate
        ? `${dayjs(leave.startDate).format("MMM DD, YYYY")} - ${dayjs(
            leave.endDate,
          ).format("MMM DD, YYYY")}`
        : dayjs(leave.startDate).format("MMM DD, YYYY")
    }`;

    await confirm({
      title: "Delete Leave Request",
      message: `Do you want to delete leave request for <strong>${itemName}</strong>?<br/><small style="color: rgba(0,0,0,0.6);">${itemDescription}</small>`,
      confirmButtonText: "Delete Record",
      confirmButtonColor: "#ef4444",
      icon: "warning",
      successTitle: "Deleted!",
      successMessage: "Leave request has been deleted successfully",
      onConfirm: async () => {
        await deleteLeave({
          variables: { id: Number(leave.id) },
        });
      },
    });
  };

  // APPROVE HANDLER
  // APPROVE HANDLER
  const handleApprove = async (leave: ILeave) => {
    const itemName = leave.user?.profile?.fullName || "this employee";
    const itemDescription = `Leave Period: ${
      leave.endDate
        ? `${dayjs(leave.startDate).format("MMM DD, YYYY")} - ${dayjs(
            leave.endDate,
          ).format("MMM DD, YYYY")}`
        : dayjs(leave.startDate).format("MMM DD, YYYY")
    }`;

    await confirm({
      title: "Approve Leave Request?",
      message: undefined,
      itemName,
      itemDescription,
      icon: "question",
      confirmButtonText: "Yes, Approve",
      confirmButtonColor: "#10b981", // success color
      input: "textarea",
      inputPlaceholder: "Enter approval remarks...",
      inputRequired: leave.status === "rejected" ? true : false,
      onConfirm: async (remarks) => {
        const res = await approveLeave({
          variables: {
            approveLeaveInput: {
              leaveId: Number(leave.id),
              remarks,
            },
          },
        });
        if (res?.data) {
          // Success handled by hook
        }
      },
      successTitle: "Approved!",
      successMessage: "Leave request has been approved",
    });
  };

  // REJECT HANDLER
  const handleReject = async (leave: ILeave) => {
    const itemName = leave.user?.profile?.fullName || "this employee";
    const itemDescription = `Leave Period: ${
      leave.endDate
        ? `${dayjs(leave.startDate).format("MMM DD, YYYY")} - ${dayjs(
            leave.endDate,
          ).format("MMM DD, YYYY")}`
        : dayjs(leave.startDate).format("MMM DD, YYYY")
    }`;

    await confirm({
      title: "Reject Leave Request?",
      message: undefined,
      itemName,
      itemDescription,
      icon: "warning",
      confirmButtonText: "Yes, Reject",
      confirmButtonColor: "#ef4444", // error color
      input: "textarea",
      inputPlaceholder: "Enter reason for rejection...",
      inputRequired: true,
      onConfirm: async (remarks) => {
        const res = await rejectLeave({
          variables: {
            rejectLeaveInput: {
              leaveId: Number(leave.id),
              remarks,
            },
          },
        });
        if (res?.data) {
          // Success handled by hook
        }
      },
      successTitle: "Rejected!",
      successMessage: "Leave request has been rejected",
    });
  };

  // VIEW RECORD HANDLER
  const handleViewRecord = (leave: ILeave) => {
    setSelectedLeave(leave);
    setIsRecordModalOpen(true);
  };

  // UPDATE HANDLER
  const handleEdit = (leave: ILeave) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "leave",
      data: leave,
      title: "Update Leave Request",
    });
  };

  // ==================== TABLE CONFIGURATION ====================
  // TABLE ACTIONS
  const actions = [
    {
      name: "Approve",
      type: "button" as const,
      handler: handleApprove,
      Icon: PiCheck,
      permissions: [Permissions.LeaveUpdate],
      disabledOn: [{ accessorKey: "status", value: "approved" }],
    },
    {
      name: "Reject",
      type: "button" as const,
      handler: handleReject,
      Icon: PiX,
      permissions: [Permissions.LeaveUpdate],
      disabledOn: [{ accessorKey: "status", value: "rejected" }],
    },
    {
      name: "Edit",
      type: "button" as const,
      handler: handleEdit,
      Icon: PiPencil,
      permissions: [Permissions.LeaveUpdate],
      disabledOn: [],
    },
    {
      name: "Delete",
      type: "button" as const,
      handler: handleDelete,
      Icon: PiTrash,
      permissions: [Permissions.LeaveDelete],
      disabledOn: [],
    },
  ];

  // ==================== LOCAL STATE ====================
  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Employee",
      accessorKey: "customEmployeeName",
      show: true,
    },
    {
      key: "2",
      header: "Leave Details",
      accessorKey: "customLeaveRecord",
      show: true,
    },
    {
      key: "3",
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
  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="Leave Records"
        subtitle="Manage employee leave requests and records"
      />

      {/* LEAVE OVERVIEW */}
      <LeaveOverview />

      {/* LEAVE TABLE */}
      <CustomTable
        isLoading={loading}
        actions={actions}
        columns={columns}
        setColumns={setColumns}
        searchConfig={{
          searchable: loading ? false : true,
          debounceDelay: 500,
          defaultField: "customEmployeeName",
          searchableFields: [
            { label: "Employee Name", value: "customEmployeeName" },
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
          customEmployeeName: row.user?.profile?.fullName || "N/A",
          customLeaveType: row.leaveType?.name || "N/A",
          customDuration: getDurationLabel(row.leaveDuration),
          customLeavePeriod: row.endDate
            ? `${dayjs(row.startDate).format("MMM DD, YYYY")} - ${dayjs(
                row.endDate,
              ).format("MMM DD, YYYY")}`
            : dayjs(row.startDate).format("MMM DD, YYYY"),
          customTotalHours: `${row.totalMinutes}h`,
          customStatus: getStatusBadge(row.status),
        }))}
      >
        {hasPermission(Permissions.LeaveCreate) ? (
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
        ) : null}
      </CustomTable>

      {/* LEAVE FORM MODAL */}
      <CustomPopup
        customWidth="70%"
        popupOption={popupOption}
        setPopupOption={setPopupOption}
      >
        {popupOption.form === "leave" && (
          <LeaveForm
            leave={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={() =>
              setPopupOption({
                ...popupOption,
                open: false,
              })
            }
            refetch={refetch}
          />
        )}
      </CustomPopup>

      {/* Leave Record Modal */}
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
