"use client";

import { showToast } from "@/components/ui/CustomToast";
import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import { DELETE_DEPARTMENT, GET_DEPARTMENTS } from "@/graphql/departments.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, IDepartment } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { Fragment, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function DepartmentsPage() {
  // GET PERMISSIONS
  const { permissionGuard } = usePermissionGuard();

  // GET POPUP OPTIONS
  const { popupOption, setPopupOption, createNewDepartment } = usePopupOption();

  // CREATE NEW DEPARTMENT
  const { data, loading } = useQuery<{
    departments: {
      message: string;
      statusCode: number;
      success: boolean;
      data: IDepartment[];
    };
  }>(GET_DEPARTMENTS, {});

  // DELETE DEPARTMENT
  const [deleteDepartment, deleteResult] = useMutation(DELETE_DEPARTMENT, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_DEPARTMENTS }],
  });

  // HANDLERS
  const handleEdit = (row: IDepartment) => {
    const data = {
      id: row?.id,
      name: row?.name,
      description: row?.description,
      parentId: row?.parentId,
      managerId: row?.managerId,
    };

    // open the popup for editing the form
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "department",
      data: data,
      title: "Update Department",
    });
  };

  // DELETE DEPARTMENT
  const handleDelete = async (row: IDepartment) => {
    try {
      const res = await deleteDepartment({
        variables: {
          id: Number(row?.id),
        },
      });
      if (res?.data) {
        showToast.success("Deleted!", "Department deleted successfully");
      }
    } catch (error: any) {
      showToast.error("Error", error.message || "Failed to delete department");
    }
  };

  // TABLE COLUMNS DEFINITION
  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Name",
      accessorKey: "name",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "2",
      header: "Description",
      accessorKey: "description",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "3",
      header: "Parent Department",
      accessorKey: "customParentDepartment",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "4",
      header: "Manager",
      accessorKey: "customManager",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "5",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
      sortDirection: "ascending",
    },
  ]);

  // TABLE ACTIONS
  const actions: TableActionType[] = [
    {
      name: "edit",
      type: "button",
      permissions: [Permissions.DepartmentUpdate],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "inactive" }],
    },
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.DepartmentDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "department",
          deleteHandler: () => handleDelete(row),
          title: "Delete Department",
        });
      },
      disabledOn: [{ accessorKey: "isDefault", value: true }],
    },
  ];

  // RENDER
  return (
    <Fragment key={`department-page`}>
      {/* Popup for adding/editing a department */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Modal for adding a new department */}
      <PageHeader
        title="All Departments"
        subtitle="Organize your company structure and manage departments"
      />
      {/* TABLE */}
      <CustomTable
        isLoading={loading || deleteResult.loading}
        actions={actions}
        columns={columns}
        setColumns={setColumns}
        searchConfig={{
          searchable: loading ? true : false,
          debounceDelay: 500,
          defaultField: "name",
          searchableFields: [
            { label: "Name", value: "name" },
            { label: "Description", value: "description" },
          ],
        }}
        dataSource={
          data?.departments?.data?.map((row) => ({
            ...row,
            customParentDepartment: row.parent?.name ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {row.parent.name}
              </span>
            ) : (
              <span className="text-xs text-gray-400">No Parent</span>
            ),
            customManager: row.manager?.profile?.fullName ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                👤 {row.manager.profile.fullName}
              </span>
            ) : (
              <span className="text-xs text-gray-400">No Manager</span>
            ),
            customStatus: (
              <StatusBadge status={row.status as string} onClick={() => {}} />
            ),
          })) || []
        }
      >
        {permissionGuard(PermissionResource.DEPARTMENT, [
          PermissionAction.CREATE,
        ]) && (
          <button
            type="button"
            className={`btn btn-primary text-base-300`}
            onClick={createNewDepartment}
          >
            <PiPlusCircle className={`text-xl`} />
            Add New
          </button>
        )}
      </CustomTable>
    </Fragment>
  );
}
