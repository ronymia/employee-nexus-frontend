import { IEmployeeDashboardResponse } from "@/types/dashboard.type";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const MOCK_EMPLOYEE_DASHBOARD_DATA: IEmployeeDashboardResponse = {
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
          readAt: null,
        },
        {
          type: "task",
          message: "New task assigned: Update API documentation",
          timestamp: dayjs().subtract(3, "hour").toISOString(),
          readAt: null,
        },
        {
          type: "payroll",
          message: "December payroll is being processed",
          timestamp: dayjs().subtract(5, "hour").toISOString(),
          readAt: new Date(),
        },
        {
          type: "attendance",
          message: "You were marked as late today",
          timestamp: dayjs().subtract(1, "day").toISOString(),
          readAt: null,
        },
        {
          type: "task",
          message: "Task overdue: Database optimization",
          timestamp: dayjs().subtract(1, "day").toISOString(),
          readAt: null,
        },
      ],
    },
  },
};
