"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { useFormContext, useWatch } from "react-hook-form";

interface IEducationHistory {
  id: number;
  userId: number;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  country: string;
  city?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  grade?: string;
  description?: string;
}

interface EducationFormProps {
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
}: EducationFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Education Form Submit:", {
      ...data,
      userId,
      actionType,
    });
    // TODO: Implement GraphQL mutation
    onClose();
  };

  const defaultValues = {
    degree: education?.degree || "",
    fieldOfStudy: education?.fieldOfStudy || "",
    institution: education?.institution || "",
    country: education?.country || "",
    city: education?.city || "",
    startDate: education?.startDate || "",
    endDate: education?.endDate || "",
    isCurrentlyStudying: education?.isCurrentlyStudying || false,
    grade: education?.grade || "",
    description: education?.description || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <EducationFormFields />
      <FormActionButton isPending={false} cancelHandler={onClose} />
    </CustomForm>
  );
}

function EducationFormFields() {
  const { control } = useFormContext();
  const isCurrentlyStudying = useWatch({
    control,
    name: "isCurrentlyStudying",
    defaultValue: false,
  });

  return (
    <div className="space-y-4">
      {/* Education Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Education Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInputField
            dataAuto="degree"
            name="degree"
            type="text"
            label="Degree"
            placeholder="e.g., Bachelor of Science, Master of Arts"
            required={true}
          />
          <CustomInputField
            dataAuto="fieldOfStudy"
            name="fieldOfStudy"
            type="text"
            label="Field of Study"
            placeholder="e.g., Computer Science, Business Administration"
            required={true}
          />
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

      {/* Location */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">Location</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInputField
            dataAuto="country"
            name="country"
            type="text"
            label="Country"
            placeholder="Enter country"
            required={true}
          />
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

      {/* Duration */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">Duration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInputField
            dataAuto="startDate"
            name="startDate"
            type="text"
            label="Start Date"
            placeholder="MM-YYYY or YYYY"
            required={true}
          />
          {!isCurrentlyStudying && (
            <CustomInputField
              dataAuto="endDate"
              name="endDate"
              type="text"
              label="End Date"
              placeholder="MM-YYYY or YYYY"
              required={false}
            />
          )}
          <div className="md:col-span-2">
            <ToggleSwitch
              dataAuto="isCurrentlyStudying"
              name="isCurrentlyStudying"
              label="Currently Studying"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Additional Information
        </h4>
        <div className="space-y-4">
          <CustomInputField
            dataAuto="grade"
            name="grade"
            type="text"
            label="Grade / GPA"
            placeholder="e.g., 3.8 GPA, First Class, 85%"
            required={false}
          />
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
