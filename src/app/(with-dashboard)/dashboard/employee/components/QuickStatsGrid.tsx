import Link from "next/link";
import {
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";
import {
  IAttendanceSummary,
  ITaskOverview,
  ILeaveSummary,
  IPayrollSummaryEmployee,
} from "@/types/dashboard.type";

interface IQuickStatsGridProps {
  attendanceSummary: IAttendanceSummary;
  taskOverview: ITaskOverview;
  leaveSummary: ILeaveSummary;
  payrollSummary: IPayrollSummaryEmployee;
}

export default function QuickStatsGrid({
  attendanceSummary,
  taskOverview,
  leaveSummary,
  payrollSummary,
}: IQuickStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link
        href="/my-activities/attendance-request"
        className="block transition-transform hover:scale-[1.02]"
      >
        <QuickStatCard
          title="Attendance Rate"
          value={`${attendanceSummary.thisMonth.attendanceRate}%`}
          subtitle="This Month"
          icon={<HiOutlineCheckCircle className="text-2xl" />}
          gradient="from-green-500 to-emerald-400"
        />
      </Link>
      <Link href="#" className="block transition-transform hover:scale-[1.02]">
        <QuickStatCard
          title="Tasks in Progress"
          value={taskOverview.inProgress}
          subtitle={`${taskOverview.assigned} Total Assigned`}
          icon={<HiOutlineClipboardList className="text-2xl" />}
          gradient="from-blue-500 to-cyan-400"
        />
      </Link>
      <Link
        href="/my-activities/leave-request"
        className="block transition-transform hover:scale-[1.02]"
      >
        <QuickStatCard
          title="Leave Balance"
          value={
            leaveSummary.availableLeaves?.reduce(
              (acc, leave) => acc + leave.remaining,
              0,
            ) || 0
          }
          subtitle={`Annual Leave`}
          icon={<HiOutlineCalendar className="text-2xl" />}
          gradient="from-purple-500 to-pink-400"
        />
      </Link>
      <Link
        href="/payroll-management/payslips"
        className="block transition-transform hover:scale-[1.02]"
      >
        <QuickStatCard
          title="Net Salary"
          value={`$${(payrollSummary.currentMonth.netPay / 1000).toFixed(1)}K`}
          subtitle={payrollSummary.currentMonth.status}
          icon={<HiOutlineCurrencyDollar className="text-2xl" />}
          gradient="from-orange-500 to-yellow-400"
        />
      </Link>
    </div>
  );
}

// Internal Quick Stat Card Component
interface IQuickStatCardProps {
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
}: IQuickStatCardProps) {
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
