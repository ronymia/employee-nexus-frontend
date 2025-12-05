"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import CustomTable from "@/components/table/CustomTable";
import { TableColumnType } from "@/types";
import { IAttendance } from "@/types/attendance.type";
import {
  PiCheckCircle,
  PiXCircle,
  PiWarning,
  PiMinus,
  PiAirplaneTilt,
  PiPlusCircle,
  PiTrash,
  PiPencilSimple,
} from "react-icons/pi";
import { GET_ATTENDANCES, DELETE_ATTENDANCE } from "@/graphql/attendance.api";
import moment from "moment";
import CustomPopup from "@/components/modal/CustomPopup";
import CustomLoading from "@/components/loader/CustomLoading";
import usePopupOption from "@/hooks/usePopupOption";
import useAuthGuard from "@/hooks/useAuthGuard";
import useAppStore from "@/hooks/useAppStore";
import AttendanceForm from "./components/AttendanceForm";

export default function AttendanceRequestPage() {
  useAuthGuard();
  const user = useAppStore((state) => state.user);

  // Popup state management
  const { popupOption, setPopupOption } = usePopupOption();

  // Fetch attendances for the logged-in user
  const {
    data: attendancesData,
    loading: attendancesLoading,
    refetch,
  } = useQuery<{
    attendances: {
      data: IAttendance[];
    };
  }>(GET_ATTENDANCES, {
    variables: {
      query: {
        userId: Number(user?.id),
      },
    },
    skip: !user?.id,
  });

  // Delete attendance mutation
  const [deleteAttendance] = useMutation(DELETE_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ATTENDANCES,
        variables: { query: { userId: Number(user?.id) } },
      },
    ],
    onCompleted: () => {
      setPopupOption({ ...popupOption, open: false });
    },
  });

  const attendances = attendancesData?.attendances?.data || [];
  const loading = attendancesLoading;

  const handleDelete = (attendance: IAttendance) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: "delete",
      form: "attendance",
      data: { id: attendance.id },
      title: "Delete Attendance Request",
      deleteHandler: async () => {
        try {
          await deleteAttendance({
            variables: { id: attendance.id },
          });
        } catch (error) {
          console.error("Error deleting attendance:", error);
        }
      },
    });
  };

  const handleEdit = (attendance: IAttendance) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: "update",
      form: "attendance",
      data: attendance,
      title: "Update Attendance Request",
    });
  };

  // Calculate stats
  const presentCount = attendances.filter(
    (a) => a.status.toLowerCase() === "present"
  ).length;
  const absentCount = attendances.filter(
    (a) => a.status.toLowerCase() === "absent"
  ).length;
  const pendingCount = attendances.filter(
    (a) => a.status.toLowerCase() === "pending"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
      case "approved":
        return (
          <span className="badge badge-success gap-1">
            <PiCheckCircle size={14} />
            Approved
          </span>
        );
      case "absent":
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
      case "on_leave":
        return (
          <span className="badge badge-ghost gap-1">
            <PiAirplaneTilt size={14} />
            On Leave
          </span>
        );
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Date",
      accessorKey: "customDate",
      show: true,
    },
    {
      key: "2",
      header: "Punch In",
      accessorKey: "customPunchIn",
      show: true,
    },
    {
      key: "3",
      header: "Punch Out",
      accessorKey: "customPunchOut",
      show: true,
    },
    {
      key: "4",
      header: "Total Hours",
      accessorKey: "customTotalHours",
      show: true,
    },
    {
      key: "5",
      header: "Break",
      accessorKey: "customBreakHours",
      show: true,
    },
    {
      key: "6",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
    },
    {
      key: "7",
      header: "Location",
      accessorKey: "customLocation",
      show: true,
    },
    {
      key: "8",
      header: "Project",
      accessorKey: "customProject",
      show: true,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            My Attendance Requests
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Submit and track your attendance requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Pending</p>
              <p className="text-2xl font-bold text-warning">{pendingCount}</p>
            </div>
            <PiWarning size={32} className="text-warning" />
          </div>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Approved</p>
              <p className="text-2xl font-bold text-success">{presentCount}</p>
            </div>
            <PiCheckCircle size={32} className="text-success" />
          </div>
        </div>

        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Rejected</p>
              <p className="text-2xl font-bold text-error">{absentCount}</p>
            </div>
            <PiXCircle size={32} className="text-error" />
          </div>
        </div>
      </div>

      {loading && <CustomLoading />}

      {/* Attendance Table */}
      <CustomTable
        isLoading={loading}
        actions={
          [
            //   {
            //     name: "Edit",
            //     type: "button" as const,
            //     Icon: PiPencilSimple,
            //     handler: (row: any) => handleEdit(row),
            //     permissions: [],
            //     disabledOn: [],
            //   },
            //   {
            //     name: "Delete",
            //     type: "button" as const,
            //     Icon: PiTrash,
            //     handler: (row: any) => handleDelete(row),
            //     permissions: [],
            //     disabledOn: [],
            //   },
          ]
        }
        columns={columns}
        setColumns={setColumns}
        dataSource={attendances.map((row) => ({
          ...row,
          customDate: moment(row.date).format("MMM DD, YYYY"),
          customPunchIn: row.punchRecords?.[0]?.punchIn
            ? moment(row.punchRecords[0].punchIn).format("hh:mm A")
            : "--:--",
          customPunchOut: row.punchRecords?.[row.punchRecords.length - 1]
            ?.punchOut
            ? moment(
                row.punchRecords[row.punchRecords.length - 1].punchOut
              ).format("hh:mm A")
            : "--:--",
          customTotalHours: row.totalHours
            ? `${row.totalHours.toFixed(2)}h`
            : "0h",
          customBreakHours: row.breakHours
            ? `${row.breakHours.toFixed(2)}h`
            : "0h",
          customStatus: getStatusBadge(row.status),
          customLocation: row.punchRecords?.[0]?.workSite?.name || "N/A",
          customProject: row.punchRecords?.[0]?.project?.name || "N/A",
        }))}
        searchConfig={{
          searchable: false,
          debounceDelay: 500,
          defaultField: "customDate",
          searchableFields: [
            { label: "Date", value: "customDate" },
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
              form: "attendance",
              data: null,
              title: "Submit Attendance Request",
            })
          }
        >
          <PiPlusCircle size={18} />
          Add Attendance
        </button>
      </CustomTable>

      {/* Attendance Form Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        {popupOption.form === "attendance" &&
          popupOption.actionType !== "delete" && (
            <AttendanceForm
              attendance={popupOption.data}
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
    </div>
  );
}
