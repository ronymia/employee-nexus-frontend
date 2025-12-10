export interface IBusinessOverview {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  totalProjects: number;
  activeProjects: number;
  totalMonthlyPayroll: number;
  pendingPayrollAmount: number;
}

export interface IOwnerAttendanceToday {
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  notPunchedIn: number;
}

export interface IAttendanceWeek {
  averageAttendanceRate: number;
  totalWorkingDays: number;
  totalPresentDays: number;
}

export interface IOwnerAttendanceMonth {
  attendanceRate: number;
  lateArrivals: number;
  earlyDepartures: number;
}

export interface IAttendanceTrend {
  date: string;
  presentCount: number;
}

export interface IAttendanceAnalytics {
  today: IOwnerAttendanceToday;
  thisWeek: IAttendanceWeek;
  thisMonth: IOwnerAttendanceMonth;
  trend: IAttendanceTrend[];
}

export interface ILeaveTypeCount {
  leaveType: string;
  count: number;
  [key: string]: any;
}

export interface IUpcomingLeave {
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
}

export interface ILeaveStats {
  pending: number;
  approved: number;
  rejected: number;
  thisMonth: {
    total: number;
    byType: ILeaveTypeCount[];
  };
  upcomingLeaves: IUpcomingLeave[];
}

export interface IPayrollCycle {
  name: string;
  status: string;
  periodStart: string;
  periodEnd: string;
  paymentDate: string;
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
}

export interface IPayrollYearToDate {
  totalPaid: number;
  averageMonthlyPayroll: number;
  highestMonth: {
    month: string;
    amount: number;
  };
  lowestMonth: {
    month: string;
    amount: number;
  };
}

export interface IPayrollPendingActions {
  draftCycles: number;
  pendingApprovals: number;
  pendingPayments: number;
}

export interface IPayrollSummary {
  currentCycle: IPayrollCycle;
  yearToDate: IPayrollYearToDate;
  pendingActions: IPayrollPendingActions;
}

export interface IRecentProject {
  name: string;
  status: string;
  memberCount: number;
  startDate: string;
  endDate: string;
}

export interface IProjectOverview {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  recentProjects: IRecentProject[];
}

export interface IRecentActivity {
  type: string;
  message: string;
  timestamp: string;
}

export interface IRecentActivities {
  unreadNotifications: number;
  recentActivities: IRecentActivity[];
}

export interface IOwnerDashboardData {
  businessOverview: IBusinessOverview;
  attendanceAnalytics: IAttendanceAnalytics;
  leaveStats: ILeaveStats;
  payrollSummary: IPayrollSummary;
  projectOverview: IProjectOverview;
  recentActivities: IRecentActivities;
}

export interface IOwnerDashboardResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IOwnerDashboardData;
}

// Employee Dashboard Types
export interface IPersonalInfo {
  fullName: string;
  employeeId: string;
  department: string;
  designation: string;
  joiningDate: string;
  email: string;
  phone: string;
}

export interface IEmployeeAttendanceToday {
  status: string;
  checkInTime: string;
  checkOutTime: string;
  workingHours: string;
}

export interface IEmployeeAttendanceMonth {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  attendanceRate: number;
}

export interface IRecentAttendance {
  date: string;
  status: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface IAttendanceSummary {
  today: IEmployeeAttendanceToday;
  thisMonth: IEmployeeAttendanceMonth;
  recentAttendance: IRecentAttendance[];
}

export interface IAvailableLeave {
  leaveType: string;
  total: number;
  used: number;
  remaining: number;
}

export interface IUpcomingLeaveEmployee {
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface ILeaveHistory {
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
}

export interface ILeaveSummary {
  availableLeaves: IAvailableLeave[];
  upcomingLeaves: IUpcomingLeaveEmployee[];
  leaveHistory: ILeaveHistory[];
}

export interface ICurrentMonthPayroll {
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: string;
}

export interface ILastPayment {
  month: string;
  grossPay: number;
  netPay: number;
  paidDate: string;
}

export interface IPayrollYearToDateEmployee {
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
}

export interface IPayrollSummaryEmployee {
  currentMonth: ICurrentMonthPayroll;
  lastPayment: ILastPayment;
  yearToDate: IPayrollYearToDateEmployee;
}

export interface IRecentTask {
  title: string;
  project: string;
  status: string;
  dueDate: string;
  priority: string;
}

export interface ITaskOverview {
  assigned: number;
  inProgress: number;
  completed: number;
  overdue: number;
  recentTasks: IRecentTask[];
}

export interface INotificationItem {
  type: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface INotifications {
  unread: number;
  recent: INotificationItem[];
}

export interface IEmployeeDashboardData {
  personalInfo: IPersonalInfo;
  attendanceSummary: IAttendanceSummary;
  leaveSummary: ILeaveSummary;
  payrollSummary: IPayrollSummaryEmployee;
  taskOverview: ITaskOverview;
  notifications: INotifications;
}

export interface IEmployeeDashboardResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IEmployeeDashboardData;
}
