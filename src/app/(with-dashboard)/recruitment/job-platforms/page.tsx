"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import { Permissions } from "@/constants/permissions.constant";
import {
  DELETE_JOB_PLATFORMS,
  GET_JOB_PLATFORMS,
} from "@/graphql/job-platforms.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType } from "@/types";
import { IJobPlatform } from "@/types/job-platforms.type";
import { IJobType } from "@/types/job-type.type";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function JobPlatformsPage() {
  const { hasPermission } = usePermissionGuard();
  const { popupOption, setPopupOption, createNewJobPlatforms } =
    usePopupOption();
  const { data, loading } = useQuery<{
    jobPlatforms: {
      data: IJobPlatform[];
    };
  }>(GET_JOB_PLATFORMS, {});

  const [deleteSubscriptionPlan, deleteResult] = useMutation(
    DELETE_JOB_PLATFORMS,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_JOB_PLATFORMS }],
    }
  );
  // console.log({ data });

  const handleEdit = (row: IJobType) => {
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
      form: "job_platforms",
      data: data,
      title: "Update Job Platforms",
    });
  };
  const handleDelete = async (row: IJobType) => {
    await deleteSubscriptionPlan({
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
    // {
    //   name: "edit",
    //   type: "button",
    //   permissions: [Permissions.JobPlatformUpdate],
    //   handler: handleEdit,
    //   disabledOn: [{ accessorKey: "status", value: "inactive" }],
    // },
    // {
    //   name: "delete",
    //   type: "button",
    //   permissions: [Permissions.JobPlatformDelete],
    //   handler: (row) => {
    //     setPopupOption({
    //       open: true,
    //       closeOnDocumentClick: true,
    //       actionType: "delete",
    //       form: "job_platforms",
    //       deleteHandler: () => handleDelete(row),
    //       title: "Delete Job Platforms",
    //     });
    //   },
    //   disabledOn: [],
    // },
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
            <h1 className={`text-2xl font-medium`}>All Job Platforms</h1>
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
            searchableFields: [{ label: "Name", value: "name" }],
          }}
          dataSource={data?.jobPlatforms?.data || []}
        >
          {/* {hasPermission(Permissions.JobPlatformCreate) && (
            <button
              type="button"
              className={`btn btn-primary text-base-300`}
              onClick={createNewJobPlatforms}
            >
              <PiPlusCircle className={`text-xl`} />
              Add New
            </button>
          )} */}
        </CustomTable>
      </section>
    </>
  );
}
