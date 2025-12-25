"use client";

// ==================== EXTERNAL IMPORTS ====================
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import CustomTable from "@/components/table/CustomTable";
import CustomLoading from "@/components/loader/CustomLoading";
import FormModal from "@/components/form/FormModal";
import { TableColumnType, IEmployee, ILeave, LeaveDuration } from "@/types";
import {
  PiClock,
  PiCheckCircle,
  PiXCircle,
  PiWarning,
  PiPlusCircle,
  PiPencil,
  PiTrash,
  PiCheck,
  PiX,
} from "react-icons/pi";
import { GET_EMPLOYEES } from "@/graphql/employee.api";
import {
  GET_LEAVES,
  DELETE_LEAVE,
  APPROVE_LEAVE,
  REJECT_LEAVE,
} from "@/graphql/leave.api";
import moment from "moment";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import LeaveForm from "./LeaveForm";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import PageHeader from "@/components/ui/PageHeader";

// ==================== SUB-COMPONENTS ====================

// STATS CARD
interface IStatsCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: "warning" | "success" | "error" | "primary";
}

function StatsCard({ label, value, icon: Icon, color }: IStatsCardProps) {
  const colorClasses = {
    warning: "bg-warning/10 border-warning/20 text-warning",
    success: "bg-success/10 border-success/20 text-success",
    error: "bg-error/10 border-error/20 text-error",
    primary: "bg-primary/10 border-primary/20 text-primary",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-base-content/60">{label}</p>
          <p
            className={`text-2xl font-bold ${
              colorClasses[color].split(" ")[2]
            }`}
          >
            {value}
          </p>
        </div>
        <Icon size={32} className={colorClasses[color].split(" ")[2]} />
      </div>
    </div>
  );
}

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

// ==================== MAIN COMPONENT ====================
export default function LeaveRecordsPage() {
  // ==================== PERMISSIONS ====================
  const { hasPermission } = usePermissionGuard();

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
      header: "Total Hours",
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

  // POPUP STATE MANAGEMENT
  const { popupOption, setPopupOption } = usePopupOption();
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  // ==================== GRAPHQL QUERIES ====================
  // FETCH EMPLOYEES
  const { data: employeesData } = useQuery<{
    employees: {
      data: IEmployee[];
    };
  }>(GET_EMPLOYEES, {
    variables: {
      query: {},
    },
  });

  const employees = employeesData?.employees?.data || [];

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
  const [deleteLeave, { loading: deleting }] = useMutation(DELETE_LEAVE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_LEAVES, variables: { query: {} } }],
  });

  // APPROVE LEAVE
  const [approveLeave] = useMutation(APPROVE_LEAVE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_LEAVES, variables: { query: {} } }],
  });

  // REJECT LEAVE
  const [rejectLeave] = useMutation(REJECT_LEAVE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_LEAVES, variables: { query: {} } }],
  });

  // ==================== CALCULATE STATS ====================
  const stats = {
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
    totalHours: leaves.reduce((sum, l) => sum + l.totalHours, 0),
  };

  // ==================== HANDLERS ====================
  // DELETE HANDLER
  const handleDelete = async () => {
    if (deleteModal.id) {
      try {
        await deleteLeave({
          variables: { id: Number(deleteModal.id) },
        });
        setDeleteModal({ open: false, id: null });
      } catch (error) {
        console.error("Error deleting leave:", error);
      }
    }
  };

  // APPROVE HANDLER
  const handleApprove = async (leave: ILeave) => {
    await approveLeave({ variables: { leaveId: Number(leave.id) } });
  };

  // REJECT HANDLER
  const handleReject = async (leave: ILeave) => {
    await rejectLeave({ variables: { leaveId: Number(leave.id) } });
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
      handler: (leave: ILeave) => setDeleteModal({ open: true, id: leave.id }),
      Icon: PiTrash,
      permissions: [Permissions.LeaveDelete],
      disabledOn: [],
    },
  ];

  // DATA SOURCE WITH CUSTOM FIELDS
  const dataSource = leaves.map((row) => ({
    ...row,
    customEmployeeName: row.user?.profile?.fullName || "N/A",
    customLeaveType: row.leaveType?.name || "N/A",
    customDuration: getDurationLabel(row.leaveDuration),
    customLeavePeriod: row.endDate
      ? `${moment(row.startDate).format("MMM DD, YYYY")} - ${moment(
          row.endDate
        ).format("MMM DD, YYYY")}`
      : moment(row.startDate).format("MMM DD, YYYY"),
    customTotalHours: `${row.totalHours}h`,
    customStatus: getStatusBadge(row.status),
  }));

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="Leave Records"
        subtitle="Manage employee leave requests and records"
      />

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          label="Pending"
          value={stats.pending}
          icon={PiWarning}
          color="warning"
        />
        <StatsCard
          label="Approved"
          value={stats.approved}
          icon={PiCheckCircle}
          color="success"
        />
        <StatsCard
          label="Rejected"
          value={stats.rejected}
          icon={PiXCircle}
          color="error"
        />
        <StatsCard
          label="Total Hours"
          value={`${stats.totalHours}h`}
          icon={PiClock}
          color="primary"
        />
      </div>

      {/* LEAVE TABLE */}
      {loading ? (
        <CustomLoading />
      ) : (
        <CustomTable
          isLoading={loading}
          actions={actions}
          columns={columns}
          setColumns={setColumns}
          dataSource={dataSource}
          searchConfig={{
            searchable: false,
            debounceDelay: 500,
            defaultField: "customEmployeeName",
            searchableFields: [
              { label: "Employee Name", value: "customEmployeeName" },
              { label: "Leave Type", value: "customLeaveType" },
              { label: "Status", value: "status" },
            ],
          }}
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
      )}

      {/* LEAVE FORM MODAL */}
      <CustomPopup
        customWidth="70%"
        popupOption={popupOption}
        setPopupOption={setPopupOption}
      >
        {popupOption.form === "leave" && (
          <LeaveForm
            employees={employees}
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

      {/* DELETE CONFIRMATION MODAL */}
      <FormModal
        popupOption={{
          open: deleteModal.open,
          closeOnDocumentClick: false,
          actionType: "delete",
          form: "leave",
          data: null,
          title: "Delete Leave",
          deleteHandler: handleDelete,
        }}
        setPopupOption={(value) => {
          if (typeof value === "function") {
            setDeleteModal((prev) => {
              const newPopup = value({
                open: prev.open,
                closeOnDocumentClick: false,
                actionType: "delete",
                form: "leave",
                data: null,
                title: "Delete Leave",
              });
              return { open: newPopup.open, id: prev.id };
            });
          } else {
            setDeleteModal({ open: value.open, id: deleteModal.id });
          }
        }}
      />
    </div>
  );
}
