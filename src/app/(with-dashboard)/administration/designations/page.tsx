"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
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
import { PiPlusCircle } from "react-icons/pi";

export default function DesignationsPage() {
  const { permissionGuard } = usePermissionGuard();
  // CREATE NEW DESIGNATION
  const { popupOption, setPopupOption, createNewDesignation } =
    usePopupOption();
  const { data, loading } = useQuery<{
    designations: {
      data: IDesignation[];
    };
  }>(GET_DESIGNATIONS, {});

  // DELETE DESIGNATION
  const [deleteSubscriptionPlan, deleteResult] = useMutation(
    DELETE_DESIGNATION,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_DESIGNATIONS }],
    }
  );
  // console.log({ data });

  // HANDLERS
  const handleEdit = (row: IDesignation) => {
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
      form: "designation",
      data: data,
      title: "Update Designation",
    });
  };

  // DELETE HANDLER
  const handleDelete = async (row: IDesignation) => {
    await deleteSubscriptionPlan({
      variables: {
        id: Number(row?.id),
      },
    });
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
      accessorKey: "status",
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
        <header className={`mb-5 flex items-center justify-between`}>
          <div className="">
            <h1 className={`text-2xl font-medium`}>All Designations</h1>
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
              { label: "Price", value: "price" },
              { label: "Description", value: "description" },
            ],
          }}
          dataSource={data?.designations?.data || []}
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
