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
import { IProjectFormData, projectSchema } from "@/schemas";
import { IProject } from "@/types";
import { useMutation } from "@apollo/client/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { showToast } from "@/components/ui/CustomToast";

dayjs.extend(customParseFormat);

// ==================== STATUS OPTIONS ====================
const STATUS_OPTIONS = [
  { value: "planning", label: "Planning" },
  { value: "ongoing", label: "Ongoing" },
  { value: "complete", label: "Complete" },
];

// ==================== PROJECTS FORM COMPONENT ====================
export default function ProjectsForm({
  handleClosePopup,
  data,
}: {
  handleClosePopup: () => void;
  data: IProject;
}) {
  // ==================== GRAPHQL MUTATIONS ====================
  // CREATE PROJECT MUTATION
  const [createProject, createResult] = useMutation(CREATE_PROJECT, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  // UPDATE PROJECT MUTATION
  const [updateProject, updateResult] = useMutation(UPDATE_PROJECT, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  // ==================== FORM SUBMISSION HANDLER ====================
  const handleOnSubmit = async (formValues: IProjectFormData) => {
    // UPDATE EXISTING PROJECT
    if (data?.id) {
      formValues["id"] = Number(data.id);
      const res = await updateProject({
        variables: {
          updateProjectInput: {
            ...formValues,
            startDate: formValues.startDate
              ? dayjs(formValues.startDate, "DD-MM-YYYY").toDate()
              : "",
            endDate: formValues.endDate
              ? dayjs(formValues.endDate, "DD-MM-YYYY").toDate()
              : undefined,
          },
        },
      });
      if (res?.data) {
        showToast.success("Updated!", "Project updated successfully");
        handleClosePopup?.();
      }
    }
    // CREATE NEW PROJECT
    else {
      const res = await createProject({
        variables: {
          createProjectInput: {
            ...formValues,
            startDate: formValues.startDate
              ? dayjs(formValues.startDate, "DD-MM-YYYY").toDate()
              : "",
            endDate: formValues.endDate
              ? dayjs(formValues.endDate, "DD-MM-YYYY").toDate()
              : undefined,
          },
        },
      });
      if (res?.data) {
        showToast.success("Created!", "Project created successfully");
        handleClosePopup?.();
      }
    }
  };

  // ==================== DEFAULT FORM VALUES ====================
  const defaultValues = {
    name: data?.name || "",
    description: data?.description || "",
    status: data?.status || "",
    startDate: data?.startDate
      ? dayjs(data.startDate).format("DD-MM-YYYY")
      : "",
    endDate: data?.endDate ? dayjs(data.endDate).format("DD-MM-YYYY") : "",
  };

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      resolver={projectSchema}
      defaultValues={defaultValues}
      className={`flex flex-col gap-y-3`}
    >
      {/* NAME */}
      <CustomInputField name="name" label="Name" required />

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
        // formatDate={`YYYY-MM-DD`}
      />
      {/* END DATE */}
      <CustomDatePicker
        name="endDate"
        label="End Date"
        dataAuto="project-end-date"
        required={false}
        // formatDate={`YYYY-MM-DD`}
      />

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
