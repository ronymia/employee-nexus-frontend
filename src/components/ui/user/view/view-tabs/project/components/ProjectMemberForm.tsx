"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_PROJECTS,
  ASSIGN_PROJECT_MEMBER,
  GET_USER_PROJECTS,
} from "@/graphql/project.api";
import { IProject, IUserProjectMember } from "@/types/project.type";
import dayjs from "dayjs";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { PROJECT_ROLE_OPTIONS } from "@/constants/project.constant";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

interface IProjectMemberFormProps {
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
}: IProjectMemberFormProps) {
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
          startDate: data.startDate
            ? dayjs.utc(data.startDate, "DD-MM-YYYY").toISOString()
            : null,
          endDate: data.endDate
            ? dayjs.utc(data.endDate, "DD-MM-YYYY").toISOString()
            : null,
          isActive: true, // Always true for new assignments
          remarks: data.remarks || null,
          notes: data.notes || null,
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
    startDate: projectMember?.startDate
      ? dayjs.utc(projectMember.startDate).format("DD-MM-YYYY")
      : dayjs().format("DD-MM-YYYY"),
    endDate: projectMember?.endDate
      ? dayjs.utc(projectMember.endDate).format("DD-MM-YYYY")
      : "",
    remarks: projectMember?.remarks || "",
    notes: projectMember?.notes || "",
  };

  // Map projects to options
  const projectOptions =
    (projectsData as any)?.projects?.data?.map((project: any) => ({
      label: project.name,
      value: project.id.toString(),
    })) || [];

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <div className="space-y-4">
        {/* Project Information */}
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

        {/* Role & Dates */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Role & Duration
          </h4>
          <div className="space-y-4">
            <CustomSelect
              dataAuto="role"
              name="role"
              label="Project Role"
              placeholder="Select role in this project"
              required={false}
              isLoading={false}
              options={PROJECT_ROLE_OPTIONS}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomDatePicker
                dataAuto="startDate"
                name="startDate"
                label="Start Date"
                placeholder="Select start date"
                required={true}
              />
              <CustomDatePicker
                dataAuto="endDate"
                name="endDate"
                label="End Date"
                placeholder="Select end date (optional)"
                required={false}
              />
            </div>
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
              <span>Leave end date empty for ongoing assignments.</span>
            </div>
          </div>
        </div>

        {/* Remarks & Notes */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Additional Information
          </h4>
          <div className="space-y-4">
            <CustomTextareaField
              dataAuto="remarks"
              name="remarks"
              label="Remarks"
              placeholder="Any special remarks or conditions..."
              required={false}
              rows={2}
            />
            <CustomTextareaField
              dataAuto="notes"
              name="notes"
              label="Notes"
              placeholder="Internal notes about this assignment..."
              required={false}
              rows={2}
            />
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
