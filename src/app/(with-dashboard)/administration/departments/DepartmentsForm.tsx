import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import {
  CREATE_DEPARTMENT,
  GET_DEPARTMENTS,
  GET_USERS,
  UPDATE_DEPARTMENT,
} from "@/graphql/departments.api";
import { GET_BUSINESSES } from "@/graphql/business.api";
import { IDepartmentFormData } from "@/schemas";
import { IDepartment, IUser } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";

export default function DepartmentsForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IDepartment;
}) {
  // GET BUSINESSES FOR DROPDOWN
  const { data: businessesData, loading: businessesLoading } = useQuery<{
    businesses: {
      data: {
        id: number;
        name: string;
      }[];
    };
  }>(GET_BUSINESSES, {});

  // GET USERS FOR MANAGER DROPDOWN
  const { data: usersData, loading: usersLoading } = useQuery<{
    users: {
      data: IUser[];
    };
  }>(GET_USERS, {});

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
  const [updateDepartment, updateResult] = useMutation(UPDATE_DEPARTMENT, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_DEPARTMENTS }],
  });

  // BUSINESSES OPTIONS FOR DROPDOWN
  const businessesOptions =
    businessesData?.businesses?.data?.map((business) => ({
      label: business.name,
      value: Number(business.id),
    })) || [];

  // USERS OPTIONS FOR MANAGER DROPDOWN
  const usersOptions =
    usersData?.users?.data?.map((user) => ({
      label: user.profile?.fullName || user.name,
      value: Number(user.id),
    })) || [];

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
        variables: formValues,
      });
    } else {
      await createDepartment({
        variables: formValues,
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
          status: "ACTIVE",
          parentId: undefined,
          businessId: undefined,
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
      <CustomSelect
        position="top"
        name="managerId"
        label="Manager"
        dataAuto="managerId"
        isLoading={usersLoading}
        options={usersOptions}
        placeholder="Select manager (optional)"
        required={false}
      />

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
