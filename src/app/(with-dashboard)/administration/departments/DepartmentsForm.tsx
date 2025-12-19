import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import ManagerSelect from "@/components/form/input/ManagerSelect";
import {
  CREATE_DEPARTMENT,
  GET_DEPARTMENTS,
  UPDATE_DEPARTMENT,
} from "@/graphql/departments.api";
import { GET_BUSINESSES } from "@/graphql/business.api";
import { IDepartmentFormData } from "@/schemas";
import { IDepartment } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";

export default function DepartmentsForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IDepartment;
}) {
  // GET DEPARTMENTS FOR PARENT DROPDOWN
  const { data: departmentsData, loading: departmentsLoading } = useQuery<{
    departments: {
      data: IDepartment[];
    };
  }>(GET_DEPARTMENTS, {});

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

  // DEPARTMENTS OPTIONS FOR PARENT DROPDOWN (exclude current department and its children)
  const departmentsOptions =
    departmentsData?.departments?.data
      ?.filter((dept) => dept.id !== data?.id) // Exclude current department
      ?.map((dept) => ({
        label: dept.name,
        value: Number(dept.id),
      })) || [];

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IDepartmentFormData) => {
    if (data?.id) {
      formValues["id"] = Number(data.id);
      await updateDepartment({
        variables: {
          updateDepartmentInput: formValues,
        },
      });
    } else {
      await createDepartment({
        variables: {
          createDepartmentInput: formValues,
        },
      });
    }
    handleClosePopup?.();
  };

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      defaultValues={
        data || {
          name: "",
          description: "",
          parentId: undefined,
          managerId: undefined,
        }
      }
      className={`flex flex-col gap-y-3`}
    >
      {/* NAME */}
      <CustomInputField name="name" label="Name" required />

      {/* PARENT DEPARTMENT - DROPDOWN */}
      <CustomSelect
        position="top"
        name="parentId"
        label="Parent Department"
        dataAuto="parentId"
        isLoading={departmentsLoading}
        options={departmentsOptions}
        placeholder="Select parent department (optional)"
        required={false}
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
