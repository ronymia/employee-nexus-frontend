"use client";

// ==================== EXTERNAL IMPORTS ====================
import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import CustomTable from "@/components/table/CustomTable";
import { TableColumnType } from "@/types";
import { IAttendance } from "@/types/attendance.type";
import {
  PiCheckCircle,
  PiXCircle,
  PiWarning,
  PiPlusCircle,
  PiClock,
} from "react-icons/pi";
import { LiaUserClockSolid } from "react-icons/lia";
import { GET_ATTENDANCES } from "@/graphql/attendance.api";
import { customFormatDate } from "@/utils/date-format.utils";
import CustomPopup from "@/components/modal/CustomPopup";
import AttendanceRequestForm from "./AttendanceRequestForm";
import AttendanceRecord from "@/app/(with-dashboard)/attendance-management/attendance/components/AttendanceRecord";
import usePopupOption from "@/hooks/usePopupOption";
import useAuthGuard from "@/hooks/useAuthGuard";
import useAppStore from "@/hooks/useAppStore";
import { PiClockAfternoon } from "react-icons/pi";
import { motion } from "motion/react";
import PageHeader from "@/components/ui/PageHeader";
import { minutesToHoursAndMinutes } from "@/utils/time.utils";
import AttendanceStatusBadge from "@/components/ui/AttendanceStatusBadge";
import OverviewCard from "@/components/card/OverviewCard";

// ==================== SUB-COMPONENTS ====================

// ATTENDANCE STATS COMPONENT
function AttendanceOverview({ attendances }: { attendances: IAttendance[] }) {
  // Calculate stats from attendances
  const pending = attendances.filter((a) => a.status === "pending").length;
  const approved = attendances.filter((a) => a.status === "approved").length;
  const rejected = attendances.filter((a) => a.status === "rejected").length;
  const late = attendances.filter((a) => a.type === "late").length;
  const partial = attendances.filter((a) => a.type === "partial").length;
  const total = attendances.length;

  const stats = [
    {
      title: "Pending",
      value: pending,
      Icon: PiClock,
      bgColor: "bg-[#fff7d6]",
      decorationColor: "bg-[#ffeea3]",
      iconColor: "text-[#b08800]",
      subText: `out of ${total}`,
      description:
        "Attendance requests submitted but not yet reviewed or approved by a manager.",
    },
    {
      title: "Approved",
      value: approved,
      Icon: PiCheckCircle,
      bgColor: "bg-[#e3f9eb]",
      decorationColor: "bg-[#bcf0cf]",
      iconColor: "text-[#1f8c54]",
      subText: `out of ${total}`,
      description:
        "Attendance requests that have been verified and approved by your manager.",
    },
    {
      title: "Rejected",
      value: rejected,
      Icon: PiXCircle,
      bgColor: "bg-[#ffe3e3]",
      decorationColor: "bg-[#ffc2c2]",
      iconColor: "text-[#c92a2a]",
      subText: `out of ${total}`,
      description:
        "Attendance requests that have been rejected by your manager.",
    },
    {
      title: "Late",
      value: late,
      Icon: PiWarning,
      bgColor: "bg-[#e0f2ff]",
      decorationColor: "bg-[#bae0ff]",
      iconColor: "text-[#1a7bc7]",
      subText: `out of ${total}`,
      description:
        "Attendance records where you checked in after the allowed time threshold.",
    },
    {
      title: "Half Day",
      value: partial,
      Icon: PiClockAfternoon,
      bgColor: "bg-[#edebff]",
      decorationColor: "bg-[#d0c9ff]",
      iconColor: "text-[#5b4eb1]",
      subText: `out of ${total}`,
      description:
        "Attendance marked as partial working hours, below the required full-day duration.",
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

export default function AttendanceRequestPage() {
  useAuthGuard();
  const user = useAppStore((state) => state.user);

  // ==================== LOCAL STATE ====================
  const { popupOption, setPopupOption } = usePopupOption();

  // ATTENDANCE RECORD MODAL STATE
  const [selectedAttendance, setSelectedAttendance] =
    useState<IAttendance | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // ==================== GRAPHQL QUERIES ====================
  // FETCH ATTENDANCES FOR THE LOGGED-IN USER
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

  // ==================== DATA PREPARATION ====================
  const attendances = attendancesData?.attendances?.data || [];
  const loading = attendancesLoading;

  // ==================== HANDLERS ====================
  // VIEW RECORD HANDLER
  const handleViewRecord = (attendance: IAttendance) => {
    setSelectedAttendance(attendance);
    setIsRecordModalOpen(true);
  };

  // ==================== TABLE CONFIGURATION ====================
  // COLUMNS
  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`My Attendance Requests`}
        subtitle={`Submit and track your attendance requests`}
      />

      {/* ATTENDANCE OVERVIEW */}
      <AttendanceOverview attendances={attendances} />

      {/* Attendance Table */}
      <CustomTable
        isLoading={loading}
        actions={[]} // No actions for employee view
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
          customDate: customFormatDate(row.date),
          customStatus: <AttendanceStatusBadge status={row.status} />,
          customScheduleMinutes:
            minutesToHoursAndMinutes(row.scheduleMinutes) || "N/A",
          customTotalMinutes: row.overtimeMinutes
            ? `${minutesToHoursAndMinutes(row.totalMinutes)} (${minutesToHoursAndMinutes(row.overtimeMinutes)} overtime)`
            : minutesToHoursAndMinutes(row.totalMinutes) || "N/A",
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
      <CustomPopup
        customWidth="90%"
        popupOption={popupOption}
        setPopupOption={setPopupOption}
      >
        {popupOption.form === "attendance" && (
          <AttendanceRequestForm
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
    </div>
  );
}
