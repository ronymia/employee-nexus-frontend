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
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function WorkSitesPage() {
  const { permissionGuard } = usePermissionGuard();
  const { popupOption, setPopupOption, createNewWorkSite } = usePopupOption();
  const { data, loading } = useQuery<{
    workSites: {
      data: IWorkSite[];
    };
  }>(GET_WORK_SITES, {});

  const [deleteWorkSite, deleteResult] = useMutation(DELETE_WORK_SITES, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_WORK_SITES }],
  });
  // console.log({ data });

  const handleEdit = (row: IWorkSite) => {
    //
    const data = {
      id: row?.id,
      name: row?.name,
      description: row?.description,
      address: row?.address,
      isLocationEnabled:
        row?.isLocationEnabled !== undefined
          ? String(row.isLocationEnabled)
          : undefined,
      isGeoLocationEnabled:
        row?.isGeoLocationEnabled !== undefined
          ? String(row.isGeoLocationEnabled)
          : undefined,
      maxRadius: row?.maxRadius,
      isIpEnabled:
        row?.isIpEnabled !== undefined ? String(row.isIpEnabled) : undefined,
      ipAddress: row?.ipAddress,
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
  const handleDelete = async (row: IWorkSite) => {
    await deleteWorkSite({
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
      header: "Address",
      accessorKey: "address",
      show: true,
      sortDirection: "ascending",
    },
    // {
    //   key: "4",
    //   header: "Location Enabled",
    //   accessorKey: "customIsLocationEnabled",
    //   show: true,
    //   sortDirection: "ascending",
    // },
    // {
    //   key: "5",
    //   header: "Geo Location Enabled",
    //   accessorKey: "customIsGeoLocationEnabled",
    //   show: true,
    //   sortDirection: "ascending",
    // },
    // {
    //   key: "6",
    //   header: "IP Enabled",
    //   accessorKey: "customIsIpEnabled",
    //   show: true,
    //   sortDirection: "ascending",
    // },
    {
      key: "7",
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
        <header className={`mb-5 flex items-center justify-between`}>
          <div className="">
            <h1 className={`text-2xl font-medium`}>All Work Sites</h1>
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
              { label: "Address", value: "address" },
            ],
          }}
          dataSource={
            data?.workSites?.data?.map((row) => ({
              ...row,
              customIsLocationEnabled: row?.isLocationEnabled ? "Yes" : "No",
              customIsGeoLocationEnabled: row?.isGeoLocationEnabled
                ? "Yes"
                : "No",
              customIsIpEnabled: row?.isIpEnabled ? "Yes" : "No",
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
