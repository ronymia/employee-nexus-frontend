"use client";

import { showToast } from "@/components/ui/CustomToast";
import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
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
import Swal from "sweetalert2";

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
    try {
      const res = await deleteEmploymentStatus({
        variables: {
          id: Number(row?.id),
        },
      });
      if (res?.data) {
        showToast.success("Deleted!", "Employment status deleted successfully");
      }
    } catch (error: any) {
      showToast.error(
        "Error",
        error.message || "Failed to delete employment status"
      );
    }
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
      accessorKey: "customStatus",
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
        Swal.fire({
          title: "Are you sure?",
          text: `Do you want to delete "${row.name}"? This action cannot be undone!`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            await handleDelete(row);
            return true;
          },
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
        <PageHeader
          title="All Employment Statuses"
          subtitle="Manage your employee employment statuses"
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
            data?.employmentStatuses?.data?.map((row) => ({
              ...row,
              customStatus: (
                <StatusBadge status={row.status} onClick={() => {}} />
              ),
            })) || []
          }
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
