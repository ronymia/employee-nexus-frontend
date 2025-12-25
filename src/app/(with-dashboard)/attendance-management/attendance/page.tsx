"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import CustomTable from "@/components/table/CustomTable";
import { TableColumnType, IEmployee } from "@/types";
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
  PiCheck,
  PiX,
  PiClock,
  PiEye,
} from "react-icons/pi";
import { LiaUserClockSolid } from "react-icons/lia";
import { GET_EMPLOYEES } from "@/graphql/employee.api";
import {
  GET_ATTENDANCES,
  DELETE_ATTENDANCE,
  APPROVE_ATTENDANCE,
  REJECT_ATTENDANCE,
} from "@/graphql/attendance.api";
import dayjs from "dayjs";
import CustomPopup from "@/components/modal/CustomPopup";
import CustomLoading from "@/components/loader/CustomLoading";
import AttendanceForm from "./components/AttendanceForm";
import AttendanceRecord from "./components/AttendanceRecord";
import usePopupOption from "@/hooks/usePopupOption";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";

export default function AttendancePage() {
  const { hasPermission } = usePermissionGuard();
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  // Popup state management
  const { popupOption, setPopupOption } = usePopupOption();

  // Attendance record modal state
  const [selectedAttendance, setSelectedAttendance] =
    useState<IAttendance | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Fetch employees for the table
  const { data: employeesData, loading: employeesLoading } = useQuery<{
    employees: {
      data: IEmployee[];
    };
  }>(GET_EMPLOYEES, {
    variables: {
      query: {},
    },
  });

  // Fetch attendances
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
      query: {},
    },
  });

  // Delete attendance mutation
  const [deleteAttendance] = useMutation(DELETE_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ATTENDANCES, variables: { query: {} } }],
    onCompleted: () => {
      setPopupOption({ ...popupOption, open: false });
    },
  });

  // Approve attendance mutation
  const [approveAttendance] = useMutation(APPROVE_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ATTENDANCES, variables: { query: {} } }],
  });

  // Reject attendance mutation
  const [rejectAttendance] = useMutation(REJECT_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ATTENDANCES, variables: { query: {} } }],
  });

  const employees = employeesData?.employees?.data || [];
  const attendances = attendancesData?.attendances?.data || [];
  const loading = employeesLoading || attendancesLoading;

  const handleDelete = (attendance: IAttendance) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: "delete",
      form: "attendance",
      data: { id: attendance.id },
      title: "Delete Attendance Record",
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
      title: "Update Attendance Record",
    });
  };

  const handleApprove = async (attendance: IAttendance) => {
    try {
      await approveAttendance({
        variables: { attendanceId: Number(attendance.id) },
      });
    } catch (error) {
      console.error("Error approving attendance:", error);
    }
  };

  const handleReject = async (attendance: IAttendance) => {
    try {
      await rejectAttendance({
        variables: { attendanceId: Number(attendance.id) },
      });
    } catch (error) {
      console.error("Error rejecting attendance:", error);
    }
  };

  // HANDLE VIEW ATTENDANCE RECORD
  const handleViewRecord = (attendance: IAttendance) => {
    setSelectedAttendance(attendance);
    setIsRecordModalOpen(true);
  };

  // Old dummy data for reference
  const dummyAttendances: IAttendance[] = [
    {
      id: 1,
      userId: 1,
      date: dayjs().format("YYYY-MM-DD"),
      totalHours: 8.5,
      breakHours: 1,
      status: "present",
      punchRecords: [
        {
          id: 1,
          attendanceId: 1,
          punchIn: dayjs().set("hour", 9).set("minute", 0).toISOString(),
          punchOut: dayjs().set("hour", 18).set("minute", 30).toISOString(),
          breakStart: dayjs().set("hour", 13).set("minute", 0).toISOString(),
          breakEnd: dayjs().set("hour", 14).set("minute", 0).toISOString(),
          workHours: 8.5,
          breakHours: 1,
          punchInIp: "192.168.1.100",
          punchOutIp: "192.168.1.100",
          punchInLat: 23.8103,
          punchInLng: 90.4125,
          punchOutLat: 23.8103,
          punchOutLng: 90.4125,
          punchInDevice: "Windows 10 - Chrome",
          punchOutDevice: "Windows 10 - Chrome",
          workSite: "Windows 10 - Chrome",
          project: "Windows 10 - Chrome",
          notes: "Regular working day",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Calculate stats
  const presentCount = attendances.filter(
    (a) => a.status.toLowerCase() === "present"
  ).length;
  const absentCount = attendances.filter(
    (a) => a.status.toLowerCase() === "absent"
  ).length;
  const lateCount = attendances.filter(
    (a) => a.status.toLowerCase() === "late"
  ).length;

  // const getStatusBadge = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "present":
  //       return (
  //         <span className="badge badge-success gap-1">
  //           <PiCheckCircle size={14} />
  //           Present
  //         </span>
  //       );
  //     case "absent":
  //       return (
  //         <span className="badge badge-error gap-1">
  //           <PiXCircle size={14} />
  //           Absent
  //         </span>
  //       );
  //     case "late":
  //       return (
  //         <span className="badge badge-warning gap-1">
  //           <PiWarning size={14} />
  //           Late
  //         </span>
  //       );
  //     case "half_day":
  //       return (
  //         <span className="badge badge-info gap-1">
  //           <PiMinus size={14} />
  //           Half Day
  //         </span>
  //       );
  //     case "on_leave":
  //       return (
  //         <span className="badge badge-ghost gap-1">
  //           <PiAirplaneTilt size={14} />
  //           On Leave
  //         </span>
  //       );
  //     default:
  //       return <span className="badge badge-ghost">{status}</span>;
  //   }
  // };
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
  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Employee",
      accessorKey: "customEmployeeName",
      show: true,
    },
    {
      key: "2",
      header: "Date",
      accessorKey: "customDate",
      show: true,
    },
    {
      key: "2",
      header: "Punch Record",
      accessorKey: "customAttendanceRecord",
      show: true,
    },
    {
      key: "3",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
    },
  ]);

  const actions = [
    {
      name: "Approve",
      type: "button" as const,
      Icon: PiCheck,
      handler: (row: any) => handleApprove(row),
      permissions: [Permissions.AttendanceUpdate],
      disabledOn: [
        {
          accessorKey: "status",
          value: "approved",
        },
      ],
    },
    {
      name: "Reject",
      type: "button" as const,
      Icon: PiX,
      handler: (row: any) => handleReject(row),
      permissions: [Permissions.AttendanceUpdate],
      disabledOn: [
        {
          accessorKey: "status",
          value: "rejected",
        },
      ],
    },
    {
      name: "Edit",
      type: "button" as const,
      Icon: PiPencilSimple,
      handler: (row: any) => handleEdit(row),
      permissions: [Permissions.AttendanceUpdate],
      disabledOn: [],
    },
    {
      name: "Delete",
      type: "button" as const,
      Icon: PiTrash,
      handler: (row: any) => handleDelete(row),
      permissions: [Permissions.AttendanceDelete],
      disabledOn: [],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Attendance Management
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Track and manage employee attendance records
          </p>
        </div>

        {/*  */}
        <div className=""></div>
      </div>

      {/* Date Picker & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/60">Present</p>
                <p className="text-2xl font-bold text-success">
                  {presentCount}
                </p>
              </div>
              <PiCheckCircle size={32} className="text-success" />
            </div>
          </div>

          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/60">Absent</p>
                <p className="text-2xl font-bold text-error">{absentCount}</p>
              </div>
              <PiXCircle size={32} className="text-error" />
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/60">Late</p>
                <p className="text-2xl font-bold text-warning">{lateCount}</p>
              </div>
              <PiWarning size={32} className="text-warning" />
            </div>
          </div>
        </div>
      </div>

      {loading && <CustomLoading />}

      {/* Attendance Table */}
      <CustomTable
        isLoading={loading}
        actions={actions}
        columns={columns}
        setColumns={setColumns}
        dataSource={attendances.map((row) => ({
          ...row,
          customAttendanceRecord: (
            <button
              onClick={() => handleViewRecord(row)}
              className="btn btn-sm btn-ghost gap-2 text-primary hover:bg-primary/10"
              title="View Attendance Details"
            >
              <LiaUserClockSolid size={24} />
              <span className="hidden sm:inline">Punch Record</span>
            </button>
          ),
          customEmployeeName: row.user?.profile?.fullName || "N/A",
          customDate: dayjs(row.date).format("MMM DD, YYYY"),
          customStatus: getStatusBadge(row.status),
        }))}
        searchConfig={{
          searchable: false,
          debounceDelay: 500,
          defaultField: "customEmployeeName",
          searchableFields: [
            { label: "Employee Name", value: "customEmployeeName" },
            { label: "Status", value: "customStatus" },
          ],
        }}
      >
        {hasPermission(Permissions.AttendanceCreate) ? (
          <button
            className="btn btn-primary gap-2"
            onClick={() =>
              setPopupOption({
                open: true,
                closeOnDocumentClick: true,
                actionType: "create",
                form: "attendance",
                data: null,
                title: "Add Attendance Record",
              })
            }
          >
            <PiPlusCircle size={18} />
            Add Attendance
          </button>
        ) : null}
      </CustomTable>

      {/* Attendance Form Modal */}
      <CustomPopup
        customWidth="90%"
        popupOption={popupOption}
        setPopupOption={setPopupOption}
      >
        {popupOption.form === "attendance" &&
          popupOption.actionType !== "delete" && (
            <AttendanceForm
              employees={employees}
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

      {/* Attendance Record Modal */}
      <AttendanceRecord
        attendance={selectedAttendance}
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setSelectedAttendance(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      {/* <FormModal popupOption={popupOption} setPopupOption={setPopupOption} /> */}
    </div>
  );
}
