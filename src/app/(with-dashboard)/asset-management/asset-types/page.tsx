"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import { DELETE_ASSET_TYPE, GET_ASSET_TYPES } from "@/graphql/asset-type.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, IAssetType } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function AssetTypesPage() {
  const { permissionGuard } = usePermissionGuard();
  const { popupOption, setPopupOption } = usePopupOption();
  const { data, loading } = useQuery<{
    assetTypes: {
      data: IAssetType[];
    };
  }>(GET_ASSET_TYPES, {});

  const [deleteAssetType, deleteResult] = useMutation(DELETE_ASSET_TYPE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSET_TYPES }],
  });

  const handleEdit = (row: IAssetType) => {
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
      form: "asset_type",
      data: data,
      title: "Update Asset Type",
    });
  };

  const handleDelete = async (row: IAssetType) => {
    await deleteAssetType({
      variables: {
        id: Number(row?.id),
      },
    });
  };

  const createNewAssetType = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "asset_type",
      title: "Create Asset Type",
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
      permissions: [Permissions.AssetTypeUpdate],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "INACTIVE" }],
    },
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.AssetTypeDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "asset_type",
          deleteHandler: () => handleDelete(row),
          title: "Delete Asset Type",
        });
      },
      disabledOn: [],
    },
  ];

  return (
    <>
      {/* Popup for adding/editing an asset type */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Main content */}
      <section className={``}>
        <header className={`mb-5 flex items-center justify-between`}>
          <div className="">
            <h1 className={`text-2xl font-medium`}>All Asset Types</h1>
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
          dataSource={data?.assetTypes?.data || []}
        >
          {permissionGuard(PermissionResource.ASSET_TYPE, [
            PermissionAction.CREATE,
          ]) && (
            <button
              type="button"
              className={`btn btn-primary text-base-300`}
              onClick={createNewAssetType}
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
