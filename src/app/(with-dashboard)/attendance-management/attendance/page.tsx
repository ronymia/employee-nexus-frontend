"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import CustomTable from "@/components/table/CustomTable";
import { TableColumnType, IEmployee, IPopupOption } from "@/types";
import {
  PiCalendarBlank,
  PiClock,
  PiMapPin,
  PiUser,
  PiCheckCircle,
  PiXCircle,
  PiWarning,
  PiMinus,
  PiAirplaneTilt,
  PiPlusCircle,
} from "react-icons/pi";
import { GET_EMPLOYEES } from "@/graphql/employee.api";
import moment from "moment";
import CustomPopup from "@/components/modal/CustomPopup";
import AttendanceForm from "./components/AttendanceForm";
import usePopupOption from "@/hooks/usePopupOption";

interface IAttendancePunch {
  id: number;
  attendanceId: number;
  projectId?: number;
  workSiteId?: number;
  punchIn: string;
  punchOut?: string;
  breakStart?: string;
  breakEnd?: string;
  workHours?: number;
  breakHours?: number;
  punchInIp?: string;
  punchOutIp?: string;
  punchInLat?: number;
  punchInLng?: number;
  punchOutLat?: number;
  punchOutLng?: number;
  punchInDevice?: string;
  punchOutDevice?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface IAttendance {
  id: number;
  userId: number;
  user?: IEmployee;
  date: string;
  totalHours?: number;
  breakHours?: number;
  status: string;
  punchRecords: IAttendancePunch[];
  createdAt: string;
  updatedAt: string;
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

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

  // TODO: Replace with actual attendance data from GraphQL
  const dummyAttendances: IAttendance[] = [
    {
      id: 1,
      userId: 1,
      date: moment().format("YYYY-MM-DD"),
      totalHours: 8.5,
      breakHours: 1,
      status: "present",
      punchRecords: [
        {
          id: 1,
          attendanceId: 1,
          punchIn: moment().set({ hour: 9, minute: 0 }).toISOString(),
          punchOut: moment().set({ hour: 18, minute: 30 }).toISOString(),
          breakStart: moment().set({ hour: 13, minute: 0 }).toISOString(),
          breakEnd: moment().set({ hour: 14, minute: 0 }).toISOString(),
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
          notes: "Regular working day",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
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
      key: "3",
      header: "Punch In",
      accessorKey: "customPunchIn",
      show: true,
    },
    {
      key: "4",
      header: "Punch Out",
      accessorKey: "customPunchOut",
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
      header: "Break",
      accessorKey: "customBreakHours",
      show: true,
    },
    {
      key: "7",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
    },
    {
      key: "8",
      header: "Location",
      accessorKey: "customLocation",
      show: true,
    },
  ]);

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
                <p className="text-2xl font-bold text-success">0</p>
              </div>
              <PiCheckCircle size={32} className="text-success" />
            </div>
          </div>

          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/60">Absent</p>
                <p className="text-2xl font-bold text-error">0</p>
              </div>
              <PiXCircle size={32} className="text-error" />
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/60">Late</p>
                <p className="text-2xl font-bold text-warning">0</p>
              </div>
              <PiWarning size={32} className="text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <CustomTable
        isLoading={loading}
        actions={[]}
        columns={columns}
        setColumns={setColumns}
        dataSource={dummyAttendances.map((row) => ({
          ...row,
          customEmployeeName: row.user?.profile?.fullName || "N/A",
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
          customStatus: row.status,
          customLocation:
            row.punchRecords?.[0]?.punchInLat &&
            row.punchRecords?.[0]?.punchInLng
              ? "Available"
              : "--",
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
      </CustomTable>

      {/* Attendance Form Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        {popupOption.form === "attendance" && (
          <AttendanceForm
            employees={employees}
            attendance={popupOption.data}
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
