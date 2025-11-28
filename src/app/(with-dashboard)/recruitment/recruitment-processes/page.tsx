"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import {
  DELETE_RECRUITMENT_PROCESSES,
  GET_RECRUITMENT_PROCESSES,
} from "@/graphql/recruitment-processes.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, IRecruitmentProcess } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function RecruitmentProcessesPage() {
  const { permissionGuard } = usePermissionGuard();
  const { popupOption, setPopupOption, createNewRecruitmentProcess } =
    usePopupOption();
  const { data, loading } = useQuery<{
    recruitmentProcesses: {
      data: IRecruitmentProcess[];
    };
  }>(GET_RECRUITMENT_PROCESSES, {});

  const [deleteRecruitmentProcess, deleteResult] = useMutation(
    DELETE_RECRUITMENT_PROCESSES,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_RECRUITMENT_PROCESSES }],
    }
  );
  // console.log({ data });

  const handleEdit = (row: IRecruitmentProcess) => {
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
      form: "recruitment_process",
      data: data,
      title: "Update Recruitment Process",
    });
  };
  const handleDelete = async (row: IRecruitmentProcess) => {
    await deleteRecruitmentProcess({
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
      permissions: [Permissions.RecruitmentProcessUpdate],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "inactive" }],
    },
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.RecruitmentProcessDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "recruitment_process",
          deleteHandler: () => handleDelete(row),
          title: "Delete Recruitment Process",
        });
      },
      disabledOn: [],
    },
  ];

  // Modal for adding a new recruitment process
  return (
    <>
      {/* Popup for adding/editing a recruitment process */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Modal for adding a new recruitment process */}
      <section className={``}>
        <header className={`mb-5 flex items-center justify-between`}>
          <div className="">
            <h1 className={`text-2xl font-medium`}>
              All Recruitment Processes
            </h1>
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
            data?.recruitmentProcesses?.data?.map((row) => ({
              ...row,
              customIsRequired: row?.isRequired ? "Yes" : "No",
            })) || []
          }
        >
          {permissionGuard(PermissionResource.RECRUITMENT_PROCESS, [
            PermissionAction.CREATE,
          ]) && (
            <button
              type="button"
              className={`btn btn-primary text-base-300`}
              onClick={createNewRecruitmentProcess}
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
