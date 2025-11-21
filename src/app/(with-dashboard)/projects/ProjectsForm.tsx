import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import {
  CREATE_PROJECT,
  GET_PROJECTS,
  UPDATE_PROJECT,
} from "@/graphql/project.api";
import { ProjectFormData } from "@/schemas";
import { Project } from "@/types";
import { useMutation } from "@apollo/client/react";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "ongoing", label: "Ongoing" },
  { value: "complete", label: "Complete" },
];

export default function ProjectsForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: Project;
}) {
  // MUTATION TO CREATE A NEW PROJECT
  const [createProject, createResult] = useMutation(CREATE_PROJECT, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_PROJECTS }],
  });
  const [updateProject, updateResult] = useMutation(UPDATE_PROJECT, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: ProjectFormData) => {
    if (data?.id) {
      (formValues as any)["id"] = Number(data.id);
      await updateProject({
        variables: formValues,
      });
    } else {
      await createProject({
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
      {/* COVER */}
      <CustomInputField
        name="cover"
        label="Cover Image URL"
        placeholder="e.g., /uploads/images/project-cover.jpg"
        required
      />
      {/* STATUS */}
      <CustomSelect
        name="status"
        label="Status"
        options={STATUS_OPTIONS}
        placeholder="Select Status"
        dataAuto="project-status"
        required={true}
        isLoading={false}
      />
      {/* START DATE */}
      <CustomDatePicker
        name="startDate"
        label="Start Date"
        dataAuto="project-start-date"
        required={true}
      />
      {/* END DATE */}
      <CustomDatePicker
        name="endDate"
        label="End Date"
        dataAuto="project-end-date"
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
