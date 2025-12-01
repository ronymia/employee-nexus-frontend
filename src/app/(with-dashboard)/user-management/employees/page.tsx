"use client";

import CustomTable from "@/components/table/CustomTable";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import { DELETE_EMPLOYEE, GET_EMPLOYEES } from "@/graphql/employee.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, IEmployee } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { useRouter } from "next/navigation";
import FormModal from "@/components/form/FormModal";

export default function EmployeesPage() {
  const router = useRouter();
  const { permissionGuard } = usePermissionGuard();
  const { popupOption, setPopupOption } = usePopupOption();

  const { data, loading } = useQuery<{
    employees: {
      message: string;
      statusCode: number;
      success: boolean;
      data: IEmployee[];
      meta: any;
    };
  }>(GET_EMPLOYEES, {
    variables: {
      query: {},
    },
  });

  const [deleteEmployee, deleteResult] = useMutation(DELETE_EMPLOYEE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });

  const handleEdit = (row: IEmployee) => {
    router.push(`/user-management/employees/${row.id}/update`);
  };

  const handleDelete = async (row: IEmployee) => {
    try {
      const result = await deleteEmployee({
        variables: {
          id: Number(row?.id),
        },
      });
      console.log("Delete result:", result);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleView = (row: IEmployee) => {
    router.push(`/user-management/employees/${row.id}/view`);
  };

  const createNewEmployee = () => {
    router.push("/user-management/employees/create");
  };

  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Full Name",
      accessorKey: "customFullName",
      show: true,
    },
    {
      key: "2",
      header: "Email",
      accessorKey: "email",
      show: true,
    },
    {
      key: "3",
      header: "Phone",
      accessorKey: "customPhone",
      show: true,
    },
    {
      key: "4",
      header: "Role",
      accessorKey: "customRoleName",
      show: true,
    },
    {
      key: "5",
      header: "Status",
      accessorKey: "status",
      show: true,
    },
  ]);

  const actions: TableActionType[] = [
    {
      name: "view",
      type: "button",
      permissions: [Permissions.UserRead],
      handler: handleView,
      disabledOn: [],
    },
    {
      name: "edit",
      type: "button",
      permissions: [Permissions.UserUpdate],
      handler: handleEdit,
      disabledOn: [],
    },
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
          title: "Delete Employee",
        });
      },
      disabledOn: [],
    },
  ];
  return (
    <section>
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">All Employees</h1>
        </div>
      </header>

      <CustomTable
        isLoading={loading || deleteResult.loading}
        actions={actions}
        columns={columns}
        setColumns={setColumns}
        searchConfig={{
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
          data?.employees?.data?.map((row) => ({
            ...row,
            customFullName: row?.profile?.fullName || "N/A",
            customRoleName: row?.role?.name || "N/A",
            customPhone: row?.profile?.phone || "N/A",
          })) || []
        }
      >
        {permissionGuard(PermissionResource.USER, [
          PermissionAction.CREATE,
        ]) && (
          <button
            type="button"
            className="btn btn-primary text-base-300"
            onClick={createNewEmployee}
          >
            <PiPlusCircle className="text-xl" />
            Add New
          </button>
        )}
      </CustomTable>
    </section>
  );
}
