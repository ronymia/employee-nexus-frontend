"use client";

import { useQuery } from "@apollo/client/react";
import { EMPLOYEE_DASHBOARD } from "@/graphql";
import { IEmployeeDashboardResponse } from "@/types/dashboard.type";
import { MOCK_EMPLOYEE_DASHBOARD_DATA } from "./mock-data";

// Components
// import WelcomeBanner from "./components/WelcomeBanner";
import QuickStatsGrid from "./components/QuickStatsGrid";
// import TodaysAttendanceCard from "./components/TodaysAttendanceCard";
import TodaysAttendanceCardV2 from "./components/TodaysAttendanceCardV2";
import LeaveBalanceCard from "./components/LeaveBalanceCard";
import RecentAttendance from "./components/RecentAttendance";
import TaskOverview from "./components/TaskOverview";
import PayrollSummary from "./components/PayrollSummary";
import DashboardNotifications from "./components/DashboardNotifications";
import WelcomeBanner from "./components/WelcomeBanner";

export default function EmployeeDashboard() {
  const { data } = useQuery<{
    employeeDashboard: IEmployeeDashboardResponse;
  }>(EMPLOYEE_DASHBOARD, {
    // skip: true, // Skip query to use mock data
  });

  // Use mock data for development or fallback
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
      {/* 1. Welcome Banner */}
      {/* <WelcomeBanner personalInfo={personalInfo} /> */}

      {/* 2. Quick Stats Grid */}
      <QuickStatsGrid
        attendanceSummary={attendanceSummary}
        taskOverview={taskOverview}
        leaveSummary={leaveSummary}
        payrollSummary={payrollSummary}
      />

      {/* 3. Attendance & Leave (Equal Height Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-stretch">
        <div className="h-full">
          {/* <TodaysAttendanceCard attendance={attendanceSummary.today} /> */}
          <TodaysAttendanceCardV2 />
        </div>
        <div className="h-full">
          <LeaveBalanceCard leaveSummary={leaveSummary} />
        </div>
      </div>

      {/* 4. Recent Attendance History */}
      <RecentAttendance recentAttendance={attendanceSummary.recentAttendance} />

      {/* 5. Tasks & Payroll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskOverview taskOverview={taskOverview} />
        <PayrollSummary payrollSummary={payrollSummary} />
      </div>

      {/* 6. Notifications */}
      <DashboardNotifications notifications={notifications} />
    </div>
  );
}
