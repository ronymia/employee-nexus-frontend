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
import { TableActionType, TableColumnType, IProject } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { Fragment, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import { showToast } from "@/components/ui/CustomToast";

// ==================== PROJECTS PAGE COMPONENT ====================
export default function ProjectsPage() {
  // ==================== HOOKS INITIALIZATION ====================
  const router = useRouter();
  const { permissionGuard } = usePermissionGuard();
  const { popupOption, setPopupOption } = usePopupOption();

  // ==================== GRAPHQL QUERY: FETCH PROJECTS ====================
  const { data, loading } = useQuery<{
    projects: {
      data: IProject[];
    };
  }>(GET_PROJECTS, {});

  // ==================== GRAPHQL MUTATION: DELETE PROJECT ====================
  const [deleteProject, deleteResult] = useMutation(DELETE_PROJECT, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  // ==================== HANDLER: EDIT PROJECT ====================
  const handleEdit = (row: IProject) => {
    const data = {
      id: row?.id,
      name: row?.name,
      description: row?.description,
      cover: row?.cover,
      status: row?.status,
      startDate: row?.startDate,
      endDate: row?.endDate,
    };

    // OPEN FORM POPUP FOR EDITING
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "project",
      data: data,
      title: "Update Project",
    });
  };

  // ==================== HANDLER: DELETE PROJECT ====================
  const handleDelete = async (row: IProject) => {
    try {
      const result = await deleteProject({
        variables: {
          id: Number(row?.id),
        },
      });
      if (result?.data) {
        showToast.success("Deleted!", "Project deleted successfully");
      }
    } catch (error: any) {
      showToast.error("Error", error.message || "Failed to delete project");
    }
  };

  // ==================== HANDLER: CREATE NEW PROJECT ====================
  const createNewProject = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "project",
      title: "Create Project",
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

  // ==================== HANDLER: VIEW PROJECT ====================
  const handleView = (row: IProject) => {
    router.push(`/projects/${row.id}/view`);
  };

  // ==================== TABLE ACTIONS CONFIGURATION ====================
  const actions: TableActionType[] = [
    // VIEW ACTION
    {
      name: "view",
      type: "button",
      permissions: [Permissions.ProjectRead],
      handler: handleView,
      disabledOn: [],
    },
    // EDIT ACTION
    {
      name: "edit",
      type: "button",
      permissions: [Permissions.ProjectUpdate],
      handler: handleEdit,
      disabledOn: [],
    },
    // DELETE ACTION
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

  // ==================== COMPONENT RENDER ====================
  return (
    <Fragment key={`projects-page`}>
      {/* DELETE CONFIRMATION MODAL */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* PROJECTS PAGE CONTENT */}
      <section className={``}>
        {/* PAGE HEADER WITH TITLE AND SUBTITLE */}
        <PageHeader
          title="Project Management"
          subtitle="Oversee all organizational projects, track milestones, manage teams, and ensure timely delivery of project objectives"
        />
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
          dataSource={
            data?.projects?.data?.map((row) => ({
              ...row,
              // CUSTOM STATUS COLUMN WITH COLOR-CODED BADGES
              customStatus: row?.status ? (
                <span
                  className={`badge badge-sm font-semibold ${
                    row.status.toLowerCase() === "pending"
                      ? "badge-warning"
                      : row.status.toLowerCase() === "ongoing"
                      ? "badge-info"
                      : row.status.toLowerCase() === "complete"
                      ? "badge-success"
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
    </Fragment>
  );
}
