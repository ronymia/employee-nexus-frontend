import { showToast } from "@/components/ui/CustomToast";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import {
  CREATE_DESIGNATION,
  GET_DESIGNATIONS,
  UPDATE_DESIGNATION,
} from "@/graphql/designation.api";
import { designationSchema, IDesignationFormData } from "@/schemas";
import { useMutation } from "@apollo/client/react";
import { IDesignation } from "@/types";

export default function DesignationForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IDesignation;
}) {
  // MUTATION TO CREATE A NEW
  const [createDesignation, createResult] = useMutation(CREATE_DESIGNATION, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_DESIGNATIONS }],
  });

  // MUTATION TO UPDATE A DESIGNATION
  const [updateDesignation, updateResult] = useMutation(UPDATE_DESIGNATION, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_DESIGNATIONS }],
  });

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IDesignationFormData) => {
    if (data?.id) {
      formValues["id"] = Number(data.id);
      const res = await updateDesignation({
        variables: formValues,
      });
      if (res?.data) {
        showToast.success("Updated!", "Designation updated successfully");
        handleClosePopup?.();
      }
    } else {
      const res = await createDesignation({
        variables: formValues,
      });
      if (res?.data) {
        showToast.success("Created!", "Designation created successfully");
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
      resolver={designationSchema}
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
