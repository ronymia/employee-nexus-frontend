"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import { DELETE_WORK_SITES, GET_WORK_SITES } from "@/graphql/work-sites.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, IWorkSite } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import PageHeader from "@/components/ui/PageHeader";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import StatusBadge from "@/components/ui/StatusBadge";

export default function WorkSitesPage() {
  // PERMISSION GUARD
  const { permissionGuard } = usePermissionGuard();
  // MODAL OPTION
  const { popupOption, setPopupOption, createNewWorkSite } = usePopupOption();
  // GET ALL WORK SITES
  const { data, loading } = useQuery<{
    workSites: {
      data: IWorkSite[];
    };
  }>(GET_WORK_SITES, {});

  // DELETE WORK SITE MUTATION
  const [deleteWorkSite, deleteResult] = useMutation(DELETE_WORK_SITES, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_WORK_SITES }],
  });

  // UPDATE HANDLER
  const handleEdit = (row: IWorkSite) => {
    //
    const data = {
      id: row?.id ? Number(row.id) : undefined,
      name: row?.name,
      description: row?.description,
      locationTrackingType: row?.locationTrackingType,
      address: row?.address || undefined,
      lat: row?.lat || undefined,
      lng: row?.lng || undefined,
      maxRadius: row?.maxRadius || undefined,
      ipAddress: row?.ipAddress || undefined,
    };

    // open the popup for editing the form
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "work_site",
      data: data,
      title: "Update Work Site",
    });
  };

  // DELETE HANDLER
  const handleDelete = async (row: IWorkSite) => {
    await deleteWorkSite({
      variables: {
        id: Number(row?.id),
      },
    });
  };

  // TABLE COLUMNS DEF
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
      header: "Location Track Type",
      accessorKey: "customLocationTrackingType",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "4",
      header: "Geo/IP Address",
      accessorKey: "customGeoIpAddress",
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
      permissions: [Permissions.WorkSiteUpdate],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "inactive" }],
    },
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.WorkSiteDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "work_site",
          deleteHandler: () => handleDelete(row),
          title: "Delete Work Site",
        });
      },
      disabledOn: [],
    },
  ];

  // Modal for adding a new work site
  return (
    <>
      {/* Popup for adding/editing a work site */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Modal for adding a new work site */}
      <section className={``}>
        <PageHeader title="All Work Sites" subtitle="Manage your work sites" />
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
              { label: "Address", value: "address" },
            ],
          }}
          dataSource={
            data?.workSites?.data?.map((row) => ({
              ...row,
              customStatus: (
                <StatusBadge status={row.status as string} onClick={() => {}} />
              ),
              customLocationTrackingType: (
                <span className="capitalize">
                  {row?.locationTrackingType
                    ?.replaceAll("_", " ")
                    .toLowerCase()}
                </span>
              ),
              customGeoIpAddress:
                row?.locationTrackingType === "GEO_FENCING" ? (
                  <div className="flex items-center gap-2">
                    <span className="badge badge-info badge-sm">📍 Geo</span>
                    <span className="text-xs text-base-content/70">
                      {row?.maxRadius || "N/A"}m radius
                    </span>
                  </div>
                ) : row?.locationTrackingType === "IP_WHITELIST" ? (
                  <div className="flex items-center gap-2">
                    <span className="badge badge-warning badge-sm">🌐 IP</span>
                    <span className="text-xs font-mono text-base-content/70">
                      {row?.ipAddress || "N/A"}
                    </span>
                  </div>
                ) : row?.locationTrackingType === "MANUAL" ? (
                  <span className="badge badge-primary badge-sm">
                    📝 Manual
                  </span>
                ) : (
                  <span className="badge badge-ghost badge-sm">🚫 None</span>
                ),
            })) || []
          }
        >
          {permissionGuard(PermissionResource.WORK_SITE, [
            PermissionAction.CREATE,
          ]) && (
            <button
              type="button"
              className={`btn btn-primary text-base-300`}
              onClick={createNewWorkSite}
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
