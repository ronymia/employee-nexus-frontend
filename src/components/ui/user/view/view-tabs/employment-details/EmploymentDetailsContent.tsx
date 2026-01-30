"use client";

// ==================== IMPORTS ====================
import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { motion } from "motion/react";
import dayjs from "dayjs";
import {
  FiBriefcase,
  FiDollarSign,
  FiUsers,
  FiAward,
  FiClock,
  FiMapPin,
  FiCheck,
} from "react-icons/fi";

// ==================== GRAPHQL IMPORTS ====================
import { GET_EMPLOYMENT_DETAILS } from "@/graphql/employee.api";
import {
  GET_EMPLOYEE_SALARY,
  GET_ACTIVE_EMPLOYEE_SALARY,
} from "@/graphql/employee-salary.api";
import {
  GET_EMPLOYEE_DEPARTMENT,
  GET_ACTIVE_EMPLOYEE_DEPARTMENT,
} from "@/graphql/employee-department.api";
import {
  GET_EMPLOYEE_DESIGNATION,
  GET_ACTIVE_EMPLOYEE_DESIGNATION,
} from "@/graphql/employee-designation.api";
import {
  GET_EMPLOYEE_EMPLOYMENT_STATUS,
  GET_ACTIVE_EMPLOYEE_EMPLOYMENT_STATUS,
} from "@/graphql/employee-employment-status.api";
import {
  GET_EMPLOYEE_WORK_SCHEDULE,
  GET_ACTIVE_EMPLOYEE_WORK_SCHEDULE,
} from "@/graphql/employee-work-schedule.api";
import {
  GET_EMPLOYEE_WORK_SITES,
  GET_ACTIVE_EMPLOYEE_WORK_SITES,
} from "@/graphql/employee-work-site.api";

// ==================== COMPONENTS ====================
import EditDepartmentForm from "./components/EditDepartmentForm";
import TransferDepartmentForm from "./components/TransferDepartmentForm";
import AddSecondaryDepartmentForm from "./components/AddSecondaryDepartmentForm";
import AddSalaryForm from "./components/AddSalaryForm";
import ChangeDesignationForm from "./components/ChangeDesignationForm";
import ChangeEmploymentStatusForm from "./components/ChangeEmploymentStatusForm";
import AssignWorkScheduleForm from "./components/AssignWorkScheduleForm";
import AssignWorkSiteForm from "./components/AssignWorkSiteForm";

// ==================== INTERFACES ====================
import {
  IEmployeeDepartment,
  IEmployeeDesignation,
  IEmployeeEmploymentStatus,
  IEmployeeSalary,
  IEmployeeWorkSchedule,
  IEmployeeWorkSite,
} from "@/types";

// ==================== INTERFACES ====================
interface IEmploymentDetailsContentProps {
  userId: number;
}

interface ITabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// ==================== COMPONENT ====================
export default function EmploymentDetailsContent({
  userId,
}: IEmploymentDetailsContentProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // ==================== TABS ====================
  const tabs: ITabItem[] = [
    { id: "overview", label: "Overview", icon: <FiBriefcase /> },
    { id: "salary", label: "Salary History", icon: <FiDollarSign /> },
    { id: "department", label: "Department History", icon: <FiUsers /> },
    { id: "designation", label: "Designation History", icon: <FiAward /> },
    { id: "status", label: "Status History", icon: <FiCheck /> },
    { id: "schedule", label: "Schedule History", icon: <FiClock /> },
    { id: "worksite", label: "Work Site History", icon: <FiMapPin /> },
  ];

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* TABS */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 border-b border-gray-200 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "overview" && (
          <OverviewTab userId={userId} setActiveTab={setActiveTab} />
        )}
        {activeTab === "salary" && <SalaryHistoryTab userId={userId} />}
        {activeTab === "department" && <DepartmentHistoryTab userId={userId} />}
        {activeTab === "designation" && (
          <DesignationHistoryTab userId={userId} />
        )}
        {activeTab === "status" && <StatusHistoryTab userId={userId} />}
        {activeTab === "schedule" && <ScheduleHistoryTab userId={userId} />}
        {activeTab === "worksite" && <WorkSiteHistoryTab userId={userId} />}
      </motion.div>
    </div>
  );
}

// ==================== OVERVIEW TAB ====================
function OverviewTab({
  userId,
  setActiveTab,
}: {
  userId: number;
  setActiveTab: (tab: string) => void;
}) {
  // ==================== STATE ====================
  const [editDeptModal, setEditDeptModal] =
    useState<IEmployeeDepartment | null>(null);
  const [transferDeptModal, setTransferDeptModal] =
    useState<IEmployeeDepartment | null>(null);
  const [showAddSecondaryModal, setShowAddSecondaryModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showDesignationModal, setShowDesignationModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showWorkSiteModal, setShowWorkSiteModal] = useState(false);

  // Fetch employment details (includes current salary, department, designation, etc.)
  const { data: employmentData, loading: employmentLoading } = useQuery<{
    getEmploymentDetails: { data: { [key: string]: any } };
  }>(GET_EMPLOYMENT_DETAILS, { variables: { id: userId } });

  console.log({ employmentData });
  // Fetch active items only
  const {
    data: activeSalaryData,
    loading: activeSalaryLoading,
    refetch: refetchSalary,
  } = useQuery<{
    activeSalaryByUserId: { data: IEmployeeSalary };
  }>(GET_ACTIVE_EMPLOYEE_SALARY, { variables: { userId } });

  const {
    data: activeDepartmentData,
    loading: activeDepartmentLoading,
    refetch: refetchDepartments,
  } = useQuery<{
    getActiveDepartment: { data: IEmployeeDepartment };
  }>(GET_ACTIVE_EMPLOYEE_DEPARTMENT, { variables: { userId } });

  const {
    data: activeDesignationData,
    loading: activeDesignationLoading,
    refetch: refetchDesignation,
  } = useQuery<{
    getActiveDesignation: { data: IEmployeeDesignation };
  }>(GET_ACTIVE_EMPLOYEE_DESIGNATION, { variables: { userId } });

  const {
    data: activeStatusData,
    loading: activeStatusLoading,
    refetch: refetchStatus,
  } = useQuery<{
    getActiveEmploymentStatus: { data: IEmployeeEmploymentStatus };
  }>(GET_ACTIVE_EMPLOYEE_EMPLOYMENT_STATUS, { variables: { userId } });

  const {
    data: activeScheduleData,
    loading: activeScheduleLoading,
    refetch: refetchSchedule,
  } = useQuery<{
    getActiveWorkSchedule: { data: IEmployeeWorkSchedule };
  }>(GET_ACTIVE_EMPLOYEE_WORK_SCHEDULE, { variables: { userId } });

  const {
    data: activeWorkSitesData,
    loading: activeWorkSitesLoading,
    refetch: refetchWorkSites,
  } = useQuery<{
    getActiveWorkSites: { data: IEmployeeWorkSite[] };
  }>(GET_ACTIVE_EMPLOYEE_WORK_SITES, { variables: { userId } });

  const loading =
    employmentLoading ||
    activeSalaryLoading ||
    activeDepartmentLoading ||
    activeDesignationLoading ||
    activeStatusLoading ||
    activeScheduleLoading ||
    activeWorkSitesLoading;

  if (loading) {
    return <LoadingState />;
  }

  const employmentDetails = employmentData?.getEmploymentDetails?.data;
  const activeSalary = activeSalaryData?.activeSalaryByUserId?.data;
  const activeDepartment = activeDepartmentData?.getActiveDepartment?.data;
  const activeDesignation = activeDesignationData?.getActiveDesignation?.data;
  const activeStatus = activeStatusData?.getActiveEmploymentStatus?.data;
  const activeSchedule = activeScheduleData?.getActiveWorkSchedule?.data;
  const activeWorkSites = activeWorkSitesData?.getActiveWorkSites?.data || [];

  // ==================== HANDLERS ====================
  const handleDepartmentSuccess = () => {
    refetchDepartments();
  };

  const handleSalarySuccess = () => {
    refetchSalary();
  };

  const handleDesignationSuccess = () => {
    refetchDesignation();
  };

  const handleStatusSuccess = () => {
    refetchStatus();
  };

  const handleScheduleSuccess = () => {
    refetchSchedule();
  };

  const handleWorkSiteSuccess = () => {
    refetchWorkSites();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* BASIC INFO */}
      <InfoCard title="Basic Information" icon={<FiBriefcase />}>
        <InfoRow label="Employee ID" value={employmentDetails?.employeeId} />
        <InfoRow label="NID Number" value={employmentDetails?.nidNumber} />
        <InfoRow
          label="Joining Date"
          value={
            employmentDetails?.joiningDate
              ? dayjs(employmentDetails.joiningDate).format("DD MMM YYYY")
              : "-"
          }
        />
      </InfoCard>

      {/* CURRENT SALARY */}
      <InfoCard
        title="Current Salary"
        icon={<FiDollarSign />}
        badge={activeSalary && "Active"}
      >
        <InfoRow
          label="Amount"
          value={
            activeSalary
              ? `${activeSalary.salaryAmount.toLocaleString()} BDT`
              : employmentDetails?.salary?.salaryAmount
                ? `${employmentDetails.salary.salaryAmount.toLocaleString()} BDT`
                : "-"
          }
        />
        <InfoRow
          label="Type"
          value={
            activeSalary?.salaryType ||
            employmentDetails?.salary?.salaryType ||
            "-"
          }
        />
        <InfoRow
          label="Start Date"
          value={
            activeSalary?.startDate
              ? dayjs(activeSalary.startDate).format("DD MMM YYYY")
              : employmentDetails?.salary?.startDate
                ? dayjs(employmentDetails.salary.startDate).format(
                    "DD MMM YYYY",
                  )
                : "-"
          }
        />
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowSalaryModal(true)}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            Update Salary
          </button>
        </div>
      </InfoCard>

      {/* CURRENT DEPARTMENTS */}
      <div className="lg:col-span-2">
        <InfoCard
          title="Current Departments"
          icon={<FiUsers />}
          badge={
            activeDepartment
              ? Array.isArray(activeDepartment)
                ? `${activeDepartment.length} Active`
                : "1 Active"
              : undefined
          }
        >
          {(() => {
            // Handle both single object and array responses
            const departments = Array.isArray(activeDepartment)
              ? activeDepartment
              : activeDepartment
                ? [activeDepartment]
                : [];

            if (departments.length > 0) {
              return (
                <div className="space-y-3">
                  {departments.map((dept: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">
                            {dept?.department?.name ||
                              employmentDetails?.department?.name ||
                              "-"}
                          </p>
                          {dept?.isPrimary && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                        {dept?.roleInDept && (
                          <p className="text-sm text-gray-600">
                            Role: {dept.roleInDept}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Since:{" "}
                          {dept?.startDate
                            ? dayjs(dept.startDate).format("DD MMM YYYY")
                            : "-"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          onClick={() => setEditDeptModal(dept)}
                        >
                          Edit
                        </button>
                        {dept?.isPrimary && (
                          <button
                            className="px-3 py-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors"
                            onClick={() => setTransferDeptModal(dept)}
                          >
                            Transfer
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    className="w-full px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md border border-green-200 transition-colors"
                    onClick={() => setShowAddSecondaryModal(true)}
                  >
                    + Add Secondary Department
                  </button>
                </div>
              );
            }

            // Fallback to employmentDetails if no active department
            if (employmentDetails?.department?.name) {
              return (
                <InfoRow
                  label="Department"
                  value={employmentDetails.department.name}
                />
              );
            }

            return <p className="text-gray-500">No active departments</p>;
          })()}
        </InfoCard>
      </div>

      {/* CURRENT DESIGNATION */}
      <InfoCard
        title="Current Designation"
        icon={<FiAward />}
        badge={activeDesignation && "Active"}
      >
        <InfoRow
          label="Designation"
          value={
            activeDesignation?.designation?.name ||
            employmentDetails?.designation?.name ||
            "-"
          }
        />
        <InfoRow
          label="Since"
          value={
            activeDesignation?.startDate
              ? dayjs(activeDesignation.startDate).format("DD MMM YYYY")
              : "-"
          }
        />
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowDesignationModal(true)}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors"
          >
            Change Designation
          </button>
        </div>
      </InfoCard>

      {/* EMPLOYMENT STATUS */}
      <InfoCard
        title="Employment Status"
        icon={<FiCheck />}
        badge={activeStatus && "Active"}
      >
        <InfoRow
          label="Status"
          value={
            activeStatus?.employmentStatus?.status ||
            employmentDetails?.employmentStatus?.name ||
            "-"
          }
        />
        <InfoRow
          label="Since"
          value={
            activeStatus?.startDate
              ? dayjs(activeStatus.startDate).format("DD MMM YYYY")
              : "-"
          }
        />
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowStatusModal(true)}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Change Status
          </button>
        </div>
      </InfoCard>

      {/* WORK SCHEDULE */}
      <InfoCard
        title="Work Schedule"
        icon={<FiClock />}
        badge={activeSchedule && "Active"}
      >
        <InfoRow
          label="Schedule"
          value={
            activeSchedule?.workSchedule?.name ||
            employmentDetails?.workSchedule?.name ||
            "-"
          }
        />
        <InfoRow
          label="Type"
          value={activeSchedule?.workSchedule?.scheduleType || "-"}
        />
        <InfoRow
          label="Break"
          value={
            activeSchedule?.workSchedule?.breakMinutes
              ? `${activeSchedule.workSchedule.breakMinutes} min`
              : "-"
          }
        />
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveTab("schedule")}
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
          >
            Assign Schedule
          </button>
        </div>
      </InfoCard>

      {/* ACTIVE WORK SITES */}
      <div className="lg:col-span-2">
        <InfoCard
          title="Active Work Sites"
          icon={<FiMapPin />}
          badge={
            (activeWorkSites?.length > 0 && `${activeWorkSites.length}`) ||
            (employmentDetails?.workSites?.length > 0 &&
              `${employmentDetails?.workSites.length}`)
          }
        >
          {activeWorkSites?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeWorkSites.map((site: any, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="font-semibold text-gray-900">
                    {site.workSite?.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {site.workSite?.address || "No address"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Since:{" "}
                    {site.startDate
                      ? dayjs(site.startDate).format("DD MMM YYYY")
                      : "-"}
                  </p>
                </div>
              ))}
            </div>
          ) : employmentDetails?.workSites?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employmentDetails?.workSites.map((site: any, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="font-semibold text-gray-900">{site.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No active work sites</p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowWorkSiteModal(true)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
            >
              + Assign Work Site
            </button>
          </div>
        </InfoCard>
      </div>

      {/* MODALS */}
      {editDeptModal && (
        <EditDepartmentForm
          department={editDeptModal}
          userId={userId}
          onClose={() => setEditDeptModal(null)}
          onSuccess={handleDepartmentSuccess}
        />
      )}

      {transferDeptModal && (
        <TransferDepartmentForm
          currentDepartment={transferDeptModal}
          userId={userId}
          onClose={() => setTransferDeptModal(null)}
          onSuccess={handleDepartmentSuccess}
        />
      )}

      {showAddSecondaryModal && (
        <AddSecondaryDepartmentForm
          userId={userId}
          currentDepartmentIds={
            Array.isArray(activeDepartment)
              ? activeDepartment.map((d: any) => d.departmentId)
              : activeDepartment
                ? [activeDepartment.departmentId]
                : []
          }
          onClose={() => setShowAddSecondaryModal(false)}
          onSuccess={handleDepartmentSuccess}
        />
      )}

      {/* SALARY MODAL */}
      {showSalaryModal && (
        <AddSalaryForm
          currentSalary={activeSalary}
          userId={userId}
          onClose={() => setShowSalaryModal(false)}
          onSuccess={handleSalarySuccess}
        />
      )}

      {/* DESIGNATION MODAL */}
      {showDesignationModal && (
        <ChangeDesignationForm
          currentDesignation={activeDesignation}
          userId={userId}
          onClose={() => setShowDesignationModal(false)}
          onSuccess={handleDesignationSuccess}
        />
      )}

      {/* STATUS MODAL */}
      {showStatusModal && (
        <ChangeEmploymentStatusForm
          currentStatus={activeStatus}
          userId={userId}
          onClose={() => setShowStatusModal(false)}
          onSuccess={handleStatusSuccess}
        />
      )}

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <AssignWorkScheduleForm
          currentSchedule={activeSchedule}
          userId={userId}
          assignedBy={userId} // TODO: Use actual logged-in user ID
          onClose={() => setShowScheduleModal(false)}
          onSuccess={handleScheduleSuccess}
        />
      )}

      {/* WORK SITE MODAL */}
      {showWorkSiteModal && (
        <AssignWorkSiteForm
          userId={userId}
          currentWorkSiteIds={
            activeWorkSites?.map((site: any) => site.workSiteId) || []
          }
          onClose={() => setShowWorkSiteModal(false)}
          onSuccess={handleWorkSiteSuccess}
        />
      )}
    </div>
  );
}

// ==================== HISTORY TABS ====================
function SalaryHistoryTab({ userId }: { userId: number }) {
  const { data, loading } = useQuery<{
    salaryHistory: {
      data: IEmployeeSalary[];
    };
  }>(GET_EMPLOYEE_SALARY, {
    variables: { userId },
  });

  if (loading) return <LoadingState />;

  const salaryHistory = data?.salaryHistory?.data || [];

  return (
    <HistoryTable
      data={salaryHistory}
      columns={[
        {
          key: "salaryAmount",
          label: "Amount",
          format: (v: number) => `${v.toLocaleString()} BDT`,
        },
        { key: "salaryType", label: "Type" },
        {
          key: "startDate",
          label: "Start Date",
          format: (v: string) => dayjs(v).format("DD MMM YYYY"),
        },
        {
          key: "endDate",
          label: "End Date",
          format: (v: string) =>
            v ? dayjs(v).format("DD MMM YYYY") : "Current",
        },
        { key: "reason", label: "Reason" },
      ]}
    />
  );
}

function DepartmentHistoryTab({ userId }: { userId: number }) {
  const { data, loading } = useQuery<{
    departmentHistory: {
      data: IEmployeeDepartment[];
    };
  }>(GET_EMPLOYEE_DEPARTMENT, {
    variables: { userId },
  });

  if (loading) return <LoadingState />;

  const departmentHistory = data?.departmentHistory?.data || [];

  return (
    <HistoryTable
      data={departmentHistory}
      columns={[
        { key: "department.name", label: "Department" },
        { key: "roleInDept", label: "Role" },
        {
          key: "isPrimary",
          label: "Primary",
          format: (v: boolean) => (v ? "Yes" : "No"),
        },
        {
          key: "startDate",
          label: "Start Date",
          format: (v: string) => dayjs(v).format("DD MMM YYYY"),
        },
        {
          key: "endDate",
          label: "End Date",
          format: (v: string) =>
            v ? dayjs(v).format("DD MMM YYYY") : "Current",
        },
      ]}
    />
  );
}

function DesignationHistoryTab({ userId }: { userId: number }) {
  const { data, loading } = useQuery<{
    designationHistory: {
      data: IEmployeeDesignation[];
    };
  }>(GET_EMPLOYEE_DESIGNATION, {
    variables: { userId },
  });

  if (loading) return <LoadingState />;

  const designationHistory = data?.designationHistory?.data || [];

  return (
    <HistoryTable
      data={designationHistory}
      columns={[
        { key: "designation.name", label: "Designation" },
        {
          key: "startDate",
          label: "Start Date",
          format: (v: string) => dayjs(v).format("DD MMM YYYY"),
        },
        {
          key: "endDate",
          label: "End Date",
          format: (v: string) =>
            v ? dayjs(v).format("DD MMM YYYY") : "Current",
        },
        { key: "remarks", label: "Remarks" },
      ]}
    />
  );
}

function StatusHistoryTab({ userId }: { userId: number }) {
  const { data, loading } = useQuery<{
    employmentStatusHistory: {
      data: IEmployeeEmploymentStatus[];
    };
  }>(GET_EMPLOYEE_EMPLOYMENT_STATUS, {
    variables: { userId },
  });

  if (loading) return <LoadingState />;

  const statusHistory = data?.employmentStatusHistory?.data || [];

  return (
    <HistoryTable
      data={statusHistory}
      columns={[
        { key: "employmentStatus.name", label: "Status" },
        {
          key: "startDate",
          label: "Start Date",
          format: (v: string) => dayjs(v).format("DD MMM YYYY"),
        },
        {
          key: "endDate",
          label: "End Date",
          format: (v: string) =>
            v ? dayjs(v).format("DD MMM YYYY") : "Current",
        },
        { key: "reason", label: "Reason" },
      ]}
    />
  );
}

function ScheduleHistoryTab({ userId }: { userId: number }) {
  const { data, loading } = useQuery<{
    workScheduleHistory: {
      data: IEmployeeWorkSchedule[];
    };
  }>(GET_EMPLOYEE_WORK_SCHEDULE, {
    variables: { userId },
  });

  if (loading) return <LoadingState />;

  const scheduleHistory = data?.workScheduleHistory?.data || [];

  return (
    <HistoryTable
      data={scheduleHistory}
      columns={[
        { key: "workSchedule.name", label: "Schedule Name" },
        { key: "workSchedule.scheduleType", label: "Type" },
        {
          key: "startDate",
          label: "Start Date",
          format: (v: string) => dayjs(v).format("DD MMM YYYY"),
        },
        {
          key: "endDate",
          label: "End Date",
          format: (v: string) =>
            v ? dayjs(v).format("DD MMM YYYY") : "Current",
        },
        { key: "assignedByUser.profile.fullName", label: "Assigned By" },
      ]}
    />
  );
}

function WorkSiteHistoryTab({ userId }: { userId: number }) {
  const { data, loading } = useQuery<{
    workSiteHistory: {
      data: IEmployeeWorkSite[];
    };
  }>(GET_EMPLOYEE_WORK_SITES, {
    variables: { userId },
  });

  if (loading) return <LoadingState />;

  const workSitesHistory = data?.workSiteHistory?.data || [];

  return (
    <HistoryTable
      data={workSitesHistory}
      columns={[
        { key: "workSite.name", label: "Work Site" },
        { key: "workSite.address", label: "Address" },
        {
          key: "startDate",
          label: "Start Date",
          format: (v: string) => dayjs(v).format("DD MMM YYYY"),
        },
        {
          key: "endDate",
          label: "End Date",
          format: (v: string) =>
            v ? dayjs(v).format("DD MMM YYYY") : "Current",
        },
      ]}
    />
  );
}

// ==================== REUSABLE COMPONENTS ====================
function InfoCard({ title, icon, badge, children }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-primary">{icon}</div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        {badge && (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
    </div>
  );
}

function HistoryTable({ data, columns }: any) {
  const getValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No history records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col: any) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row: any, index: number) => (
            <tr key={index} className={row.isActive ? "bg-green-50" : ""}>
              {columns.map((col: any) => {
                const value = getValue(row, col.key);
                const displayValue = col.format ? col.format(value) : value;
                return (
                  <td key={col.key} className="px-4 py-3 text-sm text-gray-900">
                    {displayValue || "-"}
                  </td>
                );
              })}
              <td className="px-4 py-3 text-sm">
                {row.isActive ? (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    Inactive
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
