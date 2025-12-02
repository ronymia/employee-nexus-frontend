"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import { DELETE_ASSET, GET_ASSETS } from "@/graphql/asset.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, Asset } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function AssetsPage() {
  const { permissionGuard } = usePermissionGuard();
  const { popupOption, setPopupOption } = usePopupOption();
  const { data, loading } = useQuery<{
    assets: {
      data: Asset[];
    };
  }>(GET_ASSETS, {});

  const [deleteAsset, deleteResult] = useMutation(DELETE_ASSET, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSETS }],
  });

  const handleEdit = (row: Asset) => {
    const data = {
      id: row?.id,
      name: row?.name,
      code: row?.code,
      date: row?.date,
      assetTypeId: row?.assetTypeId,
      image: row?.image,
      note: row?.note,
    };

    // open the popup for editing the form
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "asset",
      data: data,
      title: "Update Asset",
    });
  };

  const handleDelete = async (row: Asset) => {
    await deleteAsset({
      variables: {
        id: Number(row?.id),
      },
    });
  };

  const createNewAsset = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "asset",
      title: "Create Asset",
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
      header: "Code",
      accessorKey: "code",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "3",
      header: "Date",
      accessorKey: "date",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "4",
      header: "Asset Type",
      accessorKey: "customAssetTypeName",
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
      permissions: [Permissions.AssetUpdate],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "INACTIVE" }],
    },
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.AssetDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "asset",
          deleteHandler: () => handleDelete(row),
          title: "Delete Asset",
        });
      },
      disabledOn: [],
    },
  ];

  return (
    <>
      {/* Popup for adding/editing an asset */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Main content */}
      <section className={``}>
        <header className={`mb-5 flex items-center justify-between`}>
          <div className="">
            <h1 className={`text-2xl font-medium`}>All Assets</h1>
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
              { label: "Code", value: "code" },
              { label: "Asset Type", value: "assetType.name" },
            ],
          }}
          dataSource={
            data?.assets?.data?.map((row) => ({
              ...row,
              customAssetTypeName: row.assetType?.name || "-",
            })) || []
          }
        >
          {permissionGuard(PermissionResource.ASSET, [
            PermissionAction.CREATE,
          ]) && (
            <button
              type="button"
              className={`btn btn-primary text-base-300`}
              onClick={createNewAsset}
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
