"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import {
  ASSIGN_PROJECT_MEMBER,
  GET_PROJECT_BY_ID,
} from "@/graphql/project.api";
import { GET_USERS } from "@/graphql/user.api";
import { useMutation, useQuery } from "@apollo/client/react";
import * as z from "zod";
import { IUser } from "@/types";

interface AssignProjectMemberFormProps {
  projectId: number;
  handleClosePopup: () => void;
}

const assignMemberSchema = z.object({
  userId: z.coerce.number().min(1, "Please select a user"),
  role: z.string().nonempty("Please select a role"),
});

type AssignMemberFormData = z.infer<typeof assignMemberSchema>;

const ROLE_OPTIONS = [
  { value: "Member", label: "Member" },
  { value: "Lead", label: "Lead" },
  { value: "Manager", label: "Manager" },
  { value: "Developer", label: "Developer" },
  { value: "Designer", label: "Designer" },
  { value: "Tester", label: "Tester" },
];

export default function AssignProjectMemberForm({
  projectId,
  handleClosePopup,
}: AssignProjectMemberFormProps) {
  // Fetch all users
  const { data: usersData, loading: usersLoading } = useQuery<{
    users: {
      data: IUser[];
    };
  }>(GET_USERS);

  // Assign member mutation
  const [assignMember, assignResult] = useMutation(ASSIGN_PROJECT_MEMBER, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_PROJECT_BY_ID, variables: { id: projectId } },
    ],
  });

  const handleSubmit = async (formValues: AssignMemberFormData) => {
    await assignMember({
      variables: {
        assignProjectMemberInput: {
          projectId: projectId,
          userId: formValues.userId,
          role: formValues.role,
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
      }}
      className="flex flex-col gap-4 p-4"
    >
      <CustomSelect
        name="userId"
        label="Select User"
        options={userOptions}
        placeholder="Choose a user to assign"
        dataAuto="assign-user"
        required
        isLoading={usersLoading}
      />

      <CustomSelect
        name="role"
        label="Role"
        options={ROLE_OPTIONS}
        placeholder="Select member role"
        dataAuto="assign-role"
        required
        isLoading={false}
      />

      <FormActionButton
        isPending={assignResult.loading}
        cancelHandler={handleClosePopup}
      />
    </CustomForm>
  );
}
