"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { useFormContext, useWatch } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_EDUCATION_HISTORY,
  UPDATE_EDUCATION_HISTORY,
  GET_EDUCATION_HISTORY_BY_USER_ID,
} from "@/graphql/education-history.api";
import { IEducationHistory } from "@/types";
import dayjs from "dayjs";
import { showToast } from "@/components/ui/CustomToast";

interface IEducationFormProps {
  userId: number;
  education?: IEducationHistory;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function EducationForm({
  userId,
  education,
  actionType,
  onClose,
}: IEducationFormProps) {
  // ==================== GRAPHQL MUTATIONS ====================
  // CREATE EDUCATION HISTORY MUTATION
  const [createEducation, createResult] = useMutation(
    CREATE_EDUCATION_HISTORY,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        { query: GET_EDUCATION_HISTORY_BY_USER_ID, variables: { userId } },
      ],
    }
  );

  // UPDATE EDUCATION HISTORY MUTATION
  const [updateEducation, updateResult] = useMutation(
    UPDATE_EDUCATION_HISTORY,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        { query: GET_EDUCATION_HISTORY_BY_USER_ID, variables: { userId } },
      ],
    }
  );

  // ==================== FORM SUBMISSION ====================
  const handleSubmit = async (data: any) => {
    try {
      // PREPARE DATE FIELDS
      const processedData = {
        ...data,
        startDate: dayjs(data.startDate, "DD-MM-YYYY").toDate(),
        endDate: data.endDate
          ? dayjs(data.endDate, "DD-MM-YYYY").toDate()
          : null,
      };

      // EXECUTE CREATE OR UPDATE MUTATION
      if (actionType === "create") {
        await createEducation({
          variables: {
            createEducationHistoryInput: {
              ...processedData,
              userId,
            },
          },
        });

        // SUCCESS TOAST FOR CREATE
        showToast.success(
          "Created!",
          "Education history has been added successfully"
        );
      } else {
        await updateEducation({
          variables: {
            updateEducationHistoryInput: {
              ...processedData,
              id: Number(education?.id),
              userId: Number(userId),
            },
          },
        });

        // SUCCESS TOAST FOR UPDATE
        showToast.success(
          "Updated!",
          "Education history has been updated successfully"
        );
      }

      // CLOSE FORM
      onClose();
    } catch (error: any) {
      // ERROR HANDLING
      console.error("Error submitting education:", error);
      showToast.error(
        "Error",
        error.message ||
          `Failed to ${
            actionType === "create" ? "add" : "update"
          } education history`
      );
      throw error;
    }
  };

  // ==================== DEFAULT VALUES ====================
  const defaultValues = {
    // EDUCATION DETAILS
    degree: education?.degree || "",
    fieldOfStudy: education?.fieldOfStudy || "",
    institution: education?.institution || "",

    // LOCATION
    country: education?.country || "",
    city: education?.city || "",

    // DURATION
    startDate: education?.startDate
      ? dayjs(education.startDate).format("DD-MM-YYYY")
      : "",
    endDate: education?.endDate
      ? dayjs(education.endDate).format("DD-MM-YYYY")
      : "",
    isCurrentlyStudying: education?.isCurrentlyStudying || false,

    // ADDITIONAL INFO
    grade: education?.grade || "",
    description: education?.description || "",
  };

  // ==================== RENDER ====================
  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <EducationFormFields />
      <FormActionButton
        isPending={createResult.loading || updateResult.loading}
        cancelHandler={onClose}
      />
    </CustomForm>
  );
}

// ==================== EDUCATION FORM FIELDS COMPONENT ====================
function EducationFormFields() {
  const { control } = useFormContext();

  // WATCH FOR CURRENTLY STUDYING TOGGLE
  const isCurrentlyStudying = useWatch({
    control,
    name: "isCurrentlyStudying",
    defaultValue: false,
  });

  return (
    <div className="space-y-4">
      {/* EDUCATION INFORMATION SECTION */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Education Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DEGREE */}
          <CustomInputField
            dataAuto="degree"
            name="degree"
            type="text"
            label="Degree"
            placeholder="e.g., Bachelor of Science, Master of Arts"
            required={true}
          />

          {/* FIELD OF STUDY */}
          <CustomInputField
            dataAuto="fieldOfStudy"
            name="fieldOfStudy"
            type="text"
            label="Field of Study"
            placeholder="e.g., Computer Science, Business Administration"
            required={true}
          />

          {/* INSTITUTION */}
          <div className="md:col-span-2">
            <CustomInputField
              dataAuto="institution"
              name="institution"
              type="text"
              label="Institution"
              placeholder="Name of school/university"
              required={true}
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
          {!isCurrentlyStudying && (
            <CustomDatePicker
              dataAuto="endDate"
              name="endDate"
              label="End Date"
              required={false}
              // formatDate="MM-YYYY"
            />
          )}

          {/* CURRENTLY STUDYING TOGGLE */}
          <div className="md:col-span-2">
            <ToggleSwitch
              name="isCurrentlyStudying"
              label="Currently Studying"
            />
          </div>
        </div>
      </div>

      {/* ADDITIONAL INFORMATION SECTION */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Additional Information
        </h4>
        <div className="space-y-4">
          {/* GRADE/GPA */}
          <CustomInputField
            dataAuto="grade"
            name="grade"
            type="text"
            label="Grade / GPA"
            placeholder="e.g., 3.8 GPA, First Class, 85%"
            required={false}
          />

          {/* DESCRIPTION */}
          <CustomTextareaField
            dataAuto="description"
            name="description"
            label="Description"
            placeholder="Additional details, achievements, or relevant coursework"
            required={false}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
