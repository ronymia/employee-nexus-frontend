"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import {
  DELETE_EMPLOYMENT_STATUS,
  GET_EMPLOYMENT_STATUSES,
} from "@/graphql/employment-status.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, IEmploymentStatus } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function EmploymentStatusesPage() {
  const { permissionGuard } = usePermissionGuard();
  // CREATE NEW EMPLOYMENT STATUS
  const { popupOption, setPopupOption, createNewEmploymentStatus } =
    usePopupOption();
  const { data, loading } = useQuery<{
    employmentStatuses: {
      data: IEmploymentStatus[];
    };
  }>(GET_EMPLOYMENT_STATUSES, {});

  // DELETE EMPLOYMENT STATUS
  const [deleteEmploymentStatus, deleteResult] = useMutation(
    DELETE_EMPLOYMENT_STATUS,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_EMPLOYMENT_STATUSES }],
    }
  );
  // console.log({ data });

  // HANDLERS
  const handleEdit = (row: IEmploymentStatus) => {
    //
    const data = {
      id: row?.id,
      description: row?.description,
      name: row?.name,
    };

    // open the popup for editing the form
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "employment_status",
      data: data,
      title: "Update Employment Status",
    });
  };
  const handleDelete = async (row: IEmploymentStatus) => {
    await deleteEmploymentStatus({
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
      permissions: [Permissions.EmploymentStatusUpdate],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "inactive" }],
    },
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.EmploymentStatusDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "employment_status",
          deleteHandler: () => handleDelete(row),
          title: "Delete Employment Status",
        });
      },
      disabledOn: [],
    },
  ];

  // Modal for adding a new employment status
  return (
    <>
      {/* Popup for adding/editing a employment status */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Modal for adding a new employment status */}
      <section className={``}>
        <header className={`mb-5 flex items-center justify-between`}>
          <div className="">
            <h1 className={`text-2xl font-medium`}>All Employment Statuses</h1>
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
          dataSource={data?.employmentStatuses?.data || []}
        >
          {permissionGuard(PermissionResource.EMPLOYMENT_STATUS, [
            PermissionAction.CREATE,
          ]) && (
            <button
              type="button"
              className={`btn btn-primary text-base-300`}
              onClick={createNewEmploymentStatus}
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
