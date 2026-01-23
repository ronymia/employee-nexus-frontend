"use client";

// ==================== EXTERNAL IMPORTS ====================
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import CustomTable from "@/components/table/CustomTable";
import { TableColumnType } from "@/types";
import {
  IAttendance,
  IAttendanceOverview,
  IAttendanceOverviewResponse,
} from "@/types/attendance.type";
import {
  PiCheckCircle,
  PiXCircle,
  PiWarning,
  PiMinus,
  PiPlusCircle,
  PiTrash,
  PiPencilSimple,
  PiCheck,
  PiX,
  PiClock,
} from "react-icons/pi";
import { LiaUserClockSolid } from "react-icons/lia";
import {
  GET_ATTENDANCES,
  DELETE_ATTENDANCE,
  APPROVE_ATTENDANCE,
  REJECT_ATTENDANCE,
  ATTENDANCE_OVERVIEW,
} from "@/graphql/attendance.api";
import dayjs from "dayjs";
import CustomPopup from "@/components/modal/CustomPopup";
import AttendanceForm from "./AttendanceForm";
import AttendanceRecord from "./components/AttendanceRecord";
import usePopupOption from "@/hooks/usePopupOption";
import useConfirmation from "@/hooks/useConfirmation";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { PiClockAfternoon } from "react-icons/pi";
import { motion } from "motion/react";
import PageHeader from "@/components/ui/PageHeader";

import { minutesToHoursAndMinutes } from "@/utils/time.utils";
import AttendanceStatusBadge from "@/components/ui/AttendanceStatusBadge";

// ==================== SUB-COMPONENTS ====================

// ATTENDANCE STATS COMPONENT
import OverviewCard from "@/components/card/OverviewCard";

function AttendanceOverview() {
  const { data, loading, error } =
    useQuery<IAttendanceOverviewResponse>(ATTENDANCE_OVERVIEW);

  const summary = data?.attendanceOverview?.data;

  // if (loading) {
  //   return (
  //     <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
  //       {[...Array(5)].map((_, i) => (
  //         <div
  //           key={i}
  //           className="border border-base-300 rounded-[32px] h-44 p-6 bg-base-200/50 animate-pulse"
  //         />
  //       ))}
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="alert alert-error mb-6"
      >
        <PiXCircle size={24} />
        <span>Failed to load attendance summary</span>
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
      description:
        "Attendance entries submitted by employees but not yet reviewed or approved by a manager.",
    },
    {
      title: "Approved",
      value: summary?.approved || 0,
      Icon: PiCheckCircle,
      bgColor: "bg-[#e3f9eb]",
      decorationColor: "bg-[#bcf0cf]",
      iconColor: "text-[#1f8c54]",
      subText: `out of ${summary?.total}`,
      description:
        "Attendance records that have been verified and approved, and are considered valid for payroll.",
    },
    {
      title: "Absent",
      value: summary?.absent || 0,
      Icon: PiXCircle,
      bgColor: "bg-[#ffe3e3]",
      decorationColor: "bg-[#ffc2c2]",
      iconColor: "text-[#c92a2a]",
      subText: `out of ${summary?.total}`,
      description:
        "Days where employees did not check in and no valid attendance was recorded.",
    },
    {
      title: "Rejected",
      value: summary?.rejected || 0,
      Icon: PiXCircle,
      bgColor: "bg-[#ffe3e3]",
      decorationColor: "bg-[#ffc2c2]",
      iconColor: "text-[#c92a2a]",
      subText: `out of ${summary?.total}`,
      description: "Attendance records that have been rejected by a manager.",
    },
    {
      title: "Late",
      value: summary?.late || 0,
      Icon: PiWarning,
      bgColor: "bg-[#e0f2ff]",
      decorationColor: "bg-[#bae0ff]",
      iconColor: "text-[#1a7bc7]",
      subText: `out of ${summary?.total}`,
      description:
        "Attendance records where the employee checked in after the allowed time threshold.",
    },
    {
      title: "Half Day",
      value: summary?.partial || 0,
      Icon: PiClockAfternoon,
      bgColor: "bg-[#edebff]",
      decorationColor: "bg-[#d0c9ff]",
      iconColor: "text-[#5b4eb1]",
      subText: `out of ${summary?.total}`,
      description:
        "Attendance marked as partial working hours, below the required full-day duration.",
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

export default function AttendancePage() {
  // ==================== PERMISSIONS ====================
  // ==================== PERMISSIONS ====================
  const { hasPermission } = usePermissionGuard();
  const { confirm } = useConfirmation();

  // ==================== LOCAL STATE ====================
  // POPUP STATE MANAGEMENT
  const { popupOption, setPopupOption } = usePopupOption();

  // ATTENDANCE RECORD MODAL STATE
  const [selectedAttendance, setSelectedAttendance] =
    useState<IAttendance | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // ==================== GRAPHQL QUERIES ====================
  // FETCH ATTENDANCES
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

  // ==================== GRAPHQL MUTATIONS ====================
  // DELETE ATTENDANCE
  const [deleteAttendance] = useMutation(DELETE_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_ATTENDANCES, variables: { query: {} } },
      { query: ATTENDANCE_OVERVIEW },
    ],
    onCompleted: () => {
      setPopupOption({ ...popupOption, open: false });
    },
  });

  // APPROVE ATTENDANCE
  const [approveAttendance] = useMutation(APPROVE_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_ATTENDANCES, variables: { query: {} } },
      { query: ATTENDANCE_OVERVIEW },
    ],
  });

  // REJECT ATTENDANCE
  const [rejectAttendance] = useMutation(REJECT_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_ATTENDANCES, variables: { query: {} } },
      { query: ATTENDANCE_OVERVIEW },
    ],
  });

  // ==================== DATA PREPARATION ====================
  const attendances = attendancesData?.attendances?.data || [];
  const loading = attendancesLoading;

  // ==================== HANDLERS ====================
  // DELETE HANDLER
  const handleDelete = async (attendance: IAttendance) => {
    // Format details for confirmation
    const name = attendance.user?.profile?.fullName || "Employee";
    const date = dayjs(attendance.date).format("MMM DD, YYYY");
    const totalTime = attendance.overtimeMinutes
      ? `${minutesToHoursAndMinutes(attendance.totalMinutes)} (${minutesToHoursAndMinutes(attendance.overtimeMinutes)})`
      : minutesToHoursAndMinutes(attendance.totalMinutes);

    await confirm({
      title: "Delete Attendance",
      message: `Do you want to delete <strong>${name} - ${date}</strong>?${
        `Total Worked: ${totalTime}. This action cannot be undone.`
          ? `<br/><small style="color: rgba(0,0,0,0.6);">${`Total Worked: ${totalTime}. This action cannot be undone.`}</small>`
          : ""
      }`,
      confirmButtonText: "Delete Record",
      confirmButtonColor: "#ef4444",
      icon: "warning",
      successTitle: "Deleted!",
      successMessage: "Attendance deleted successfully",
      onConfirm: async () => {
        await deleteAttendance({
          variables: { id: Number(attendance.id) },
        });
      },
    });
  };

  // UPDATE HANDLER
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

  // APPROVE HANDLER
  const handleApprove = async (attendance: IAttendance) => {
    // Format details for confirmation
    const name = attendance.user?.profile?.fullName || "Employee";
    const date = dayjs(attendance.date).format("MMM DD, YYYY");
    const totalTime = minutesToHoursAndMinutes(attendance.totalMinutes);
    const scheduleTime = minutesToHoursAndMinutes(attendance.scheduleMinutes);

    await confirm({
      title: "Approve Attendance?",
      // We leave message undefined to prioritize itemName/itemDescription layout
      message: undefined,
      itemName: `${name} - ${date}`,
      itemDescription: `Total: ${totalTime} | Scheduled: ${scheduleTime}`,
      icon: "question",
      confirmButtonText: "Yes, Approve",
      confirmButtonColor: "#10b981", // success color
      input: "textarea",
      inputPlaceholder: "Enter approval remarks...",
      inputRequired: attendance.status === "rejected" ? true : false,
      onConfirm: async (remarks) => {
        const res = await approveAttendance({
          variables: {
            approveAttendanceInput: {
              attendanceId: Number(attendance.id),
              remarks,
            },
          },
        });
        if (res?.data) {
          // Success handled by hook
        }
      },
      successTitle: "Approved!",
      successMessage: "Attendance approved successfully",
    });
  };

  // REJECT HANDLER
  const handleReject = async (attendance: IAttendance) => {
    // Format details for confirmation
    const name = attendance.user?.profile?.fullName || "Employee";
    const date = dayjs(attendance.date).format("MMM DD, YYYY");
    const totalTime = minutesToHoursAndMinutes(attendance.totalMinutes);

    await confirm({
      title: "Reject Attendance?",
      message: undefined,
      itemName: `${name} - ${date}`,
      itemDescription: `Total Worked: ${totalTime}. This action cannot be undone.`,
      icon: "warning",
      confirmButtonText: "Yes, Reject",
      confirmButtonColor: "#ef4444", // error color
      input: "textarea",
      inputPlaceholder: "Enter reason for rejection...",
      inputRequired: true,
      onConfirm: async (remarks) => {
        const res = await rejectAttendance({
          variables: {
            rejectAttendanceInput: {
              attendanceId: Number(attendance.id),
              remarks,
            },
          },
        });
        if (res?.data) {
          // Success handled by hook
        }
      },
      successTitle: "Rejected!",
      successMessage: "Attendance rejected successfully",
    });
  };

  // VIEW RECORD HANDLER
  const handleViewRecord = (attendance: IAttendance) => {
    setSelectedAttendance(attendance);
    setIsRecordModalOpen(true);
  };

  // ==================== HELPER FUNCTIONS ====================

  // ==================== TABLE CONFIGURATION ====================
  // COLUMNS
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
      header: "Schedule",
      accessorKey: "customScheduleMinutes",
      show: true,
    },
    {
      key: "4",
      header: "Total Worked",
      accessorKey: "customTotalMinutes",
      show: true,
    },
    {
      key: "5",
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
      handler: (row: IAttendance) => handleDelete(row),
      permissions: [Permissions.AttendanceDelete],
      disabledOn: [],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`Attendance Management`}
        subtitle={`Track and manage employee attendance records`}
      />

      {/* ATTENDANCE OVERVIEW */}
      <AttendanceOverview />

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
          customStatus: <AttendanceStatusBadge status={row.status} />,
          customScheduleMinutes:
            minutesToHoursAndMinutes(row.scheduleMinutes) || "N/A",
          customTotalMinutes: row.overtimeMinutes
            ? `${minutesToHoursAndMinutes(row.totalMinutes)} (${minutesToHoursAndMinutes(row.overtimeMinutes)} overtime)`
            : minutesToHoursAndMinutes(row.totalMinutes) || "N/A",
          customType:
            row.type.charAt(0).toUpperCase() + row.type.slice(1) || "N/A",
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
      {popupOption.actionType !== "delete" && (
        <CustomPopup
          customWidth="90%"
          popupOption={popupOption}
          setPopupOption={setPopupOption}
        >
          {popupOption.form === "attendance" && (
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
      )}

      {/* Attendance Record Modal */}
      <AttendanceRecord
        attendance={selectedAttendance}
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setSelectedAttendance(null);
        }}
      />
    </div>
  );
}
