"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import { DELETE_DEPARTMENT, GET_DEPARTMENTS } from "@/graphql/departments.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType } from "@/types";
import { IDepartment } from "@/types/departments.type";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function DepartmentsPage() {
  const { permissionGuard } = usePermissionGuard();
  // CREATE NEW DEPARTMENT
  const { popupOption, setPopupOption, createNewDepartment } = usePopupOption();
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
      status: row?.status,
      parentId: row?.parentId,
      businessId: row?.businessId,
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

  const handleDelete = async (row: IDepartment) => {
    await deleteDepartment({
      variables: {
        id: Number(row?.id),
      },
    });
  };

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
      accessorKey: "CustomParentName",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "4",
      header: "Manager",
      accessorKey: "CustomManagerName",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "5",
      header: "Status",
      accessorKey: "status",
      show: true,
      sortDirection: "ascending",
    },
  ]);

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
      disabledOn: [],
    },
  ];

  // Modal for adding a new department
  return (
    <>
      {/* Popup for adding/editing a department */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Modal for adding a new department */}
      <section className={``}>
        <header className={`mb-5 flex items-center justify-between`}>
          <div className="">
            <h1 className={`text-2xl font-medium`}>All Departments</h1>
          </div>
        </header>
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
              CustomParentName: row.parent?.name || "N/A",
              CustomManagerName: row.manager?.profile?.fullName || "N/A",
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
      </section>
    </>
  );
}
