"use client";

import { use, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import {
  GET_PROJECT_BY_ID,
  ASSIGN_PROJECT_MEMBER,
  UNASSIGN_PROJECT_MEMBER,
} from "@/graphql/project.api";
import CustomLoading from "@/components/loader/CustomLoading";
import { MdArrowBack, MdDelete, MdPersonAdd } from "react-icons/md";
import { IProject, IProjectMember } from "@/types";

export default function ProjectViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [memberRole, setMemberRole] = useState("Member");

  const { data, loading, refetch } = useQuery<{
    projectById: {
      data: IProject;
    };
  }>(GET_PROJECT_BY_ID, {
    variables: { id: Number(id) },
  });

  const [assignMember, assignResult] = useMutation(ASSIGN_PROJECT_MEMBER, {
    onCompleted: () => {
      setShowAssignModal(false);
      setSelectedUserId("");
      setMemberRole("Member");
      refetch();
    },
  });

  const [unassignMember, unassignResult] = useMutation(
    UNASSIGN_PROJECT_MEMBER,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );

  const project = data?.projectById?.data;

  const handleAssignMember = async () => {
    if (!selectedUserId) return;
    await assignMember({
      variables: {
        projectId: Number(id),
        userId: Number(selectedUserId),
        role: memberRole,
      },
    });
  };

  const handleUnassignMember = async (userId: number) => {
    if (confirm("Are you sure you want to remove this member?")) {
      await unassignMember({
        variables: {
          projectId: Number(id),
          userId: userId,
        },
      });
    }
  };

  if (loading) {
    return <CustomLoading />;
  }

  if (!project) {
    return (
      <div className="p-6">
        <p>Project not found</p>
      </div>
    );
  }

  const coverImagePath = project?.cover?.startsWith("/assets")
    ? project.cover
    : `/assets/project_cover/${project.cover}.jpg`;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm">
          <MdArrowBack size={20} />
        </button>
        <h1 className="text-2xl font-bold">Project Details</h1>
      </div>

      {/* Project Cover Photo */}
      <div className="mb-6">
        <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={coverImagePath}
            alt={project.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/assets/project_cover/default.jpg";
            }}
          />
        </div>
      </div>

      {/* Project Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Project Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-base font-semibold">{project.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Description
              </label>
              <p className="text-base text-gray-800">
                {project.description || "No description provided"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <p className="text-base">
                  <span
                    className={`badge ${
                      project.status === "complete"
                        ? "badge-success"
                        : project.status === "ongoing"
                        ? "badge-info"
                        : "badge-warning"
                    }`}
                  >
                    {project.status.toUpperCase()}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Business
                </label>
                <p className="text-base">{project.business?.name || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Start Date
                </label>
                <p className="text-base">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  End Date
                </label>
                <p className="text-base">
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Created By
              </label>
              <p className="text-base">
                {project.creator?.profile?.fullName || "Unknown"}
              </p>
            </div>
          </div>
        </div>

        {/* Project Members */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Project Members</h2>
            <button
              onClick={() => setShowAssignModal(true)}
              className="btn btn-primary btn-sm"
            >
              <MdPersonAdd size={18} />
              Assign Member
            </button>
          </div>
          <div className="space-y-3">
            {project.projectMembers && project.projectMembers.length > 0 ? (
              project.projectMembers.map((member: IProjectMember) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {member.user?.profile?.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {member.user?.email}
                    </p>
                    {member.role && (
                      <span className="text-xs badge badge-outline mt-1">
                        {member.role}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnassignMember(member.userId)}
                    className="btn btn-ghost btn-sm text-error"
                    disabled={unassignResult.loading}
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No members assigned yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Assign Member Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Assign Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  User ID
                </label>
                <input
                  type="number"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter user ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="Member">Member</option>
                  <option value="Lead">Lead</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="btn btn-outline flex-1"
                disabled={assignResult.loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignMember}
                className="btn btn-primary flex-1"
                disabled={assignResult.loading || !selectedUserId}
              >
                {assignResult.loading ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
