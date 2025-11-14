import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomRadioButton from "@/components/form/input/CustomRadioButton";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_ONBOARDING_PROCESSES,
  GET_ONBOARDING_PROCESSES,
  UPDATE_ONBOARDING_PROCESSES,
} from "@/graphql/onboarding-processes.api";
import { IOnboardingProcessFormData } from "@/schemas/onboarding-processes.schema";
import { IOnboardingProcess } from "@/types/onboarding-processes.type";
import { useMutation } from "@apollo/client/react";

export default function OnboardingProcessForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IOnboardingProcess;
}) {
  // MUTATION TO CREATE A NEW ONBOARDING PROCESS
  const [createOnboardingProcess, createResult] = useMutation(
    CREATE_ONBOARDING_PROCESSES,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_ONBOARDING_PROCESSES }],
    }
  );
  const [updateOnboardingProcess, updateResult] = useMutation(
    UPDATE_ONBOARDING_PROCESSES,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_ONBOARDING_PROCESSES }],
    }
  );

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IOnboardingProcessFormData) => {
    formValues["isRequired"] =
      Number(formValues.isRequired) === 1 ? true : false;
    if (data?.id) {
      formValues["id"] = Number(data.id);
      await updateOnboardingProcess({
        variables: formValues,
      });
    } else {
      await createOnboardingProcess({
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
      {/* IS REQUIRED */}
      <CustomRadioButton
        dataAuto="isRequired"
        required
        name="isRequired"
        label="Requirement"
        radioGroupClassName="grid-cols-2"
        options={[
          {
            title: "Yes",
            value: "1",
          },
          {
            title: "No",
            value: "0",
          },
        ]}
      />
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
