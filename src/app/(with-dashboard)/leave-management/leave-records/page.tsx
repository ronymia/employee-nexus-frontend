"use client";

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

export default function LeaveRecordsPage() {
  const { hasPermission } = usePermissionGuard();
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

  // Popup and modal state management
  const { popupOption, setPopupOption } = usePopupOption();
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  // Fetch employees for the form
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

  // Fetch leave records
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

  // Delete mutation
  const [deleteLeave, { loading: deleting }] = useMutation(DELETE_LEAVE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_LEAVES, variables: { query: {} } }],
  });

  // Approve leave mutation
  const [approveLeave] = useMutation(APPROVE_LEAVE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_LEAVES, variables: { query: {} } }],
  });

  // Reject leave mutation
  const [rejectLeave] = useMutation(REJECT_LEAVE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_LEAVES, variables: { query: {} } }],
  });

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

  const handleApprove = async (leave: ILeave) => {
    await approveLeave({ variables: { leaveId: Number(leave.id) } });
  };

  const handleReject = async (leave: ILeave) => {
    await rejectLeave({ variables: { leaveId: Number(leave.id) } });
  };

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
  };

  const getDurationLabel = (duration: LeaveDuration) => {
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Leave Records
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Manage employee leave requests and records
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Pending</p>
              <p className="text-2xl font-bold text-warning">
                {leaves.filter((l) => l.status === "pending").length}
              </p>
            </div>
            <PiWarning size={32} className="text-warning" />
          </div>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Approved</p>
              <p className="text-2xl font-bold text-success">
                {leaves.filter((l) => l.status === "approved").length}
              </p>
            </div>
            <PiCheckCircle size={32} className="text-success" />
          </div>
        </div>

        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Rejected</p>
              <p className="text-2xl font-bold text-error">
                {leaves.filter((l) => l.status === "rejected").length}
              </p>
            </div>
            <PiXCircle size={32} className="text-error" />
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Total Hours</p>
              <p className="text-2xl font-bold text-primary">
                {leaves.reduce((sum, l) => sum + l.totalHours, 0)}h
              </p>
            </div>
            <PiClock size={32} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Leave Table */}
      {loading ? (
        <CustomLoading />
      ) : (
        <CustomTable
          isLoading={loading}
          actions={[
            {
              name: "Approve",
              type: "button" as const,
              handler: handleApprove,
              Icon: PiCheck,
              permissions: [Permissions.LeaveUpdate],
              disabledOn: [
                { accessorKey: "status", value: "approved" },
                // { accessorKey: "status", value: "rejected" },
              ],
            },
            {
              name: "Reject",
              type: "button" as const,
              handler: handleReject,
              Icon: PiX,
              permissions: [Permissions.LeaveUpdate],
              disabledOn: [
                // { accessorKey: "status", value: "approved" },
                { accessorKey: "status", value: "rejected" },
              ],
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
              handler: (leave: ILeave) =>
                setDeleteModal({ open: true, id: leave.id }),
              Icon: PiTrash,
              permissions: [Permissions.LeaveDelete],
              disabledOn: [],
            },
          ]}
          columns={columns}
          setColumns={setColumns}
          dataSource={leaves.map((row) => ({
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
          }))}
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

      {/* Leave Form Modal */}
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

      {/* Delete Confirmation Modal */}
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
