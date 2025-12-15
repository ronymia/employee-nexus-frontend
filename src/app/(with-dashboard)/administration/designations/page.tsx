"use client";

import { showToast } from "@/components/ui/CustomToast";
import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import {
  DELETE_DESIGNATION,
  GET_DESIGNATIONS,
} from "@/graphql/designation.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, IDesignation } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { PiPlusCircle } from "react-icons/pi";

export default function DesignationsPage() {
  // PERMISSIONS
  const { permissionGuard } = usePermissionGuard();
  // CREATE NEW DESIGNATION
  const { popupOption, setPopupOption, createNewDesignation } =
    usePopupOption();

  // GET ALL DESIGNATIONS
  const { data, loading } = useQuery<{
    designations: {
      data: IDesignation[];
    };
  }>(GET_DESIGNATIONS, {});

  // DELETE DESIGNATION
  const [deleteDesignation, deleteResult] = useMutation(DELETE_DESIGNATION, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_DESIGNATIONS }],
  });

  // HANDLERS
  const handleEdit = (row: IDesignation) => {
    //
    const data = {
      id: row?.id,
      description: row?.description,
      name: row?.name,
    };

    // OPEN FORM
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "designation",
      data: data,
      title: "Update Designation",
    });
  };

  // DELETE HANDLER
  const handleDelete = async (row: IDesignation) => {
    try {
      const res = await deleteDesignation({
        variables: {
          id: Number(row?.id),
        },
      });
      if (res?.data) {
        showToast.success("Deleted!", "Designation deleted successfully");
      }
    } catch (error: any) {
      showToast.error("Error", error.message || "Failed to delete designation");
    }
  };

  // COLUMNS
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

  // ACTIONS
  const actions: TableActionType[] = [
    {
      name: "edit",
      type: "button",
      permissions: [Permissions.DesignationUpdate],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "inactive" }],
    },
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.DesignationDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "designation",
          deleteHandler: () => handleDelete(row),
          title: "Delete Designation",
        });
      },
      disabledOn: [],
    },
  ];

  // Modal for adding a new subscription plan
  return (
    <>
      {/* Popup for adding/editing a subscription plan */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Modal for adding a new subscription plan */}
      <section className={``}>
        <PageHeader
          title="All Designations"
          subtitle="Manage your employee designations"
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
              { label: "Price", value: "price" },
              { label: "Description", value: "description" },
            ],
          }}
          dataSource={
            data?.designations?.data?.map((row) => ({
              ...row,
              customStatus: (
                <StatusBadge status={row.status} onClick={() => {}} />
              ),
            })) || []
          }
        >
          {permissionGuard(
            PermissionResource.DESIGNATION,
            [PermissionAction.CREATE],
            false
          ) && (
            <button
              type="button"
              className={`btn btn-primary text-base-300`}
              onClick={createNewDesignation}
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
