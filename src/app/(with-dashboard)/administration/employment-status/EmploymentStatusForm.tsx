"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_EMPLOYMENT_STATUS,
  GET_EMPLOYMENT_STATUSES,
  UPDATE_EMPLOYMENT_STATUS,
} from "@/graphql/employment-status.api";
import { IEmploymentStatusFormData } from "@/schemas";
import { IEmploymentStatus } from "@/types";
import { useMutation } from "@apollo/client/react";

export default function EmploymentStatusForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IEmploymentStatus;
}) {
  // MUTATION TO CREATE A NEW
  const [createEmploymentStatus, createResult] = useMutation(
    CREATE_EMPLOYMENT_STATUS,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_EMPLOYMENT_STATUSES }],
    }
  );
  const [updateEmploymentStatus, updateResult] = useMutation(
    UPDATE_EMPLOYMENT_STATUS,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_EMPLOYMENT_STATUSES }],
    }
  );

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IEmploymentStatusFormData) => {
    if (data?.id) {
      formValues["id"] = Number(data.id);
      await updateEmploymentStatus({
        variables: formValues,
      });
    } else {
      await createEmploymentStatus({
        variables: formValues,
      });
    }
    handleClosePopup?.();
  };

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      defaultValues={data || {}}
      className={`flex flex-col gap-y-3`}
    >
      {/* NAME */}
      <CustomInputField name="name" label="Name" required />
      {/* DESCRIPTION */}
      <CustomTextareaField name="description" label="Description" />

      {/* ACTION BUTTON */}
      <FormActionButton
        cancelHandler={handleClosePopup}
        isPending={createResult.loading || updateResult.loading}
      />
    </CustomForm>
  );
}
