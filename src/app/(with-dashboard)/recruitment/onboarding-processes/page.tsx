"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import {
  DELETE_ONBOARDING_PROCESSES,
  GET_ONBOARDING_PROCESSES,
} from "@/graphql/onboarding-processes.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, IOnboardingProcess } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function OnboardingProcessesPage() {
  const { permissionGuard } = usePermissionGuard();
  const { popupOption, setPopupOption, createNewOnboardingProcess } =
    usePopupOption();
  const { data, loading } = useQuery<{
    onboardingProcesses: {
      data: IOnboardingProcess[];
    };
  }>(GET_ONBOARDING_PROCESSES, {});

  const [deleteOnboardingProcess, deleteResult] = useMutation(
    DELETE_ONBOARDING_PROCESSES,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_ONBOARDING_PROCESSES }],
    }
  );
  // console.log({ data });

  const handleEdit = (row: IOnboardingProcess) => {
    //
    const data = {
      id: row?.id,
      description: row?.description,
      name: row?.name,
      isRequired: row?.isRequired,
    };

    // open the popup for editing the form
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "onboarding_process",
      data: data,
      title: "Update Onboarding Process",
    });
  };
  const handleDelete = async (row: IOnboardingProcess) => {
    await deleteOnboardingProcess({
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
      key: "4",
      header: "Requirement",
      accessorKey: "customIsRequired",
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
      permissions: [Permissions.OnboardingProcessUpdate],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "inactive" }],
    },
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.OnboardingProcessDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "onboarding_process",
          deleteHandler: () => handleDelete(row),
          title: "Delete Onboarding Process",
        });
      },
      disabledOn: [],
    },
  ];

  // Modal for adding a new onboarding process
  return (
    <>
      {/* Popup for adding/editing a onboarding process */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Modal for adding a new onboarding process */}
      <section className={``}>
        <header className={`mb-5 flex items-center justify-between`}>
          <div className="">
            <h1 className={`text-2xl font-medium`}>All Onboarding Processes</h1>
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
          dataSource={
            data?.onboardingProcesses?.data?.map((row) => ({
              ...row,
              customIsRequired: row?.isRequired ? "Yes" : "No",
            })) || []
          }
        >
          {permissionGuard(PermissionResource.ONBOARDING_PROCESS, [
            PermissionAction.CREATE,
          ]) && (
            <button
              type="button"
              className={`btn btn-primary text-base-300`}
              onClick={createNewOnboardingProcess}
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
