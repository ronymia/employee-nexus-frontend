"use client";

import { useState } from "react";
import { IPopupOption } from "@/types";
import { IUserProjectMember } from "@/types/project.type";
import CustomPopup from "@/components/modal/CustomPopup";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  PiTrash,
  PiFolderOpen,
  PiPlus,
  PiCalendar,
  PiUsers,
  PiPencilSimple,
} from "react-icons/pi";
import ProjectMemberForm from "./components/ProjectMemberForm";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_USER_PROJECTS,
  UNASSIGN_PROJECT_MEMBER,
} from "@/graphql/project.api";
import moment from "moment";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import useDeleteConfirmation from "@/hooks/useDeleteConfirmation";

interface IProjectsContentProps {
  userId: number;
}

export default function ProjectsContent({ userId }: IProjectsContentProps) {
  // ==================== HOOKS ====================
  const { hasPermission } = usePermissionGuard();
  const deleteConfirmation = useDeleteConfirmation();

  // ==================== LOCAL STATE ====================
  const [popupOption, setPopupOption] = useState<IPopupOption>({
    open: false,
    closeOnDocumentClick: true,
    actionType: "create",
    form: "",
    data: null,
    title: "",
  });

  // Query to get user projects
  const { data, loading } = useQuery<{
    userProjects: {
      data: IUserProjectMember[];
    };
  }>(GET_USER_PROJECTS, {
    variables: { userId },
  });

  // Unassign project member mutation
  const [unassignProjectMember] = useMutation(UNASSIGN_PROJECT_MEMBER, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_USER_PROJECTS, variables: { userId } }],
    onCompleted: () => {
      setPopupOption({
        open: false,
        closeOnDocumentClick: true,
        actionType: "create",
        form: "",
        data: null,
        title: "",
      });
    },
  });

  const projectMembers = data?.userProjects?.data || [];
  const handleOpenForm = (
    actionType: "create" | "update",
    member?: IUserProjectMember,
  ) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: actionType,
      form: "projectMember",
      data: member || null,
      title:
        actionType === "create"
          ? "Assign to Project"
          : "Update Project Assignment",
    });
  };

  const handleCloseForm = () => {
    setPopupOption({
      open: false,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "",
      data: null,
      title: "",
    });
  };

  // ==================== DELETE HANDLER ====================
  const handleDelete = async (member: IUserProjectMember) => {
    await deleteConfirmation.confirm({
      title: "Remove from Project",
      itemName: member.project.name,
      itemDescription: `Role: ${member.role || "Member"}`,
      confirmButtonText: "Remove from Project",
      successMessage: "Successfully removed from project",
      onDelete: async () => {
        await unassignProjectMember({
          variables: {
            unassignProjectMemberInput: {
              projectId: member.projectId,
              userId: member.userId,
            },
          },
        });
      },
    });
  };

  // Group projects by status
  const activeProjects = projectMembers.filter(
    (member) =>
      member.project.status === "ACTIVE" ||
      member.project.status === "IN_PROGRESS",
  );
  const completedProjects = projectMembers.filter(
    (member) => member.project.status === "COMPLETED",
  );
  const otherProjects = projectMembers.filter(
    (member) =>
      member.project.status !== "ACTIVE" &&
      member.project.status !== "IN_PROGRESS" &&
      member.project.status !== "COMPLETED",
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "IN_PROGRESS":
        return "badge-success";
      case "COMPLETED":
        return "badge-info";
      case "ON_HOLD":
        return "badge-warning";
      case "CANCELLED":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  if (loading) {
    return <CustomLoading />;
  }

  if (!projectMembers || projectMembers.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <PiFolderOpen size={64} className="text-base-content/30" />
          <p className="text-base-content/60 text-center">
            Not assigned to any project yet
          </p>
          {hasPermission(Permissions.ProjectMemberCreate) ? (
            <button
              onClick={() => handleOpenForm("create")}
              className="btn btn-primary btn-sm gap-2"
            >
              <PiPlus size={18} />
              Assign to Project
            </button>
          ) : null}
        </div>

        {/* Popup Modal */}
        <CustomPopup
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          customWidth="60%"
        >
          {popupOption.form === "projectMember" && (
            <ProjectMemberForm
              userId={userId}
              projectMember={popupOption.data}
              actionType={popupOption.actionType as "create" | "update"}
              onClose={handleCloseForm}
            />
          )}
        </CustomPopup>
      </div>
    );
  }

  const renderProjectCard = (member: IUserProjectMember) => {
    const project = member.project;
    const isOngoing =
      project.status === "ACTIVE" || project.status === "IN_PROGRESS";

    return (
      <div
        key={project.id}
        className="bg-base-100 rounded-lg shadow-sm border border-primary/20 overflow-hidden"
      >
        {/* Project Cover Image */}
        {project.cover && (
          <div className="h-32 overflow-hidden bg-linear-to-r from-primary/20 to-primary/5">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${project.cover}`}
              alt={project.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="p-5 relative">
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            {/* EDIT BUTTON */}
            {hasPermission(Permissions.ProjectMemberUpdate) && (
              <button
                onClick={() => handleOpenForm("update", member)}
                className="btn btn-xs btn-ghost btn-circle text-primary hover:bg-primary/10"
                title="Update Role"
              >
                <PiPencilSimple size={16} />
              </button>
            )}

            {/* DELETE BUTTON */}
            {hasPermission(Permissions.ProjectMemberDelete) && (
              <button
                onClick={() => handleDelete(member)}
                className="btn btn-xs btn-ghost btn-circle text-error hover:bg-error/10"
                title="Remove from Project"
              >
                <PiTrash size={16} />
              </button>
            )}
          </div>

          {/* Project Details */}
          <div className="space-y-3 pr-16">
            {/* Project Name and Status */}
            <div>
              <h4 className="text-lg font-semibold text-primary">
                {project.name}
              </h4>
              <span
                className={`badge badge-sm ${getStatusBadgeClass(
                  project.status,
                )}`}
              >
                {project.status.replace(/_/g, " ")}
              </span>
            </div>

            {/* Description */}
            {project.description && (
              <p className="text-sm text-base-content/80 line-clamp-2">
                {project.description}
              </p>
            )}

            {/* Role */}
            {member.role && (
              <div className="flex items-center gap-2">
                <PiUsers size={16} className="text-base-content/60" />
                <span className="text-sm font-medium text-base-content">
                  Role: {member.role}
                </span>
              </div>
            )}

            {/* Team Size */}
            {project.projectMembers && project.projectMembers.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <PiUsers size={16} />
                <span>Team: {project.projectMembers.length} members</span>
              </div>
            )}

            {/* Project Duration */}
            {(project.startDate || project.endDate) && (
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <PiCalendar size={16} />
                <span>
                  {project.startDate
                    ? moment(project.startDate).format("MMM DD, YYYY")
                    : "N/A"}{" "}
                  -{" "}
                  {isOngoing
                    ? "Present"
                    : project.endDate
                      ? moment(project.endDate).format("MMM DD, YYYY")
                      : "N/A"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Assign Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-base-content">
          Project Assignments
        </h3>
        {hasPermission(Permissions.NoteCreate) ? (
          <button
            onClick={() => handleOpenForm("create")}
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlus size={18} />
            Assign to Project
          </button>
        ) : null}
      </div>

      {/* Active/In Progress Projects */}
      {activeProjects.length > 0 && (
        <div>
          <h4 className="text-base font-semibold text-base-content mb-3">
            Active Projects ({activeProjects.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.map((member) => renderProjectCard(member))}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div>
          <h4 className="text-base font-semibold text-base-content mb-3">
            Completed Projects ({completedProjects.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedProjects.map((member) => renderProjectCard(member))}
          </div>
        </div>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <div>
          <h4 className="text-base font-semibold text-base-content mb-3">
            Other Projects ({otherProjects.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherProjects.map((member) => renderProjectCard(member))}
          </div>
        </div>
      )}

      {/* Popup Modal */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="60%"
      >
        {popupOption.form === "projectMember" && (
          <ProjectMemberForm
            userId={userId}
            projectMember={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={handleCloseForm}
          />
        )}
      </CustomPopup>

      {/* Delete Confirmation Modal */}
    </div>
  );
}
