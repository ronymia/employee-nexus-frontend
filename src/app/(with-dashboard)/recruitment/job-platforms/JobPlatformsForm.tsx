import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_JOB_PLATFORMS,
  GET_JOB_PLATFORMS,
  UPDATE_JOB_PLATFORMS,
} from "@/graphql/job-platforms.api";
import { IJobPlatformsFormData } from "@/schemas";
import { IJobType } from "@/types/job-type.type";
import { useMutation } from "@apollo/client/react";

export default function JobPlatformsForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IJobType;
}) {
  // MUTATION TO CREATE A NEW SUBSCRIPTION PLAN
  const [createJobPlatforms, createResult] = useMutation(CREATE_JOB_PLATFORMS, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_JOB_PLATFORMS }],
  });
  const [updateJobPlatforms, updateResult] = useMutation(UPDATE_JOB_PLATFORMS, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_JOB_PLATFORMS }],
  });

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IJobPlatformsFormData) => {
    if (data?.id) {
      formValues["id"] = Number(data.id);
      await updateJobPlatforms({
        variables: formValues,
      });
    } else {
      await createJobPlatforms({
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
