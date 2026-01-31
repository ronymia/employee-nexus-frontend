"use client";

import { useQuery } from "@apollo/client/react";
import { EMPLOYEE_DASHBOARD } from "@/graphql";
import {
  IEmployeeDashboardResponse,
  IRecentAttendance,
  IAvailableLeave,
  IUpcomingLeaveEmployee,
  IRecentTask,
  INotificationItem,
} from "@/types";
import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineBell,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

// Mock/Dummy Data for Employee Dashboard
const MOCK_EMPLOYEE_DASHBOARD_DATA: IEmployeeDashboardResponse = {
  success: true,
  statusCode: 200,
  message: "Success",
  data: {
    personalInfo: {
      fullName: "John Smith",
      employeeId: "EMP-2024-001",
      department: "Engineering",
      designation: "Senior Software Engineer",
      joiningDate: "2023-01-15",
      email: "john.smith@company.com",
      phone: "+1 (555) 123-4567",
    },
    attendanceSummary: {
      today: {
        status: "PRESENT",
        checkInTime: "09:05 AM",
        checkOutTime: "Not yet",
        workingHours: "6h 45m",
      },
      thisMonth: {
        totalPresent: 18,
        totalAbsent: 1,
        totalLate: 3,
        attendanceRate: 94.7,
      },
      recentAttendance: [
        {
          date: dayjs().format("YYYY-MM-DD"),
          status: "PRESENT",
          checkInTime: "09:05 AM",
          checkOutTime: "Not yet",
        },
        {
          date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
          status: "PRESENT",
          checkInTime: "08:55 AM",
          checkOutTime: "06:10 PM",
        },
        {
          date: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
          status: "PRESENT",
          checkInTime: "09:10 AM",
          checkOutTime: "06:05 PM",
        },
        {
          date: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
          status: "LATE",
          checkInTime: "09:35 AM",
          checkOutTime: "06:20 PM",
        },
        {
          date: dayjs().subtract(4, "day").format("YYYY-MM-DD"),
          status: "PRESENT",
          checkInTime: "08:50 AM",
          checkOutTime: "06:00 PM",
        },
      ],
    },
    leaveSummary: {
      availableLeaves: [
        { leaveType: "Annual Leave", total: 20, used: 8, remaining: 12 },
        { leaveType: "Sick Leave", total: 10, used: 2, remaining: 8 },
        { leaveType: "Personal Leave", total: 5, used: 1, remaining: 4 },
        { leaveType: "Emergency Leave", total: 3, used: 0, remaining: 3 },
      ],
      upcomingLeaves: [
        {
          leaveType: "Annual Leave",
          startDate: dayjs().add(10, "day").format("YYYY-MM-DD"),
          endDate: dayjs().add(14, "day").format("YYYY-MM-DD"),
          status: "APPROVED",
        },
      ],
      leaveHistory: [
        {
          leaveType: "Annual Leave",
          startDate: "2025-11-20",
          endDate: "2025-11-22",
          status: "APPROVED",
          reason: "Family vacation",
        },
        {
          leaveType: "Sick Leave",
          startDate: "2025-10-15",
          endDate: "2025-10-15",
          status: "APPROVED",
          reason: "Medical appointment",
        },
        {
          leaveType: "Personal Leave",
          startDate: "2025-09-10",
          endDate: "2025-09-10",
          status: "APPROVED",
          reason: "Personal matter",
        },
      ],
    },
    payrollSummary: {
      currentMonth: {
        grossPay: 8500,
        totalDeductions: 1200,
        netPay: 7300,
        status: "PROCESSING",
      },
      lastPayment: {
        month: "November 2025",
        grossPay: 8500,
        netPay: 7300,
        paidDate: "2025-11-30",
      },
      yearToDate: {
        totalGrossPay: 93500,
        totalDeductions: 13200,
        totalNetPay: 80300,
      },
    },
    taskOverview: {
      assigned: 15,
      inProgress: 6,
      completed: 32,
      overdue: 2,
      recentTasks: [
        {
          title: "Update API documentation",
          project: "Mobile App Redesign",
          status: "IN_PROGRESS",
          dueDate: dayjs().add(3, "day").format("YYYY-MM-DD"),
          priority: "HIGH",
        },
        {
          title: "Fix authentication bug",
          project: "Customer Portal",
          status: "IN_PROGRESS",
          dueDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
          priority: "URGENT",
        },
        {
          title: "Code review for new feature",
          project: "Mobile App Redesign",
          status: "PENDING",
          dueDate: dayjs().add(5, "day").format("YYYY-MM-DD"),
          priority: "MEDIUM",
        },
        {
          title: "Database optimization",
          project: "Backend Services",
          status: "OVERDUE",
          dueDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
          priority: "HIGH",
        },
        {
          title: "Unit test coverage improvement",
          project: "Mobile App Redesign",
          status: "PENDING",
          dueDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
          priority: "LOW",
        },
      ],
    },
    notifications: {
      unread: 5,
      recent: [
        {
          type: "leave",
          message: "Your Annual Leave request has been approved",
          timestamp: dayjs().subtract(1, "hour").toISOString(),
          isRead: false,
        },
        {
          type: "task",
          message: "New task assigned: Update API documentation",
          timestamp: dayjs().subtract(3, "hour").toISOString(),
          isRead: false,
        },
        {
          type: "payroll",
          message: "December payroll is being processed",
          timestamp: dayjs().subtract(5, "hour").toISOString(),
          isRead: true,
        },
        {
          type: "attendance",
          message: "You were marked as late today",
          timestamp: dayjs().subtract(1, "day").toISOString(),
          isRead: false,
        },
        {
          type: "task",
          message: "Task overdue: Database optimization",
          timestamp: dayjs().subtract(1, "day").toISOString(),
          isRead: false,
        },
      ],
    },
  },
};

export default function EmployeeDashboard() {
  const { data } = useQuery<{
    employeeDashboard: IEmployeeDashboardResponse;
  }>(EMPLOYEE_DASHBOARD, {
    // skip: true, // Skip query to use mock data
  });

  // Use mock data for development
  const dashboardData =
    data?.employeeDashboard?.data || MOCK_EMPLOYEE_DASHBOARD_DATA.data;

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-base-content/70">No dashboard data available</p>
      </div>
    );
  }

  const {
    personalInfo,
    attendanceSummary,
    leaveSummary,
    payrollSummary,
    taskOverview,
    notifications,
  } = dashboardData;

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      {/* Header with Personal Info */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-green-400 flex items-center justify-center text-white text-2xl font-bold">
              {personalInfo.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-base-content">
                Welcome back, {personalInfo.fullName.split(" ")[0]}!
              </h1>
              <p className="text-base-content/70 text-sm">
                {personalInfo.designation} • {personalInfo.department}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <HiOutlineUser className="text-primary" />
              <span>{personalInfo.employeeId}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineCalendar className="text-primary" />
              <span>
                Joined {dayjs(personalInfo.joiningDate).format("MMM YYYY")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard
          title="Attendance Rate"
          value={`${attendanceSummary.thisMonth.attendanceRate}%`}
          subtitle="This Month"
          icon={<HiOutlineCheckCircle className="text-2xl" />}
          gradient="from-green-500 to-emerald-400"
        />
        <QuickStatCard
          title="Tasks in Progress"
          value={taskOverview.inProgress}
          subtitle={`${taskOverview.assigned} Total Assigned`}
          icon={<HiOutlineClipboardList className="text-2xl" />}
          gradient="from-blue-500 to-cyan-400"
        />
        <QuickStatCard
          title="Leave Balance"
          value={leaveSummary.availableLeaves[0]?.remaining || 0}
          subtitle={`${leaveSummary.availableLeaves[0]?.leaveType || "Annual"}`}
          icon={<HiOutlineCalendar className="text-2xl" />}
          gradient="from-purple-500 to-pink-400"
        />
        <QuickStatCard
          title="Net Salary"
          value={`$${(payrollSummary.currentMonth.netPay / 1000).toFixed(1)}K`}
          subtitle={payrollSummary.currentMonth.status}
          icon={<HiOutlineCurrencyDollar className="text-2xl" />}
          gradient="from-orange-500 to-yellow-400"
        />
      </div>

      {/* Attendance and Leave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Today's Attendance
          </h3>
          <div className="space-y-4">
            <div className="bg-linear-to-r from-primary to-green-400 text-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Status</span>
                <span className="badge badge-sm bg-white text-primary">
                  {attendanceSummary.today.status}
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">
                {attendanceSummary.today.workingHours}
              </div>
              <div className="text-sm opacity-90">Working Hours Today</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-base-content/70 mb-1">
                  Check In
                </div>
                <div className="text-lg font-semibold text-base-content">
                  {attendanceSummary.today.checkInTime}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-base-content/70 mb-1">
                  Check Out
                </div>
                <div className="text-lg font-semibold text-base-content">
                  {attendanceSummary.today.checkOutTime}
                </div>
              </div>
            </div>

            {/* This Month Stats */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-base-content mb-3">
                This Month
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-success">
                    {attendanceSummary.thisMonth.totalPresent}
                  </div>
                  <div className="text-xs text-base-content/70">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-warning">
                    {attendanceSummary.thisMonth.totalLate}
                  </div>
                  <div className="text-xs text-base-content/70">Late</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-error">
                    {attendanceSummary.thisMonth.totalAbsent}
                  </div>
                  <div className="text-xs text-base-content/70">Absent</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Leave Balance
          </h3>
          <div className="space-y-3">
            {leaveSummary.availableLeaves.map(
              (leave: IAvailableLeave, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-base-content">
                      {leave.leaveType}
                    </span>
                    <span className="text-xs text-base-content/70">
                      {leave.used}/{leave.total} used
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(leave.remaining / leave.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {leave.remaining}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Upcoming Leaves */}
          {leaveSummary.upcomingLeaves.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-semibold text-base-content mb-3">
                Upcoming Leaves
              </h4>
              {leaveSummary.upcomingLeaves.map(
                (leave: IUpcomingLeaveEmployee, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-sm text-base-content">
                        {leave.leaveType}
                      </div>
                      <div className="text-xs text-base-content/70">
                        {dayjs(leave.startDate).format("MMM DD")} -{" "}
                        {dayjs(leave.endDate).format("MMM DD, YYYY")}
                      </div>
                    </div>
                    <span className="badge badge-sm badge-success">
                      {leave.status}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Attendance History */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-base-content mb-4">
          Recent Attendance
        </h3>
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {attendanceSummary.recentAttendance.map(
                (record: IRecentAttendance, index: number) => (
                  <tr key={index}>
                    <td>{dayjs(record.date).format("ddd, MMM DD, YYYY")}</td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          record.status === "PRESENT"
                            ? "badge-success"
                            : record.status === "LATE"
                              ? "badge-warning"
                              : "badge-error"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td>{record.checkInTime}</td>
                    <td>{record.checkOutTime}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasks and Payroll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Task Overview
          </h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-info">
                {taskOverview.assigned}
              </div>
              <div className="text-xs text-base-content/70">Assigned</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-warning">
                {taskOverview.inProgress}
              </div>
              <div className="text-xs text-base-content/70">In Progress</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-success">
                {taskOverview.completed}
              </div>
              <div className="text-xs text-base-content/70">Completed</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-error">
                {taskOverview.overdue}
              </div>
              <div className="text-xs text-base-content/70">Overdue</div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div>
            <h4 className="text-sm font-semibold text-base-content mb-3">
              Recent Tasks
            </h4>
            <div className="space-y-2">
              {taskOverview.recentTasks
                .slice(0, 5)
                .map((task: IRecentTask, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm text-base-content">
                        {task.title}
                      </div>
                      <div className="text-xs text-base-content/70 mt-1">
                        {task.project} • Due{" "}
                        {dayjs(task.dueDate).format("MMM DD")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge badge-xs ${
                          task.priority === "URGENT"
                            ? "badge-error"
                            : task.priority === "HIGH"
                              ? "badge-warning"
                              : task.priority === "MEDIUM"
                                ? "badge-info"
                                : "badge-ghost"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`badge badge-xs ${
                          task.status === "IN_PROGRESS"
                            ? "badge-warning"
                            : task.status === "OVERDUE"
                              ? "badge-error"
                              : "badge-ghost"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Payroll Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Payroll Summary
          </h3>

          {/* Current Month */}
          <div className="bg-linear-to-r from-primary to-green-400 text-white rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Current Month</span>
              <span className="badge badge-sm bg-white text-primary">
                {payrollSummary.currentMonth.status}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">
              ${payrollSummary.currentMonth.netPay.toLocaleString()}
            </div>
            <div className="text-sm opacity-90">Net Pay</div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div>
                Gross: ${payrollSummary.currentMonth.grossPay.toLocaleString()}
              </div>
              <div>
                Deductions: $
                {payrollSummary.currentMonth.totalDeductions.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Last Payment */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <div className="text-sm text-base-content/70 mb-1">
              Last Payment
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-base-content">
                  ${payrollSummary.lastPayment.netPay.toLocaleString()}
                </div>
                <div className="text-xs text-base-content/70">
                  {payrollSummary.lastPayment.month}
                </div>
              </div>
              <div className="text-xs text-base-content/70">
                Paid on{" "}
                {dayjs(payrollSummary.lastPayment.paidDate).format(
                  "MMM DD, YYYY",
                )}
              </div>
            </div>
          </div>

          {/* Year to Date */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold text-base-content mb-3">
              Year to Date
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-base-content">
                  ${(payrollSummary.yearToDate.totalGrossPay / 1000).toFixed(0)}
                  K
                </div>
                <div className="text-xs text-base-content/70">Gross</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-error">
                  $
                  {(payrollSummary.yearToDate.totalDeductions / 1000).toFixed(
                    0,
                  )}
                  K
                </div>
                <div className="text-xs text-base-content/70">Deductions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-success">
                  ${(payrollSummary.yearToDate.totalNetPay / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-base-content/70">Net</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-base-content">
            Recent Notifications
          </h3>
          {notifications.unread > 0 && (
            <span className="badge badge-error badge-sm">
              {notifications.unread} unread
            </span>
          )}
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.recent.map(
            (notification: INotificationItem, index: number) => (
              <div
                key={index}
                className={`flex gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  !notification.isRead ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    notification.type === "leave"
                      ? "bg-blue-100 text-blue-600"
                      : notification.type === "task"
                        ? "bg-purple-100 text-purple-600"
                        : notification.type === "payroll"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {notification.type === "leave" ? (
                    <HiOutlineCalendar className="text-lg" />
                  ) : notification.type === "task" ? (
                    <HiOutlineClipboardList className="text-lg" />
                  ) : notification.type === "payroll" ? (
                    <HiOutlineCurrencyDollar className="text-lg" />
                  ) : (
                    <HiOutlineBell className="text-lg" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-base-content">
                    {notification.message}
                  </p>
                  <p className="text-xs text-base-content/70 mt-1">
                    {dayjs(notification.timestamp).fromNow()}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></div>
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

// Quick Stat Card Component
interface QuickStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
}

function QuickStatCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
}: QuickStatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-md border border-gray-100">
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-10`}
      ></div>
      <div className="relative p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-base-content/70 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-base-content mb-1">
              {value}
            </h3>
            <p className="text-xs text-base-content/60">{subtitle}</p>
          </div>
          <div
            className={`bg-linear-to-br ${gradient} p-3 rounded-lg text-white`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
