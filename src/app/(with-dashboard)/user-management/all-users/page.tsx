"use client";

import CustomTable from "@/components/table/CustomTable";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import { DELETE_EMPLOYEE } from "@/graphql/employee.api";
import { GET_USERS, GET_USER_STATISTICS } from "@/graphql/user.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, IEmployee, IMeta } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { useRouter } from "next/navigation";
import FormModal from "@/components/form/FormModal";
import PageHeader from "@/components/ui/PageHeader";
import PersonnelInsights from "@/components/ui/PersonnelInsights";
import UserProfileCell from "@/components/ui/UserProfileCell";
import StatusBadge from "@/components/ui/StatusBadge";

// ==================== ALL USERS PAGE COMPONENT ====================
export default function AllUsersPage() {
  // ==================== HOOKS INITIALIZATION ====================
  const router = useRouter();
  const { permissionGuard } = usePermissionGuard();
  const { popupOption, setPopupOption } = usePopupOption();

  // ==================== GRAPHQL QUERY: FETCH ALL USERS ====================
  const { data, loading } = useQuery<{
    users: {
      message: string;
      statusCode: number;
      success: boolean;
      data: IEmployee[];
      meta: IMeta;
    };
  }>(GET_USERS, {
    variables: {
      query: {},
    },
  });

  // ==================== GRAPHQL QUERY: FETCH USER STATISTICS ====================
  const { data: statsData, loading: statsLoading } = useQuery<{
    userStatistics: {
      success: boolean;
      statusCode: number;
      message: string;
      data: {
        totalUsers: number;
        totalEmployees: number;
        totalManagers: number;
        totalAdmins: number;
        activeUsers: number;
        inactiveUsers: number;
      };
    };
  }>(GET_USER_STATISTICS);

  // ==================== GRAPHQL MUTATION: DELETE USER ====================
  const [deleteEmployee, deleteResult] = useMutation(DELETE_EMPLOYEE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_USERS, variables: { query: {} } }],
  });

  // ==================== HANDLER: EDIT USER ====================
  const handleEdit = (row: IEmployee) => {
    router.push(`/user-management/employees/${row.id}/update`);
  };

  // ==================== HANDLER: DELETE USER ====================
  const handleDelete = async (row: IEmployee) => {
    try {
      const result = await deleteEmployee({
        variables: {
          id: Number(row?.id),
        },
      });
      console.log("Delete result:", result);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // ==================== HANDLER: VIEW USER ====================
  const handleView = (row: IEmployee) => {
    router.push(`/user-management/employees/${row.id}/view`);
  };

  // ==================== HANDLER: CREATE NEW USER ====================
  const createNewUser = () => {
    router.push("/user-management/employees/create");
  };

  // ==================== TABLE COLUMNS CONFIGURATION ====================
  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "User",
      accessorKey: "customUserProfile",
      show: true,
    },
    {
      key: "2",
      header: "Employee ID",
      accessorKey: "customEmployeeId",
      show: true,
    },
    {
      key: "3",
      header: "Department",
      accessorKey: "customDepartment",
      show: true,
    },
    {
      key: "4",
      header: "Employment Status",
      accessorKey: "customEmploymentStatus",
      show: true,
    },
    {
      key: "5",
      header: "Role",
      accessorKey: "customRoleName",
      show: true,
    },
    {
      key: "6",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
    },
  ]);

  // ==================== TABLE ACTIONS CONFIGURATION ====================
  const actions: TableActionType[] = [
    // VIEW ACTION
    {
      name: "view",
      type: "button",
      permissions: [Permissions.UserRead],
      handler: handleView,
      disabledOn: [],
    },
    // EDIT ACTION
    {
      name: "edit",
      type: "button",
      permissions: [Permissions.UserUpdate],
      handler: handleEdit,
      disabledOn: [],
    },
    // DELETE ACTION
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.UserDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "employee",
          deleteHandler: () => handleDelete(row),
          title: "Delete User",
        });
      },
      disabledOn: [],
    },
  ];

  // ==================== COMPONENT RENDER ====================
  return (
    <section>
      {/* DELETE CONFIRMATION MODAL */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* PAGE HEADER WITH TITLE AND SUBTITLE */}
      <PageHeader
        title="All Personnel"
        subtitle="View and manage all users including employees, managers, and admins in one place"
      />

      {/* PERSONNEL INSIGHTS SECTION */}
      <PersonnelInsights
        data={statsData?.userStatistics?.data}
        loading={statsLoading}
      />

      {/* ALL USERS DATA TABLE */}
      <CustomTable
        isLoading={loading || deleteResult.loading}
        actions={actions}
        columns={columns}
        setColumns={setColumns}
        searchConfig={{
          // SEARCH CONFIGURATION
          searchable: loading ? true : false,
          debounceDelay: 500,
          defaultField: "profile.fullName",
          searchableFields: [
            { label: "Name", value: "profile.fullName" },
            { label: "Email", value: "email" },
            { label: "Phone", value: "profile.phone" },
          ],
        }}
        dataSource={
          // MAP USER DATA TO TABLE FORMAT
          data?.users?.data?.map((row) => ({
            ...row,
            // CUSTOM USER PROFILE COLUMN WITH AVATAR AND DESIGNATION
            customUserProfile: (
              <UserProfileCell
                name={row?.profile?.fullName || "N/A"}
                designation={row?.employee?.designation?.name || undefined}
                imageUrl={row?.profile?.profilePicture || undefined}
              />
            ),
            // CUSTOM EMPLOYEE ID COLUMN WITH ENHANCED DESIGN
            customEmployeeId: row?.employee?.employeeId ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg">
                  <svg
                    className="w-3.5 h-3.5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-indigo-700 font-mono">
                    {row.employee.employeeId}
                  </span>
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">N/A</span>
            ),
            // CUSTOM DEPARTMENT COLUMN
            customDepartment: row?.employee?.department?.name ? (
              <span className="text-sm text-gray-700">
                {row.employee.department.name}
              </span>
            ) : (
              <span className="text-sm text-gray-400">N/A</span>
            ),
            // CUSTOM EMPLOYMENT STATUS COLUMN WITH BADGE
            customEmploymentStatus: row?.employee?.employmentStatus?.name ? (
              <span
                className={`badge badge-sm ${
                  row.employee.employmentStatus.name
                    .toLowerCase()
                    .includes("full")
                    ? "badge-success"
                    : row.employee.employmentStatus.name
                        .toLowerCase()
                        .includes("part")
                    ? "badge-warning"
                    : row.employee.employmentStatus.name
                        .toLowerCase()
                        .includes("contract")
                    ? "badge-info"
                    : "badge-secondary"
                }`}
              >
                {row.employee.employmentStatus.name}
              </span>
            ) : (
              <span className="text-sm text-gray-400">N/A</span>
            ),
            // CUSTOM ROLE NAME COLUMN WITH DYNAMIC BADGE
            customRoleName: row?.role?.name ? (
              <span
                className={`badge badge-sm ${
                  row.role.name.toLowerCase().includes("admin")
                    ? "badge-error"
                    : row.role.name.toLowerCase().includes("manager")
                    ? "badge-warning"
                    : "badge-primary"
                }`}
              >
                {row.role.name.split("#")[0]}
              </span>
            ) : (
              "N/A"
            ),
            // CUSTOM STATUS COLUMN WITH STATUS BADGE
            customStatus: <StatusBadge status={row?.status || "Unknown"} />,
          })) || []
        }
      >
        {/* ADD NEW USER BUTTON (PERMISSION GUARDED) */}
        {permissionGuard(PermissionResource.USER, [
          PermissionAction.CREATE,
        ]) && (
          <button
            type="button"
            className="btn btn-primary text-base-300"
            onClick={createNewUser}
          >
            <PiPlusCircle className="text-xl" />
            Add New User
          </button>
        )}
      </CustomTable>
    </section>
  );
}
