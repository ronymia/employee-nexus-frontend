"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import StatusBadge from "@/components/ui/StatusBadge";
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
import { Fragment, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import PageHeader from "@/components/ui/PageHeader";
import { showToast } from "@/components/ui/CustomToast";

// ==================== ASSET TYPES PAGE COMPONENT ====================
export default function AssetTypesPage() {
  // ==================== HOOKS INITIALIZATION ====================
  const { hasPermission } = usePermissionGuard();
  const { popupOption, setPopupOption } = usePopupOption();

  // ==================== GRAPHQL QUERY: FETCH ASSET TYPES ====================
  const { data, loading } = useQuery<{
    assetTypes: {
      data: IAssetType[];
    };
  }>(GET_ASSET_TYPES, {});

  // ==================== GRAPHQL MUTATION: DELETE ASSET TYPE ====================
  const [deleteAssetType, deleteResult] = useMutation(DELETE_ASSET_TYPE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ASSET_TYPES }],
  });

  // ==================== HANDLER: EDIT ASSET TYPE ====================
  const handleEdit = (row: IAssetType) => {
    const data = {
      id: row?.id,
      description: row?.description,
      name: row?.name,
    };

    // OPEN FORM POPUP FOR EDITING
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "asset_type",
      data: data,
      title: "Update Asset Type",
    });
  };

  // ==================== HANDLER: DELETE ASSET TYPE ====================
  const handleDelete = async (row: IAssetType) => {
    try {
      const result = await deleteAssetType({
        variables: {
          id: Number(row?.id),
        },
      });
      if (result?.data) {
        showToast.success("Deleted!", "Asset type deleted successfully");
      }
    } catch (error: any) {
      showToast.error("Error", error.message || "Failed to delete asset type");
    }
  };

  // ==================== HANDLER: CREATE NEW ASSET TYPE ====================
  const createNewAssetType = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "asset_type",
      title: "Create Asset Type",
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

  // ==================== TABLE ACTIONS CONFIGURATION ====================
  const actions: TableActionType[] = [
    // EDIT ACTION
    {
      name: "edit",
      type: "button",
      permissions: [Permissions.AssetTypeUpdate],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "INACTIVE" }],
    },
    // DELETE ACTION
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

  // ==================== COMPONENT RENDER ====================
  return (
    <Fragment key={`asset-types-page`}>
      {/* DELETE CONFIRMATION MODAL */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* ASSET TYPES PAGE CONTENT */}
      {/* PAGE HEADER WITH TITLE AND SUBTITLE */}
      <PageHeader
        title="Asset Type Management"
        subtitle="Organize and categorize your organization's assets by defining and managing asset types"
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
            { label: "Description", value: "description" },
          ],
        }}
        dataSource={
          data?.assetTypes?.data?.map((row) => ({
            ...row,
            customStatus: (
              <StatusBadge
                key={`${row.id}-asset-type-status`}
                status={row.status}
              />
            ),
          })) || []
        }
      >
        {hasPermission(Permissions.AssetTypeCreate) && (
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
    </Fragment>
  );
}
