"use client";

import { useState } from "react";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomInputField from "@/components/form/input/CustomInputField";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_PROJECTS,
  ASSIGN_PROJECT_MEMBER,
  GET_USER_PROJECTS,
} from "@/graphql/project.api";
import { IProject, IUserProjectMember } from "@/types/project.type";

interface ProjectMemberFormProps {
  userId: number;
  projectMember?: IUserProjectMember;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function ProjectMemberForm({
  userId,
  projectMember,
  actionType,
  onClose,
}: ProjectMemberFormProps) {
  // Fetch all projects
  const { data: projectsData, loading: loadingProjects } = useQuery<{
    projects: {
      data: IProject[];
    };
  }>(GET_PROJECTS);

  // Assign project member mutation
  const [assignProjectMember, { loading: assigningProjectMemberLoading }] =
    useMutation(ASSIGN_PROJECT_MEMBER, {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_USER_PROJECTS, variables: { userId } }],
      onCompleted: () => onClose(),
    });

  const handleSubmit = async (data: any) => {
    try {
      const variables = {
        assignProjectMemberInput: {
          projectId: parseInt(data.projectId),
          userId: userId,
          role: data.role || null,
        },
      };

      await assignProjectMember({ variables });
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const defaultValues = {
    projectId: projectMember?.projectId?.toString() || "",
    role: projectMember?.role || "",
  };

  // Map projects to options
  const projectOptions =
    (projectsData as any)?.projects?.data?.map((project: any) => ({
      label: project.name,
      value: project.id.toString(),
    })) || [];

  const roleOptions = [
    { label: "Project Manager", value: "Project Manager" },
    { label: "Team Lead", value: "Team Lead" },
    { label: "Developer", value: "Developer" },
    { label: "Senior Developer", value: "Senior Developer" },
    { label: "Junior Developer", value: "Junior Developer" },
    { label: "Frontend Developer", value: "Frontend Developer" },
    { label: "Backend Developer", value: "Backend Developer" },
    { label: "Full Stack Developer", value: "Full Stack Developer" },
    { label: "UI/UX Designer", value: "UI/UX Designer" },
    { label: "QA Engineer", value: "QA Engineer" },
    { label: "DevOps Engineer", value: "DevOps Engineer" },
    { label: "Business Analyst", value: "Business Analyst" },
    { label: "Scrum Master", value: "Scrum Master" },
    { label: "Product Owner", value: "Product Owner" },
  ];

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <div className="space-y-4">
        {/* Project Selection */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Project Information
          </h4>
          <div className="space-y-4">
            <CustomSelect
              dataAuto="projectId"
              name="projectId"
              label="Select Project"
              placeholder="Choose a project"
              required={true}
              isLoading={loadingProjects}
              options={projectOptions}
              disabled={actionType === "update"}
            />
            {actionType === "update" && (
              <p className="text-xs text-base-content/60">
                Project cannot be changed. Remove and create a new assignment if
                needed.
              </p>
            )}
          </div>
        </div>

        {/* Role Selection */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Role in Project
          </h4>
          <div className="space-y-4">
            <CustomSelect
              dataAuto="role"
              name="role"
              label="Project Role"
              placeholder="Select role in this project"
              required={false}
              isLoading={false}
              options={roleOptions}
            />
            <div className="alert alert-info text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                Specify the employee's role and responsibilities within this
                project.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <FormActionButton
          isPending={assigningProjectMemberLoading}
          cancelHandler={onClose}
        />
      </div>
    </CustomForm>
  );
}
