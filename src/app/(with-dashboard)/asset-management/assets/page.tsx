"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import { Permissions } from "@/constants/permissions.constant";
import { DELETE_ASSET, GET_ASSETS } from "@/graphql/asset.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, Asset } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { Fragment, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import PageHeader from "@/components/ui/PageHeader";
import { showToast } from "@/components/ui/CustomToast";

// ==================== ASSETS PAGE COMPONENT ====================
export default function AssetsPage() {
  // ==================== HOOKS INITIALIZATION ====================
  const { hasPermission } = usePermissionGuard();
  const { popupOption, setPopupOption } = usePopupOption();

  // ==================== GRAPHQL QUERY: FETCH ASSETS ====================
  const { data, loading } = useQuery<{
    assets: {
      data: Asset[];
    };
  }>(GET_ASSETS, {});

  // ==================== GRAPHQL MUTATION: DELETE ASSET ====================
  const [deleteAsset, deleteResult] = useMutation(DELETE_ASSET, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSETS }],
  });

  // ==================== HANDLER: EDIT ASSET ====================
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

    // OPEN FORM POPUP FOR EDITING
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "asset",
      data: data,
      title: "Update Asset",
    });
  };

  // ==================== HANDLER: DELETE ASSET ====================
  const handleDelete = async (row: Asset) => {
    try {
      const result = await deleteAsset({
        variables: {
          id: Number(row?.id),
        },
      });
      if (result?.data) {
        showToast.success("Deleted!", "Asset deleted successfully");
      }
    } catch (error: any) {
      showToast.error("Error", error.message || "Failed to delete asset");
    }
  };

  // ==================== HANDLER: CREATE NEW ASSET ====================
  const createNewAsset = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "asset",
      title: "Create Asset",
    });
  };

  // ==================== TABLE COLUMNS CONFIGURATION ====================
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
      accessorKey: "customStatus",
      show: true,
      sortDirection: "ascending",
    },
  ]);

  // ==================== TABLE ACTIONS CONFIGURATION ====================
  const actions: TableActionType[] = [
    // EDIT ACTION
    {
      name: "edit",
      type: "button",
      permissions: [Permissions.AssetUpdate],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "INACTIVE" }],
    },
    // DELETE ACTION
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

  // ==================== COMPONENT RENDER ====================
  return (
    <Fragment key={`assets-page`}>
      {/* DELETE CONFIRMATION MODAL */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* ASSETS PAGE CONTENT */}
      {/* PAGE HEADER WITH TITLE AND SUBTITLE */}
      <PageHeader
        title="Asset Management"
        subtitle="Track and manage all organizational assets including equipment, devices, and inventory items"
      />
      {/* TABLE */}
      <CustomTable
        isLoading={loading || deleteResult.loading}
        actions={actions}
        columns={columns}
        setColumns={setColumns}
        searchConfig={{
          searchable: loading ? false : true,
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
            // CUSTOM STATUS COLUMN WITH COLOR-CODED BADGES
            customStatus: row?.status ? (
              <span
                className={`badge badge-sm font-semibold ${
                  row.status.toLowerCase() === "assign"
                    ? "badge-success"
                    : row.status.toLowerCase() === "unassigned"
                    ? "badge-warning"
                    : row.status.toLowerCase() === "damage"
                    ? "badge-error"
                    : "badge-secondary"
                }`}
              >
                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              </span>
            ) : (
              <span className="text-sm text-gray-400">N/A</span>
            ),
          })) || []
        }
      >
        {hasPermission(Permissions.AssetCreate) && (
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
    </Fragment>
  );
}
