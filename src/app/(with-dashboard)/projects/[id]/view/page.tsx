"use client";

import { use, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import {
  GET_PROJECT_BY_ID,
  UNASSIGN_PROJECT_MEMBER,
} from "@/graphql/project.api";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  MdArrowBack,
  MdDelete,
  MdPersonAdd,
  MdCalendarToday,
  MdInfoOutline,
  MdDescription,
} from "react-icons/md";
import { IPopupOption, IProjectMember, IProjectResponse } from "@/types";
import dayjs from "dayjs";
import CustomPopup from "@/components/modal/CustomPopup";
import AssignProjectMemberForm from "./AssignProjectMemberForm";
import useConfirmation from "@/hooks/useConfirmation";

export default function ProjectViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { confirm } = useConfirmation();

  const [popupOption, setPopupOption] = useState<IPopupOption>({
    open: false,
    closeOnDocumentClick: true,
    actionType: "create",
    form: "assign_project_member" as any,
    data: null,
    title: "Assign Project Member",
  });

  // Fetch project details
  const { data, loading } = useQuery<IProjectResponse>(GET_PROJECT_BY_ID, {
    variables: { id: Number(id) },
  });

  const [unassignMember, unassignResult] = useMutation(
    UNASSIGN_PROJECT_MEMBER,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        { query: GET_PROJECT_BY_ID, variables: { id: Number(id) } },
      ],
    },
  );

  const project = data?.projectById?.data;

  const handleUnassignMember = async (
    userId: number,
    fullName: string,
    role: string,
  ) => {
    confirm({
      title: "Unassign Member",
      itemName: fullName,
      itemDescription: "Remove this member from the project teams.",
      confirmButtonText: "Yes, Unassign",
      confirmButtonColor: "#ef4444",
      onConfirm: async () => {
        await unassignMember({
          variables: {
            unassignProjectMemberInput: {
              projectId: Number(id),
              userId: userId,
              role,
            },
          },
        });
      },
      successTitle: "Unassigned!",
      successMessage: "Member has been removed from the project.",
    });
  };

  const handleOpenAssignModal = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "assign_project_member" as any,
      data: null,
      title: "Assign Project Member",
    });
  };

  if (loading) {
    return <CustomLoading />;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 bg-white rounded-lg shadow-sm border m-6">
        <MdInfoOutline className="text-gray-400 w-12 h-12 mb-2" />
        <p className="text-gray-600 font-medium">Project not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 btn btn-primary btn-sm"
        >
          Go Back
        </button>
      </div>
    );
  }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="btn btn-circle btn-ghost btn-md border border-gray-200 hover:bg-white"
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {project.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`badge badge-md font-semibold ${
                  project.status === "complete"
                    ? "badge-success text-white"
                    : project.status === "ongoing"
                      ? "badge-info text-white"
                      : "badge-warning text-white"
                }`}
              >
                {project.status.toUpperCase()}
              </span>
              <span className="text-gray-400 mx-1">•</span>
              <span className="text-sm text-gray-500 font-medium capitalize">
                Started on {dayjs(project.startDate).format("MMM D, YYYY")}
              </span>
            </div>
          </div>
        </div>

        <button onClick={handleOpenAssignModal} className="btn btn-primary">
          <MdPersonAdd size={20} />
          Assign Member
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column - Main Details */}
        <div className="xl:col-span-8 space-y-8">
          {/* Description Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <MdDescription className="text-primary w-6 h-6" />
              <h2 className="text-2xl font-bold text-gray-900">
                Project Description
              </h2>
            </div>
            <div className="prose max-w-none text-gray-600 leading-relaxed text-lg">
              {project.description ? (
                <p>{project.description}</p>
              ) : (
                <p className="italic text-gray-400">
                  No detailed description has been provided for this project.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Secondary Info & Members */}
        <div className="xl:col-span-4 space-y-8">
          {/* Quick Info Dashboard */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MdInfoOutline className="text-primary" />
              Overview
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <MdCalendarToday className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <p className="text-gray-900 font-semibold">
                    {project.startDate
                      ? dayjs(project.startDate).format("DD/MM/YYYY")
                      : "TBD"}
                    {" — "}
                    {project.endDate
                      ? dayjs(project.endDate).format("DD/MM/YYYY")
                      : "Present"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <MdPersonAdd className="text-purple-600 w-5 h-5" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Project Lead / Creator
                  </label>
                  <p className="text-gray-900 font-semibold">
                    {project.creator?.profile?.fullName || "Not assigned"}
                  </p>
                  <span className="text-xs text-gray-500">
                    {project.creator?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Project Team</h3>
              <span className="badge badge-primary badge-outline font-bold">
                {project.projectMembers?.length || 0} Members
              </span>
            </div>

            <div className="space-y-4">
              {project.projectMembers && project.projectMembers.length > 0 ? (
                project.projectMembers.map((member: IProjectMember) => (
                  <div
                    key={member.id}
                    className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-white rounded-full w-10">
                          <span className="text-sm font-bold uppercase">
                            {member.employee?.user?.profile?.fullName?.[0] ||
                              "U"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {member.employee?.user?.profile?.fullName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 bg-white border border-gray-200 rounded-full font-bold text-gray-500 uppercase">
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleUnassignMember(
                          member.userId,
                          member.employee?.user?.profile?.fullName || "Member",
                          member.role,
                        )
                      }
                      className="opacity-0 group-hover:opacity-100 btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10 transition-all"
                      disabled={unassignResult.loading}
                      title="Unassign member"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                    <MdPersonAdd className="text-gray-300 w-8 h-8" />
                  </div>
                  <p className="text-gray-400 font-medium">
                    No members assigned yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Member Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        {popupOption.form === ("assign_project_member" as any) && (
          <AssignProjectMemberForm
            projectId={Number(id)}
            handleClosePopup={() =>
              setPopupOption((prev) => ({ ...prev, open: false }))
            }
          />
        )}
      </CustomPopup>
    </div>
  );
}
