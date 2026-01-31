"use client";

import { useQuery } from "@apollo/client/react";
import { OWNER_DASHBOARD } from "@/graphql";
import {
  IOwnerDashboardResponse,
  IRecentProject,
  IRecentActivity,
  IUpcomingLeave,
  PayrollCycleStatus,
  PayrollFrequency,
} from "@/types";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
} from "react-icons/hi";
import { HiOutlineUserGroup, HiOutlineBell } from "react-icons/hi2";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const COLORS = {
  primary: "#10b981",
  secondary: "#3b82f6",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
  purple: "#a855f7",
  pink: "#ec4899",
};

const PIE_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.warning,
  COLORS.error,
  COLORS.info,
];

// Mock/Dummy Data for UI Development
const MOCK_DASHBOARD_DATA: IOwnerDashboardResponse = {
  success: true,
  statusCode: 200,
  message: "Success",
  data: {
    businessOverview: {
      totalEmployees: 156,
      activeEmployees: 142,
      inactiveEmployees: 14,
      totalDepartments: 8,
      totalProjects: 24,
      activeProjects: 18,
      totalMonthlyPayroll: 485000,
      pendingPayrollAmount: 32000,
    },
    attendanceAnalytics: {
      today: {
        present: 128,
        absent: 8,
        late: 12,
        onLeave: 6,
        notPunchedIn: 2,
      },
      thisWeek: {
        averageAttendanceRate: 92.5,
        totalWorkingDays: 5,
        totalPresentDays: 4,
      },
      thisMonth: {
        attendanceRate: 94.2,
        lateArrivals: 45,
        earlyDepartures: 12,
      },
      trend: [
        {
          date: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
          presentCount: 132,
        },
        {
          date: dayjs().subtract(5, "day").format("YYYY-MM-DD"),
          presentCount: 128,
        },
        {
          date: dayjs().subtract(4, "day").format("YYYY-MM-DD"),
          presentCount: 135,
        },
        {
          date: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
          presentCount: 130,
        },
        {
          date: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
          presentCount: 138,
        },
        {
          date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
          presentCount: 140,
        },
        { date: dayjs().format("YYYY-MM-DD"), presentCount: 128 },
      ],
    },
    leaveStats: {
      pending: 8,
      approved: 45,
      rejected: 3,
      thisMonth: {
        total: 56,
        byType: [
          { leaveType: "Annual Leave", count: 22 },
          { leaveType: "Sick Leave", count: 15 },
          { leaveType: "Personal Leave", count: 10 },
          { leaveType: "Maternity Leave", count: 6 },
          { leaveType: "Emergency Leave", count: 3 },
        ],
      },
      upcomingLeaves: [
        {
          employeeName: "Sarah Johnson",
          leaveType: "Annual Leave",
          startDate: dayjs().add(2, "day").format("YYYY-MM-DD"),
          endDate: dayjs().add(6, "day").format("YYYY-MM-DD"),
        },
        {
          employeeName: "Michael Chen",
          leaveType: "Sick Leave",
          startDate: dayjs().add(3, "day").format("YYYY-MM-DD"),
          endDate: dayjs().add(3, "day").format("YYYY-MM-DD"),
        },
        {
          employeeName: "Emily Davis",
          leaveType: "Personal Leave",
          startDate: dayjs().add(5, "day").format("YYYY-MM-DD"),
          endDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
        },
        {
          employeeName: "James Wilson",
          leaveType: "Annual Leave",
          startDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
          endDate: dayjs().add(14, "day").format("YYYY-MM-DD"),
        },
      ],
    },
    payrollSummary: {
      currentCycle: {
        name: "December 2025 Payroll",
        status: PayrollCycleStatus.PROCESSING,
        periodStart: "2025-12-01",
        periodEnd: "2025-12-31",
        paymentDate: "2025-12-31",
        totalEmployees: 142,
        totalGrossPay: 485000,
        totalDeductions: 48500,
        totalNetPay: 436500,
        businessId: 1,
        id: 101,
        frequency: PayrollFrequency.MONTHLY,
        createdAt: "2025-12-01T10:00:00Z",
        updatedAt: "2025-12-15T12:00:00Z",
      },
      yearToDate: {
        totalPaid: 5420000,
        averageMonthlyPayroll: 451667,
        highestMonth: {
          month: "December",
          amount: 485000,
        },
        lowestMonth: {
          month: "February",
          amount: 420000,
        },
      },
      pendingActions: {
        draftCycles: 2,
        pendingApprovals: 5,
        pendingPayments: 3,
      },
    },
    projectOverview: {
      total: 24,
      active: 18,
      completed: 4,
      onHold: 2,
      recentProjects: [
        {
          name: "Mobile App Redesign",
          status: "ACTIVE",
          memberCount: 8,
          startDate: "2025-11-15",
          endDate: "2026-02-28",
        },
        {
          name: "Customer Portal Enhancement",
          status: "ACTIVE",
          memberCount: 6,
          startDate: "2025-12-01",
          endDate: "2026-01-31",
        },
        {
          name: "HR System Integration",
          status: "COMPLETED",
          memberCount: 5,
          startDate: "2025-09-01",
          endDate: "2025-11-30",
        },
        {
          name: "Security Audit",
          status: "ON_HOLD",
          memberCount: 3,
          startDate: "2025-10-15",
          endDate: "2025-12-15",
        },
      ],
    },
    recentActivities: {
      unreadNotifications: 12,
      recentActivities: [
        {
          type: "leave",
          message: "Sarah Johnson requested 5 days of Annual Leave",
          timestamp: dayjs().subtract(30, "minute").toISOString(),
        },
        {
          type: "attendance",
          message: "12 employees marked as late today",
          timestamp: dayjs().subtract(1, "hour").toISOString(),
        },
        {
          type: "payroll",
          message: "December 2025 Payroll cycle initiated",
          timestamp: dayjs().subtract(2, "hour").toISOString(),
        },
        {
          type: "leave",
          message: "Michael Chen's Sick Leave was approved",
          timestamp: dayjs().subtract(3, "hour").toISOString(),
        },
        {
          type: "project",
          message: "Mobile App Redesign project milestone completed",
          timestamp: dayjs().subtract(5, "hour").toISOString(),
        },
        {
          type: "attendance",
          message: "Average attendance rate increased to 94.2%",
          timestamp: dayjs().subtract(1, "day").toISOString(),
        },
        {
          type: "payroll",
          message: "November payroll processed successfully",
          timestamp: dayjs().subtract(2, "day").toISOString(),
        },
        {
          type: "leave",
          message: "5 leave requests pending approval",
          timestamp: dayjs().subtract(3, "day").toISOString(),
        },
      ],
    },
  },
};

export default function OwnerDashboard() {
  const { data, loading } = useQuery<{
    ownerDashboard: IOwnerDashboardResponse;
  }>(OWNER_DASHBOARD, {
    // Skip query for now to use mock data
    // skip: true,
  });

  // Use mock data for development
  const dashboardData = data?.ownerDashboard?.data || MOCK_DASHBOARD_DATA.data;

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-base-content/70">No dashboard data available</p>
      </div>
    );
  }

  const {
    businessOverview,
    attendanceAnalytics,
    leaveStats,
    payrollSummary,
    projectOverview,
    recentActivities,
  } = dashboardData;

  // console.log({ dashboardData });

  if (loading) {
    return <CustomLoading />;
  }
  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Dashboard Overview
          </h1>
          <p className="text-base-content/70 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="text-sm text-base-content/70">
          Last updated: {dayjs().format("MMM DD, YYYY HH:mm")}
        </div>
      </div>

      {/* Business Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={businessOverview.totalEmployees}
          subtitle={`${businessOverview.activeEmployees} Active`}
          icon={<HiOutlineUsers className="text-3xl" />}
          gradient="from-primary to-green-400"
        />
        <StatCard
          title="Departments"
          value={businessOverview.totalDepartments}
          subtitle="Organizational Units"
          icon={<HiOutlineUserGroup className="text-3xl" />}
          gradient="from-blue-500 to-cyan-400"
        />
        <StatCard
          title="Active Projects"
          value={businessOverview.activeProjects}
          subtitle={`${businessOverview.totalProjects} Total`}
          icon={<HiOutlineBriefcase className="text-3xl" />}
          gradient="from-purple-500 to-pink-400"
        />
        <StatCard
          title="Monthly Payroll"
          value={`$${(businessOverview.totalMonthlyPayroll / 1000).toFixed(
            1,
          )}K`}
          subtitle={`$${(businessOverview.pendingPayrollAmount / 1000).toFixed(
            1,
          )}K Pending`}
          icon={<HiOutlineCurrencyDollar className="text-3xl" />}
          gradient="from-orange-500 to-yellow-400"
        />
      </div>

      {/* Attendance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Attendance */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Today's Attendance
          </h3>
          <div className="space-y-3">
            <AttendanceItem
              label="Present"
              value={attendanceAnalytics.today.present}
              color={COLORS.success}
            />
            <AttendanceItem
              label="Absent"
              value={attendanceAnalytics.today.absent}
              color={COLORS.error}
            />
            <AttendanceItem
              label="Late"
              value={attendanceAnalytics.today.late}
              color={COLORS.warning}
            />
            <AttendanceItem
              label="On Leave"
              value={attendanceAnalytics.today.onLeave}
              color={COLORS.info}
            />
            <AttendanceItem
              label="Not Punched In"
              value={attendanceAnalytics.today.notPunchedIn}
              color={COLORS.secondary}
            />
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            This Week
          </h3>
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-primary">
                {attendanceAnalytics.thisWeek.averageAttendanceRate.toFixed(1)}%
              </div>
              <div className="text-sm text-base-content/70 mt-1">
                Average Attendance Rate
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-semibold text-base-content">
                  {attendanceAnalytics.thisWeek.totalPresentDays}
                </div>
                <div className="text-xs text-base-content/70">Present Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-base-content">
                  {attendanceAnalytics.thisWeek.totalWorkingDays}
                </div>
                <div className="text-xs text-base-content/70">Working Days</div>
              </div>
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            This Month
          </h3>
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-primary">
                {attendanceAnalytics.thisMonth.attendanceRate.toFixed(1)}%
              </div>
              <div className="text-sm text-base-content/70 mt-1">
                Attendance Rate
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-semibold text-warning">
                  {attendanceAnalytics.thisMonth.lateArrivals}
                </div>
                <div className="text-xs text-base-content/70">
                  Late Arrivals
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-error">
                  {attendanceAnalytics.thisMonth.earlyDepartures}
                </div>
                <div className="text-xs text-base-content/70">
                  Early Departures
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-base-content mb-4">
          Attendance Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceAnalytics.trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => dayjs(value).format("MMM DD")}
              style={{ fontSize: "12px" }}
            />
            <YAxis style={{ fontSize: "12px" }} />
            <Tooltip
              labelFormatter={(value) => dayjs(value).format("MMM DD, YYYY")}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="presentCount"
              stroke={COLORS.primary}
              strokeWidth={2}
              name="Present Employees"
              dot={{ fill: COLORS.primary, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leave Statistics and Payroll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Statistics */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Leave Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-warning">
                {leaveStats.pending}
              </div>
              <div className="text-xs text-base-content/70 mt-1">Pending</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {leaveStats.approved}
              </div>
              <div className="text-xs text-base-content/70 mt-1">Approved</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-error">
                {leaveStats.rejected}
              </div>
              <div className="text-xs text-base-content/70 mt-1">Rejected</div>
            </div>
          </div>

          {/* Leave Types This Month */}
          {leaveStats.thisMonth.byType.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-base-content mb-3">
                This Month by Type
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={leaveStats.thisMonth.byType as any}
                    dataKey="count"
                    nameKey="leaveType"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry: any) => `${entry.leaveType}: ${entry.count}`}
                  >
                    {leaveStats.thisMonth.byType.map((_, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Payroll Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Payroll Summary
          </h3>

          {payrollSummary.currentCycle && (
            <div className="bg-linear-to-r from-primary to-green-400 text-white rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">
                  {payrollSummary.currentCycle.name}
                </h4>
                <span className="badge badge-sm bg-white text-primary">
                  {payrollSummary.currentCycle.status}
                </span>
              </div>
              <div className="text-2xl font-bold mb-1">
                ${(payrollSummary.currentCycle.totalNetPay / 1000).toFixed(2)}K
              </div>
              <div className="text-sm opacity-90">
                Payment Date:{" "}
                {dayjs(payrollSummary.currentCycle.paymentDate).format(
                  "MMM DD, YYYY",
                )}
              </div>
              <div className="text-xs opacity-75 mt-2">
                {payrollSummary.currentCycle.totalEmployees} Employees
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-base-content">
                {payrollSummary.pendingActions.draftCycles}
              </div>
              <div className="text-xs text-base-content/70">Drafts</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-warning">
                {payrollSummary.pendingActions.pendingApprovals}
              </div>
              <div className="text-xs text-base-content/70">Approvals</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-error">
                {payrollSummary.pendingActions.pendingPayments}
              </div>
              <div className="text-xs text-base-content/70">Payments</div>
            </div>
          </div>

          {/* Year to Date */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-semibold text-base-content mb-2">
              Year to Date
            </h4>
            <div className="text-2xl font-bold text-primary mb-2">
              ${(payrollSummary.yearToDate.totalPaid / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-base-content/70">
              Avg Monthly: $
              {(payrollSummary.yearToDate.averageMonthlyPayroll / 1000).toFixed(
                1,
              )}
              K
            </div>
          </div>
        </div>
      </div>

      {/* Projects and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Project Overview
          </h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-base-content">
                {projectOverview.total}
              </div>
              <div className="text-xs text-base-content/70">Total</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-success">
                {projectOverview.active}
              </div>
              <div className="text-xs text-base-content/70">Active</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-info">
                {projectOverview.completed}
              </div>
              <div className="text-xs text-base-content/70">Completed</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-warning">
                {projectOverview.onHold}
              </div>
              <div className="text-xs text-base-content/70">On Hold</div>
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <h4 className="text-sm font-semibold text-base-content mb-3">
              Recent Projects
            </h4>
            <div className="space-y-2">
              {projectOverview.recentProjects.map(
                (project: IRecentProject, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm text-base-content">
                        {project.name}
                      </div>
                      <div className="text-xs text-base-content/70 mt-1">
                        {project.memberCount} members •{" "}
                        {dayjs(project.startDate).format("MMM DD")}
                      </div>
                    </div>
                    <span
                      className={`badge badge-sm ${
                        project.status === "ACTIVE"
                          ? "badge-success"
                          : project.status === "COMPLETED"
                            ? "badge-info"
                            : "badge-warning"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-base-content">
              Recent Activities
            </h3>
            {recentActivities.unreadNotifications > 0 && (
              <span className="badge badge-error badge-sm">
                {recentActivities.unreadNotifications}
              </span>
            )}
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivities.recentActivities.map(
              (activity: IRecentActivity, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      activity.type === "leave"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "attendance"
                          ? "bg-green-100 text-green-600"
                          : activity.type === "payroll"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {activity.type === "leave" ? (
                      <HiOutlineCalendar className="text-lg" />
                    ) : activity.type === "attendance" ? (
                      <HiOutlineUsers className="text-lg" />
                    ) : activity.type === "payroll" ? (
                      <HiOutlineCurrencyDollar className="text-lg" />
                    ) : (
                      <HiOutlineBell className="text-lg" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-base-content">
                      {activity.message}
                    </p>
                    <p className="text-xs text-base-content/70 mt-1">
                      {dayjs(activity.timestamp).fromNow()}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Leaves */}
      {leaveStats.upcomingLeaves.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            Upcoming Leaves
          </h3>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {leaveStats.upcomingLeaves.map(
                  (leave: IUpcomingLeave, index: number) => {
                    const duration =
                      dayjs(leave.endDate).diff(dayjs(leave.startDate), "day") +
                      1;
                    return (
                      <tr key={index}>
                        <td className="font-medium">{leave.employeeName}</td>
                        <td>
                          <span className="badge badge-sm badge-outline">
                            {leave.leaveType}
                          </span>
                        </td>
                        <td>{dayjs(leave.startDate).format("MMM DD, YYYY")}</td>
                        <td>{dayjs(leave.endDate).format("MMM DD, YYYY")}</td>
                        <td>
                          {duration} {duration === 1 ? "day" : "days"}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
}

function StatCard({ title, value, subtitle, icon, gradient }: StatCardProps) {
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

// Attendance Item Component
interface AttendanceItemProps {
  label: string;
  value: number;
  color: string;
}

function AttendanceItem({ label, value, color }: AttendanceItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <span className="text-sm text-base-content/70">{label}</span>
      </div>
      <span className="text-lg font-semibold text-base-content">{value}</span>
    </div>
  );
}
