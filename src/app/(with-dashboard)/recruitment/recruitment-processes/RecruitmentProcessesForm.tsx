import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomRadioButton from "@/components/form/input/CustomRadioButton";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_RECRUITMENT_PROCESSES,
  GET_RECRUITMENT_PROCESSES,
  UPDATE_RECRUITMENT_PROCESSES,
} from "@/graphql/recruitment-processes.api";
import { IRecruitmentProcessFormData } from "@/schemas";
import { IRecruitmentProcess } from "@/types";
import { useMutation } from "@apollo/client/react";

export default function RecruitmentProcessForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IRecruitmentProcess;
}) {
  // MUTATION TO CREATE A NEW RECRUITMENT PROCESS
  const [createRecruitmentProcess, createResult] = useMutation(
    CREATE_RECRUITMENT_PROCESSES,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_RECRUITMENT_PROCESSES }],
    }
  );
  const [updateRecruitmentProcess, updateResult] = useMutation(
    UPDATE_RECRUITMENT_PROCESSES,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_RECRUITMENT_PROCESSES }],
    }
  );

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IRecruitmentProcessFormData) => {
    formValues["isRequired"] =
      Number(formValues.isRequired) === 1 ? true : false;
    if (data?.id) {
      formValues["id"] = Number(data.id);
      await updateRecruitmentProcess({
        variables: formValues,
      });
    } else {
      await createRecruitmentProcess({
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
