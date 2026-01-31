"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  ASSIGN_PROJECT_MEMBER,
  GET_PROJECT_BY_ID,
} from "@/graphql/project.api";
import { GET_USERS } from "@/graphql/user.api";
import { useMutation, useQuery } from "@apollo/client/react";
import * as z from "zod";
import { IUser } from "@/types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { PROJECT_ROLE_OPTIONS } from "@/constants/project.constant";

dayjs.extend(utc);

interface IAssignProjectMemberFormProps {
  projectId: number;
  handleClosePopup: () => void;
}

const assignMemberSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  role: z.string().min(1, "Please select a role"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  remarks: z.string().optional(),
  notes: z.string().optional(),
});

type IAssignMemberFormData = z.infer<typeof assignMemberSchema>;

export default function AssignProjectMemberForm({
  projectId,
  handleClosePopup,
}: IAssignProjectMemberFormProps) {
  // Fetch all users
  const { data: usersData, loading: usersLoading } = useQuery<{
    users: {
      data: IUser[];
    };
  }>(GET_USERS, {
    variables: {
      query: {
        projectId: Number(projectId),
        isProjectAssociated: false,
      },
    },
  });

  // Assign member mutation
  const [assignMember, assignResult] = useMutation(ASSIGN_PROJECT_MEMBER, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_PROJECT_BY_ID, variables: { id: projectId } },
    ],
  });

  const handleSubmit = async (formValues: IAssignMemberFormData) => {
    await assignMember({
      variables: {
        assignProjectMemberInput: {
          projectId: Number(projectId),
          userId: Number(formValues.userId),
          role: formValues.role,
          startDate: dayjs
            .utc(formValues.startDate, "DD-MM-YYYY")
            .toISOString(),
          endDate: formValues.endDate
            ? dayjs.utc(formValues.endDate, "DD-MM-YYYY").toISOString()
            : undefined,
          remarks: formValues.remarks,
          notes: formValues.notes,
          isActive: true,
        },
      },
    }).then(() => {
      handleClosePopup();
    });
  };

  // Prepare user options
  const userOptions =
    usersData?.users?.data?.map((user) => ({
      value: user.id.toString(),
      label: `${user.profile?.fullName || user.email} (${user.email})`,
    })) || [];

  return (
    <CustomForm
      submitHandler={handleSubmit}
      resolver={assignMemberSchema}
      defaultValues={{
        userId: "",
        role: "Member",
        startDate: dayjs().format("DD-MM-YYYY"),
        endDate: "",
        remarks: "",
        notes: "",
      }}
      className="flex flex-col gap-4 p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelect
          name="userId"
          label="Select User"
          options={userOptions}
          placeholder="Choose a user"
          dataAuto="assign-user"
          required
          isLoading={usersLoading}
        />

        <CustomSelect
          name="role"
          label="Role"
          options={PROJECT_ROLE_OPTIONS}
          placeholder="Select role"
          dataAuto="assign-role"
          required
          isLoading={false}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomDatePicker
          name="startDate"
          label="Start Date"
          required={true}
          dataAuto="assign-start-date"
        />

        <CustomDatePicker
          name="endDate"
          label="End Date"
          dataAuto="assign-end-date"
          placeholder="Optional"
          required={false}
        />
      </div>

      <CustomTextareaField
        name="remarks"
        label="Remarks"
        placeholder="Any specific remarks..."
        rows={2}
      />

      <CustomTextareaField
        name="notes"
        label="Notes"
        placeholder="Additional notes..."
        rows={2}
      />

      <FormActionButton
        isPending={assignResult.loading}
        cancelHandler={handleClosePopup}
      />
    </CustomForm>
  );
}
