import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_JOB_TYPES,
  GET_JOB_TYPES,
  UPDATE_JOB_TYPES,
} from "@/graphql/job-type.api";
import { IJobTypeFormData } from "@/schemas/job-type.schema";
import { IJobType } from "@/types/job-type.type";
import { useMutation } from "@apollo/client/react";

export default function JobTypeForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IJobType;
}) {
  // MUTATION TO CREATE A NEW SUBSCRIPTION PLAN
  const [createJobType, createResult] = useMutation(CREATE_JOB_TYPES, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_JOB_TYPES }],
  });
  const [updateJobType, updateResult] = useMutation(UPDATE_JOB_TYPES, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_JOB_TYPES }],
  });

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IJobTypeFormData) => {
    if (data?.id) {
      formValues["id"] = Number(data.id);
      await updateJobType({
        variables: formValues,
      });
    } else {
      await createJobType({
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
