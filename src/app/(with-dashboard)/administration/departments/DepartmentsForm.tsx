import { showToast } from "@/components/ui/CustomToast";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import ManagerSelect from "@/components/input-fields/ManagerSelect";
import {
  CREATE_DEPARTMENT,
  GET_DEPARTMENTS,
  UPDATE_DEPARTMENT,
} from "@/graphql/departments.api";
import { departmentSchema, IDepartmentFormData } from "@/schemas";
import { IDepartment } from "@/types";
import { useMutation } from "@apollo/client/react";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import { DepartmentSelect } from "@/components/input-fields";

export default function DepartmentsForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IDepartment;
}) {
  // MUTATION TO CREATE A NEW DEPARTMENT
  const [createDepartment, createResult] = useMutation(CREATE_DEPARTMENT, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_DEPARTMENTS }],
  });

  // MUTATION TO UPDATE A DEPARTMENT
  const [updateDepartment, updateResult] = useMutation(UPDATE_DEPARTMENT, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_DEPARTMENTS }],
  });

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IDepartmentFormData) => {
    try {
      if (data?.id) {
        formValues["id"] = Number(data.id);
        const res = await updateDepartment({
          variables: {
            updateDepartmentInput: formValues,
          },
        });
        if (res?.data) {
          showToast.success("Updated!", "Department updated successfully");
          handleClosePopup?.();
        }
      } else {
        const res = await createDepartment({
          variables: {
            createDepartmentInput: formValues,
          },
        });
        if (res?.data) {
          showToast.success("Created!", "Department created successfully");
        }
        handleClosePopup?.();
      }
    } catch (error: any) {
      showToast.error(
        "Error",
        error.message ||
          `Failed to ${data?.id ? "update" : "create"} department`
      );
      throw error;
    }
  };

  // DEFAULT VALUES FOR FORM
  const defaultValues = {
    name: data?.name || "",
    description: data?.description || "",
    parentId: data?.parentId || undefined,
    managerId: data?.managerId || undefined,
  };

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      resolver={departmentSchema}
      defaultValues={defaultValues}
      className={`flex flex-col gap-y-3`}
    >
      {/* NAME */}
      <CustomInputField name="name" label="Name" required />

      {/* PARENT DEPARTMENT - DROPDOWN */}
      <DepartmentSelect
        name={"parentId"}
        label={"Parent Department"}
        required={false}
        placeholder="Select parent department (optional)"
      />

      {/* MANAGER - DROPDOWN */}
      <ManagerSelect />

      {/* DESCRIPTION */}
      <CustomTextareaField name="description" label="Description" required />

      {/* ACTION BUTTON */}
      <FormActionButton
        cancelHandler={handleClosePopup}
        isPending={createResult.loading || updateResult.loading}
      />
    </CustomForm>
  );
}
