"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import CustomTable from "@/components/table/CustomTable";
import { TableColumnType, IEmployee } from "@/types";
import {
  PiCalendarBlank,
  PiClock,
  PiCheckCircle,
  PiXCircle,
  PiWarning,
  PiPlusCircle,
  PiFileText,
  PiUser,
} from "react-icons/pi";
import { GET_EMPLOYEES } from "@/graphql/employee.api";
import moment from "moment";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import LeaveForm from "./components/LeaveForm";

enum LeaveDuration {
  SINGLE_DAY = "SINGLE_DAY",
  MULTI_DAY = "MULTI_DAY",
  HALF_DAY = "HALF_DAY",
}

interface ILeave {
  id: number;
  userId: number;
  user?: IEmployee;
  leaveTypeId: number;
  leaveType?: {
    id: number;
    name: string;
  };
  leaveYear: number;
  leaveDuration: LeaveDuration;
  startDate: string;
  endDate?: string;
  totalHours: number;
  status: string;
  reviewedAt?: string;
  reviewedBy?: number;
  reviewer?: IEmployee;
  rejectionReason?: string;
  attachments?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function LeaveRecordsPage() {
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

  // Popup state management
  const { popupOption, setPopupOption } = usePopupOption();

  // Fetch employees for the table
  const { data: employeesData, loading } = useQuery<{
    employees: {
      data: IEmployee[];
    };
  }>(GET_EMPLOYEES, {
    variables: {
      query: {},
    },
  });

  const employees = employeesData?.employees?.data || [];

  // TODO: Replace with actual leave data from GraphQL
  const dummyLeaves: ILeave[] = [
    {
      id: 1,
      userId: 1,
      user: employees[0],
      leaveTypeId: 1,
      leaveType: {
        id: 1,
        name: "Annual Leave",
      },
      leaveYear: 2025,
      leaveDuration: LeaveDuration.MULTI_DAY,
      startDate: moment().add(7, "days").format("YYYY-MM-DD"),
      endDate: moment().add(10, "days").format("YYYY-MM-DD"),
      totalHours: 32,
      status: "pending",
      notes: "Family vacation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: 1,
      user: employees[0],
      leaveTypeId: 2,
      leaveType: {
        id: 2,
        name: "Sick Leave",
      },
      leaveYear: 2025,
      leaveDuration: LeaveDuration.SINGLE_DAY,
      startDate: moment().subtract(2, "days").format("YYYY-MM-DD"),
      totalHours: 8,
      status: "approved",
      reviewedAt: moment().subtract(1, "days").toISOString(),
      reviewedBy: 2,
      notes: "Medical appointment",
      createdAt: moment().subtract(2, "days").toISOString(),
      updatedAt: moment().subtract(1, "days").toISOString(),
    },
    {
      id: 3,
      userId: 1,
      user: employees[0],
      leaveTypeId: 1,
      leaveType: {
        id: 1,
        name: "Annual Leave",
      },
      leaveYear: 2025,
      leaveDuration: LeaveDuration.HALF_DAY,
      startDate: moment().subtract(5, "days").format("YYYY-MM-DD"),
      totalHours: 4,
      status: "approved",
      reviewedAt: moment().subtract(4, "days").toISOString(),
      reviewedBy: 2,
      notes: "Personal work",
      createdAt: moment().subtract(5, "days").toISOString(),
      updatedAt: moment().subtract(4, "days").toISOString(),
    },
  ];

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
                {dummyLeaves.filter((l) => l.status === "pending").length}
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
                {dummyLeaves.filter((l) => l.status === "approved").length}
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
                {dummyLeaves.filter((l) => l.status === "rejected").length}
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
                {dummyLeaves.reduce((sum, l) => sum + l.totalHours, 0)}h
              </p>
            </div>
            <PiClock size={32} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Leave Table */}
      <CustomTable
        isLoading={loading}
        actions={[]}
        columns={columns}
        setColumns={setColumns}
        dataSource={dummyLeaves.map((row) => ({
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
          customStatus: row.status,
        }))}
        searchConfig={{
          searchable: true,
          debounceDelay: 500,
          defaultField: "customEmployeeName",
          searchableFields: [
            { label: "Employee Name", value: "customEmployeeName" },
            { label: "Leave Type", value: "customLeaveType" },
            { label: "Status", value: "customStatus" },
          ],
        }}
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

      {/* Leave Form Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
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
          />
        )}
      </CustomPopup>
    </div>
  );
}
