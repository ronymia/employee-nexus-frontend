import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_DESIGNATION,
  UPDATE_DESIGNATION,
} from "@/graphql/designation.api";
import { GET_JOB_TYPES } from "@/graphql/job-type.api";
import { IDesignationFormData } from "@/schemas/designation.schema";
import { IJobType } from "@/types/job-type.type";
import { useMutation } from "@apollo/client/react";

export default function DesignationForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IJobType;
}) {
  // MUTATION TO CREATE A NEW
  const [createDesignation, createResult] = useMutation(CREATE_DESIGNATION, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_JOB_TYPES }],
  });
  const [updateDesignation, updateResult] = useMutation(UPDATE_DESIGNATION, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_JOB_TYPES }],
  });

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IDesignationFormData) => {
    if (data?.id) {
      formValues["id"] = Number(data.id);
      await updateDesignation({
        variables: formValues,
      });
    } else {
      await createDesignation({
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
      <CustomTextareaField
        name="description"
        label="Description"
        required={false}
      />

      {/* ACTION BUTTON */}
      <FormActionButton
        cancelHandler={handleClosePopup}
        isPending={createResult.loading || updateResult.loading}
      />
    </CustomForm>
  );
}
