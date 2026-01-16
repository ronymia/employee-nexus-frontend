"use client";

// ==================== EXTERNAL IMPORTS ====================
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { useFormContext, useWatch } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_JOB_HISTORY,
  UPDATE_JOB_HISTORY,
  GET_JOB_HISTORY_BY_USER_ID,
} from "@/graphql/job-history.api";
import { IJobHistory } from "@/types";
import dayjs from "dayjs";
import { showToast } from "@/components/ui/CustomToast";

// ==================== INTERFACES ====================
interface IExperienceFormProps {
  userId: number;
  jobHistory?: IJobHistory;
  actionType: "create" | "update";
  onClose: () => void;
}

// ==================== MAIN COMPONENT ====================
export default function ExperienceForm({
  userId,
  jobHistory,
  actionType,
  onClose,
}: IExperienceFormProps) {
  // ==================== GRAPHQL MUTATIONS ====================
  // CREATE JOB HISTORY MUTATION
  const [createJobHistory, createResult] = useMutation(CREATE_JOB_HISTORY, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_JOB_HISTORY_BY_USER_ID, variables: { userId } },
    ],
  });

  // UPDATE JOB HISTORY MUTATION
  const [updateJobHistory, updateResult] = useMutation(UPDATE_JOB_HISTORY, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_JOB_HISTORY_BY_USER_ID, variables: { userId } },
    ],
  });

  // ==================== FORM SUBMISSION ====================
  const handleSubmit = async (data: any) => {
    try {
      // PREPARE JOB HISTORY DATA
      const { isCurrentJob, ...jobData } = data;

      // PREPARE DATE FIELDS
      const processedData = {
        ...jobData,
        startDate: dayjs(data.startDate, "DD-MM-YYYY").toDate(),
        endDate: data.endDate
          ? dayjs(data.endDate, "DD-MM-YYYY").toDate()
          : null,
      };

      // EXECUTE CREATE OR UPDATE MUTATION
      if (actionType === "create") {
        await createJobHistory({
          variables: {
            createJobHistoryInput: {
              ...processedData,
              userId,
            },
          },
        });

        // SUCCESS TOAST FOR CREATE
        showToast.success(
          "Created!",
          "Work experience has been added successfully"
        );
      } else {
        await updateJobHistory({
          variables: {
            updateJobHistoryInput: {
              ...processedData,
              id: Number(jobHistory?.id),
              userId: Number(userId),
            },
          },
        });

        // SUCCESS TOAST FOR UPDATE
        showToast.success(
          "Updated!",
          "Work experience has been updated successfully"
        );
      }

      // CLOSE FORM
      onClose();
    } catch (error: any) {
      // ERROR HANDLING
      console.error("Error submitting job history:", error);
      showToast.error(
        "Error",
        error.message ||
          `Failed to ${
            actionType === "create" ? "add" : "update"
          } work experience`
      );
      throw error;
    }
  };

  // ==================== DEFAULT VALUES ====================
  const defaultValues = {
    // JOB DETAILS
    jobTitle: jobHistory?.jobTitle || "",
    companyName: jobHistory?.companyName || "",
    employmentType: jobHistory?.employmentType || "",

    // LOCATION
    country: jobHistory?.country || "",
    city: jobHistory?.city || "",

    // DURATION
    startDate: jobHistory?.startDate
      ? dayjs(jobHistory.startDate).format("DD-MM-YYYY")
      : "",
    endDate: jobHistory?.endDate
      ? dayjs(jobHistory.endDate).format("DD-MM-YYYY")
      : "",
    isCurrentJob: !jobHistory?.endDate || false,

    // ADDITIONAL INFO
    responsibilities: jobHistory?.responsibilities || "",
    achievements: jobHistory?.achievements || "",
  };

  // ==================== RENDER ====================
  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <ExperienceFormFields />
      <FormActionButton
        isPending={createResult.loading || updateResult.loading}
        cancelHandler={onClose}
      />
    </CustomForm>
  );
}

// ==================== EXPERIENCE FORM FIELDS COMPONENT ====================
function ExperienceFormFields() {
  const { control } = useFormContext();

  // WATCH FOR CURRENT JOB TOGGLE
  const isCurrentJob = useWatch({
    control,
    name: "isCurrentJob",
    defaultValue: false,
  });

  // EMPLOYMENT TYPE OPTIONS
  const employmentTypeOptions = [
    { label: "Full-time", value: "Full-time" },
    { label: "Part-time", value: "Part-time" },
    { label: "Contract", value: "Contract" },
    { label: "Freelance", value: "Freelance" },
    { label: "Internship", value: "Internship" },
    { label: "Temporary", value: "Temporary" },
  ];

  return (
    <div className="space-y-4">
      {/* JOB INFORMATION SECTION */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Job Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* JOB TITLE */}
          <CustomInputField
            dataAuto="jobTitle"
            name="jobTitle"
            type="text"
            label="Job Title"
            placeholder="e.g., Software Engineer, Project Manager"
            required={true}
          />

          {/* COMPANY NAME */}
          <CustomInputField
            dataAuto="companyName"
            name="companyName"
            type="text"
            label="Company Name"
            placeholder="Enter company name"
            required={true}
          />

          {/* EMPLOYMENT TYPE */}
          <div className="md:col-span-2">
            <CustomSelect
              dataAuto="employmentType"
              name="employmentType"
              label="Employment Type"
              placeholder="Select employment type"
              required={true}
              isLoading={false}
              options={employmentTypeOptions}
            />
          </div>
        </div>
      </div>

      {/* LOCATION SECTION */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">Location</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* COUNTRY */}
          <CustomInputField
            dataAuto="country"
            name="country"
            type="text"
            label="Country"
            placeholder="Enter country"
            required={true}
          />

          {/* CITY */}
          <CustomInputField
            dataAuto="city"
            name="city"
            type="text"
            label="City"
            placeholder="Enter city"
            required={false}
          />
        </div>
      </div>

      {/* DURATION SECTION */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">Duration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* START DATE */}
          <CustomDatePicker
            dataAuto="startDate"
            name="startDate"
            label="Start Date"
            required={true}
            // formatDate="MM-YYYY"
          />

          {/* END DATE - CONDITIONAL */}
          {!isCurrentJob && (
            <CustomDatePicker
              dataAuto="endDate"
              name="endDate"
              label="End Date"
              required={false}
              // formatDate="MM-YYYY"
            />
          )}

          {/* CURRENT JOB TOGGLE */}
          <div className="md:col-span-2">
            <ToggleSwitch name="isCurrentJob" label="I currently work here" />
          </div>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">Details</h4>
        <div className="space-y-4">
          {/* RESPONSIBILITIES */}
          <CustomTextareaField
            dataAuto="responsibilities"
            name="responsibilities"
            label="Responsibilities"
            placeholder="Describe your job responsibilities and duties"
            required={false}
            rows={5}
          />

          {/* ACHIEVEMENTS */}
          <CustomTextareaField
            dataAuto="achievements"
            name="achievements"
            label="Achievements"
            placeholder="Describe key achievements and accomplishments"
            required={false}
            rows={5}
          />
        </div>
      </div>
    </div>
  );
}
