import { FiUsers } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiAdminLine } from "react-icons/ri";
import { MdManageAccounts, MdTrendingUp } from "react-icons/md";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

// ==================== INSIGHTS CARD COMPONENT ====================
interface InsightCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  trend?: string;
  subtitle?: string;
}

function InsightCard({
  title,
  value,
  icon: Icon,
  bgColor,
  iconColor,
  trend,
  subtitle,
}: InsightCardProps) {
  return (
    <div
      className={`${bgColor} rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300`}
    >
      {/* HEADER WITH ICON */}
      <div className="flex items-start justify-between mb-3">
        <div className={`${iconColor} p-3 rounded-lg bg-white/80`}>
          <Icon className="text-2xl" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
            <MdTrendingUp className="text-sm" />
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* VALUE */}
      <div className="mb-2">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800">
          {value}
        </h3>
      </div>

      {/* TITLE AND SUBTITLE */}
      <div>
        <p className="text-sm md:text-base font-semibold text-gray-700">
          {title}
        </p>
        {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// ==================== PERSONNEL INSIGHTS PROPS ====================
interface PersonnelInsightsProps {
  data?: {
    totalUsers: number;
    totalEmployees: number;
    totalManagers: number;
    totalAdmins: number;
    activeUsers: number;
    inactiveUsers: number;
  };
  loading?: boolean;
}

// ==================== PERSONNEL INSIGHTS COMPONENT ====================
export default function PersonnelInsights({
  data,
  loading = false,
}: PersonnelInsightsProps) {
  // USE REAL DATA OR FALLBACK TO 0
  const insights = {
    totalUsers: data?.totalUsers || 0,
    employees: data?.totalEmployees || 0,
    managers: data?.totalManagers || 0,
    admins: data?.totalAdmins || 0,
    activeUsers: data?.activeUsers || 0,
    inactiveUsers: data?.inactiveUsers || 0,
  };

  // CALCULATE GROWTH PERCENTAGE (you can add this to the API later)
  const growthPercentage = "+5.2%";

  if (loading) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl p-4 md:p-6 h-32 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* INSIGHTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* TOTAL USERS CARD */}
        <InsightCard
          title="Total Personnel"
          value={insights.totalUsers}
          icon={HiOutlineUserGroup}
          bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
          iconColor="text-blue-600"
          trend={growthPercentage}
          subtitle="All registered users"
        />

        {/* EMPLOYEES CARD */}
        <InsightCard
          title="Employees"
          value={insights.employees}
          icon={FiUsers}
          bgColor="bg-gradient-to-br from-primary/10 to-primary/20"
          iconColor="text-primary"
          subtitle="Regular staff members"
        />

        {/* MANAGERS CARD */}
        <InsightCard
          title="Managers"
          value={insights.managers}
          icon={MdManageAccounts}
          bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100"
          iconColor="text-yellow-600"
          subtitle="Team leaders"
        />

        {/* ADMINS CARD */}
        <InsightCard
          title="Administrators"
          value={insights.admins}
          icon={RiAdminLine}
          bgColor="bg-gradient-to-br from-red-50 to-red-100"
          iconColor="text-red-600"
          subtitle="System admins"
        />
      </div>

      {/* SECONDARY METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mt-4 md:mt-5">
        {/* ACTIVE USERS */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AiOutlineCheckCircle className="text-3xl text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {insights.activeUsers}
                </p>
                <p className="text-sm font-semibold text-gray-700">Active</p>
              </div>
            </div>
            {insights.totalUsers > 0 && (
              <div className="text-xs font-semibold text-green-700 bg-green-200/50 px-2 py-1 rounded">
                {((insights.activeUsers / insights.totalUsers) * 100).toFixed(
                  1
                )}
                %
              </div>
            )}
          </div>
        </div>

        {/* INACTIVE USERS */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AiOutlineCloseCircle className="text-3xl text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {insights.inactiveUsers}
                </p>
                <p className="text-sm font-semibold text-gray-700">Inactive</p>
              </div>
            </div>
            {insights.totalUsers > 0 && (
              <div className="text-xs font-semibold text-gray-700 bg-gray-200/50 px-2 py-1 rounded">
                {((insights.inactiveUsers / insights.totalUsers) * 100).toFixed(
                  1
                )}
                %
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
