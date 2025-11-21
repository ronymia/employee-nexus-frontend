"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import { DELETE_PROJECT, GET_PROJECTS } from "@/graphql/project.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType, Project } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function ProjectsPage() {
  const { permissionGuard } = usePermissionGuard();
  const { popupOption, setPopupOption } = usePopupOption();
  const { data, loading } = useQuery<{
    projects: {
      data: Project[];
    };
  }>(GET_PROJECTS, {});

  const [deleteProject, deleteResult] = useMutation(DELETE_PROJECT, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  const handleEdit = (row: Project) => {
    const data = {
      id: row?.id,
      name: row?.name,
      description: row?.description,
      cover: row?.cover,
      status: row?.status,
      startDate: row?.startDate,
      endDate: row?.endDate,
    };

    // open the popup for editing the form
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "project",
      data: data,
      title: "Update Project",
    });
  };

  const handleDelete = async (row: Project) => {
    await deleteProject({
      variables: {
        id: Number(row?.id),
      },
    });
  };

  const createNewProject = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "project",
      title: "Create Project",
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
    {
      key: "4",
      header: "Start Date",
      accessorKey: "startDate",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "5",
      header: "End Date",
      accessorKey: "endDate",
      show: true,
      sortDirection: "ascending",
    },
  ]);

  const actions: TableActionType[] = [
    {
      name: "edit",
      type: "button",
      permissions: [Permissions.ProjectUpdate],
      handler: handleEdit,
      disabledOn: [],
    },
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.ProjectDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "project",
          deleteHandler: () => handleDelete(row),
          title: "Delete Project",
        });
      },
      disabledOn: [],
    },
  ];

  return (
    <>
      {/* Popup for adding/editing a project */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Main content */}
      <section className={``}>
        <header className={`mb-5 flex items-center justify-between`}>
          <div className="">
            <h1 className={`text-2xl font-medium`}>All Projects</h1>
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
              { label: "Status", value: "status" },
            ],
          }}
          dataSource={data?.projects?.data || []}
        >
          {permissionGuard(PermissionResource.PROJECT, [
            PermissionAction.CREATE,
          ]) && (
            <button
              type="button"
              className={`btn btn-primary text-base-300`}
              onClick={createNewProject}
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
