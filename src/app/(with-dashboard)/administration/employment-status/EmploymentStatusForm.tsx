"use client";

import { showToast } from "@/components/ui/CustomToast";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_EMPLOYMENT_STATUS,
  GET_EMPLOYMENT_STATUSES,
  UPDATE_EMPLOYMENT_STATUS,
} from "@/graphql/employment-status.api";
import { employmentStatusSchema, IEmploymentStatusFormData } from "@/schemas";
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

  // MUTATION TO UPDATE AN EXISTING
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
      const res = await updateEmploymentStatus({
        variables: formValues,
      });
      if (res?.data) {
        showToast.success("Updated!", "Employment status updated successfully");
        handleClosePopup?.();
      }
    } else {
      const res = await createEmploymentStatus({
        variables: formValues,
      });
      if (res?.data) {
        showToast.success("Created!", "Employment status created successfully");
        handleClosePopup?.();
      }
    }
  };

  const defaultValues = {
    name: data?.name || "",
    description: data?.description || "",
  };

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      resolver={employmentStatusSchema}
      defaultValues={defaultValues}
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
