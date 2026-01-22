"use client";

// ==================== EXTERNAL IMPORTS ====================
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
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { PiClockAfternoon } from "react-icons/pi";
import { motion } from "motion/react";
import PageHeader from "@/components/ui/PageHeader";
import FormModal from "@/components/form/FormModal";
import { showToast } from "@/components/ui/CustomToast";
import { minutesToHoursAndMinutes } from "@/utils/time.utils";
import AttendanceStatusBadge from "@/components/ui/AttendanceStatusBadge";

// ==================== SUB-COMPONENTS ====================

// ATTENDANCE STATS COMPONENT
import OverviewCard from "@/components/card/OverviewCard";

function AttendanceOverview() {
  const { data, loading, error } = useQuery<{
    attendanceOverview: {
      data: {
        pending: number;
        approved: number;
        absent: number;
        late: number;
        halfDay: number;
      };
    };
  }>(ATTENDANCE_OVERVIEW);

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
      subText: "Awaiting Approval",
    },
    {
      title: "Approved",
      value: summary?.approved || 0,
      Icon: PiCheckCircle,
      bgColor: "bg-[#e3f9eb]",
      decorationColor: "bg-[#bcf0cf]",
      iconColor: "text-[#1f8c54]",
      subText: "Regularized",
    },
    {
      title: "Absent",
      value: summary?.absent || 0,
      Icon: PiXCircle,
      bgColor: "bg-[#ffe3e3]",
      decorationColor: "bg-[#ffc2c2]",
      iconColor: "text-[#c92a2a]",
      subText: "Unaccounted",
    },
    {
      title: "Late",
      value: summary?.late || 0,
      Icon: PiWarning,
      bgColor: "bg-[#e0f2ff]",
      decorationColor: "bg-[#bae0ff]",
      iconColor: "text-[#1a7bc7]",
      subText: "Check-in Delay",
    },
    {
      title: "Half Day",
      value: summary?.halfDay || 0,
      Icon: PiClockAfternoon,
      bgColor: "bg-[#edebff]",
      decorationColor: "bg-[#d0c9ff]",
      iconColor: "text-[#5b4eb1]",
      subText: "Partial Duty",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <OverviewCard stat={stat} handler={undefined} isLoading={loading} />
        </motion.div>
      ))}
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function AttendancePage() {
  // ==================== PERMISSIONS ====================
  const { hasPermission } = usePermissionGuard();

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
    refetchQueries: [{ query: GET_ATTENDANCES, variables: { query: {} } }],
    onCompleted: () => {
      setPopupOption({ ...popupOption, open: false });
    },
  });

  // APPROVE ATTENDANCE
  const [approveAttendance] = useMutation(APPROVE_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ATTENDANCES, variables: { query: {} } }],
  });

  // REJECT ATTENDANCE
  const [rejectAttendance] = useMutation(REJECT_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ATTENDANCES, variables: { query: {} } }],
  });

  // ==================== DATA PREPARATION ====================
  const attendances = attendancesData?.attendances?.data || [];
  const loading = attendancesLoading;

  // ==================== HANDLERS ====================
  // DELETE HANDLER
  const handleDelete = async (attendance: IAttendance) => {
    try {
      const res = await deleteAttendance({
        variables: { id: Number(attendance.id) },
      });
      if (res?.data) {
        showToast.success("Deleted!", "Attendance deleted successfully");
      }
    } catch (error: any) {
      showToast.error("Error", error.message || "Failed to delete attendance");
    }
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
    try {
      const res = await approveAttendance({
        variables: { attendanceId: Number(attendance.id) },
      });
      if (res?.data) {
        showToast.success("Approved!", "Attendance approved successfully");
      }
    } catch (error: any) {
      showToast.error("Error", error.message || "Failed to approve attendance");
    }
  };

  // REJECT HANDLER
  const handleReject = async (attendance: IAttendance) => {
    try {
      const res = await rejectAttendance({
        variables: { attendanceId: Number(attendance.id) },
      });
      if (res?.data) {
        showToast.success("Rejected!", "Attendance rejected successfully");
      }
    } catch (error: any) {
      showToast.error("Error", error.message || "Failed to reject attendance");
    }
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
      header: "Total",
      accessorKey: "customTotalMinutes",
      show: true,
    },
    {
      key: "5",
      header: "Break",
      accessorKey: "customBreakMinutes",
      show: true,
    },
    {
      key: "6",
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
      handler: (row: IAttendance) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "attendance",
          deleteHandler: () => handleDelete(row),
          title: "Delete Attendance",
        });
      },
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
          customTotalMinutes:
            minutesToHoursAndMinutes(row.totalMinutes) || "N/A",
          customBreakMinutes:
            minutesToHoursAndMinutes(row.breakMinutes) || "N/A",
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

      {popupOption.actionType === "delete" && (
        <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />
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
