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
} from "@/graphql/attendance.api";
import dayjs from "dayjs";
import CustomPopup from "@/components/modal/CustomPopup";
import AttendanceForm from "./components/AttendanceForm";
import AttendanceRecord from "./components/AttendanceRecord";
import usePopupOption from "@/hooks/usePopupOption";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { ATTENDANCE_SUMMARY } from "@/graphql/attendance.api";
import { PiClockAfternoon } from "react-icons/pi";
import { IconType } from "react-icons";
import { motion } from "motion/react";
import PageHeader from "@/components/ui/PageHeader";
import FormModal from "@/components/form/FormModal";
import { showToast } from "@/components/ui/CustomToast";
import { minutesToHoursAndMinutes } from "@/utils/time.utils";

// ==================== SUB-COMPONENTS ====================

// STATS CARD COMPONENT
interface IStatsCardProps {
  icon: IconType;
  label: string;
  count: number;
  color: "primary" | "success" | "warning" | "error" | "info";
  index: number;
}

function StatsCard({
  icon: Icon,
  label,
  count,
  color,
  index,
}: IStatsCardProps) {
  const colorClasses = {
    primary: {
      bg: "bg-linear-to-br from-primary/10 via-primary/5 to-transparent",
      border: "border-primary/30 hover:border-primary/50",
      iconBg: "bg-primary/20",
      icon: "text-primary",
      text: "text-primary",
      glow: "shadow-primary/20",
    },
    success: {
      bg: "bg-linear-to-br from-success/10 via-success/5 to-transparent",
      border: "border-success/30 hover:border-success/50",
      iconBg: "bg-success/20",
      icon: "text-success",
      text: "text-success",
      glow: "shadow-success/20",
    },
    warning: {
      bg: "bg-linear-to-br from-warning/10 via-warning/5 to-transparent",
      border: "border-warning/30 hover:border-warning/50",
      iconBg: "bg-warning/20",
      icon: "text-warning",
      text: "text-warning",
      glow: "shadow-warning/20",
    },
    error: {
      bg: "bg-linear-to-br from-error/10 via-error/5 to-transparent",
      border: "border-error/30 hover:border-error/50",
      iconBg: "bg-error/20",
      icon: "text-error",
      text: "text-error",
      glow: "shadow-error/20",
    },
    info: {
      bg: "bg-linear-to-br from-info/10 via-info/5 to-transparent",
      border: "border-info/30 hover:border-info/50",
      iconBg: "bg-info/20",
      icon: "text-info",
      text: "text-info",
      glow: "shadow-info/20",
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        y: -6,
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
      className={`
        relative overflow-hidden
        border ${colors.border} ${colors.bg}
        rounded-xl p-5
        backdrop-blur-sm
        transition-all duration-300
        hover:shadow-lg ${colors.glow}
        group cursor-pointer
      `}
    >
      {/* BACKGROUND SHIMMER */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          delay: index * 0.2,
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: index * 0.08 + 0.2,
              duration: 0.6,
              type: "spring",
              stiffness: 200,
            }}
            className={`${colors.iconBg} ${colors.icon} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon size={24} className="drop-shadow-sm" />
          </motion.div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.08 + 0.3,
              duration: 0.5,
              type: "spring",
            }}
            className={`text-4xl font-bold ${colors.text} drop-shadow-sm`}
          >
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 + 0.4 }}
            >
              {count}
            </motion.span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 + 0.5 }}
          className="flex items-center gap-2"
        >
          <p className="text-sm font-semibold text-base-content/80 uppercase tracking-wide">
            {label}
          </p>
          <motion.div
            className={`h-1 flex-1 ${colors.iconBg} rounded-full`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.08 + 0.6, duration: 0.4 }}
            style={{ transformOrigin: "left" }}
          />
        </motion.div>
      </div>

      {/* BOTTOM ACCENT */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-1 ${colors.iconBg}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: index * 0.08 + 0.7, duration: 0.5 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
}

// ATTENDANCE STATS COMPONENT
interface IAttendanceStatsProps {
  startDate?: string;
  endDate?: string;
  userId?: number;
}

function AttendanceStats({
  startDate = undefined,
  endDate = undefined,
  userId = undefined,
}: IAttendanceStatsProps) {
  const { data, loading, error } = useQuery<{
    attendanceSummary: {
      data: {
        pending: number;
        approved: number;
        absent: number;
        late: number;
        halfDay: number;
      };
    };
  }>(ATTENDANCE_SUMMARY, {
    variables: { startDate, endDate, userId },
  });

  const summary = data?.attendanceSummary?.data;
  console.log({ summary });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="border border-base-300 rounded-lg p-4 bg-base-200/50 animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-base-300 rounded-lg"></div>
              <div className="w-12 h-8 bg-base-300 rounded"></div>
            </div>
            <div className="w-20 h-4 bg-base-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

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
      icon: PiClock,
      label: "Pending",
      count: summary?.pending || 0,
      color: "warning" as const,
    },
    {
      icon: PiCheckCircle,
      label: "Approved",
      count: summary?.approved || 0,
      color: "success" as const,
    },
    {
      icon: PiXCircle,
      label: "Absent",
      count: summary?.absent || 0,
      color: "error" as const,
    },
    {
      icon: PiWarning,
      label: "Late",
      count: summary?.late || 0,
      color: "info" as const,
    },
    {
      icon: PiClockAfternoon,
      label: "Half Day",
      count: summary?.halfDay || 0,
      color: "primary" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatsCard key={stat.label} {...stat} index={index} />
      ))}
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function AttendancePage() {
  // ==================== PERMISSIONS ====================
  const { hasPermission } = usePermissionGuard();

  // ==================== LOCAL STATE ====================
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

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
  // STATUS BADGE
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
      case "present":
        return (
          <span className="badge badge-success gap-1">
            <PiCheckCircle size={14} />
            Present
          </span>
        );
      case "absent":
        return (
          <span className="badge badge-error gap-1">
            <PiXCircle size={14} />
            Absent
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
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

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

      {/* ATTENDANCE SUMMARY STATS */}
      <AttendanceStats />

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
