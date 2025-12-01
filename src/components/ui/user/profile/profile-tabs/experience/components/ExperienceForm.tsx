"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { useFormContext, useWatch } from "react-hook-form";

interface IJobHistory {
  id: number;
  userId: number;
  jobTitle: string;
  companyName: string;
  employmentType: string;
  country: string;
  city?: string;
  startDate: string;
  endDate?: string;
  responsibilities?: string;
  achievements?: string;
}

interface ExperienceFormProps {
  userId: number;
  jobHistory?: IJobHistory;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function ExperienceForm({
  userId,
  jobHistory,
  actionType,
  onClose,
}: ExperienceFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Experience Form Submit:", {
      ...data,
      userId,
      actionType,
    });
    // TODO: Implement GraphQL mutation
    onClose();
  };

  const defaultValues = {
    jobTitle: jobHistory?.jobTitle || "",
    companyName: jobHistory?.companyName || "",
    employmentType: jobHistory?.employmentType || "",
    country: jobHistory?.country || "",
    city: jobHistory?.city || "",
    startDate: jobHistory?.startDate || "",
    endDate: jobHistory?.endDate || "",
    isCurrentJob: !jobHistory?.endDate || false,
    responsibilities: jobHistory?.responsibilities || "",
    achievements: jobHistory?.achievements || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <ExperienceFormFields />
      <FormActionButton isPending={false} cancelHandler={onClose} />
    </CustomForm>
  );
}

function ExperienceFormFields() {
  const { control } = useFormContext();
  const isCurrentJob = useWatch({
    control,
    name: "isCurrentJob",
    defaultValue: false,
  });

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
      {/* Job Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Job Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInputField
            dataAuto="jobTitle"
            name="jobTitle"
            type="text"
            label="Job Title"
            placeholder="e.g., Software Engineer, Project Manager"
            required={true}
          />
          <CustomInputField
            dataAuto="companyName"
            name="companyName"
            type="text"
            label="Company Name"
            placeholder="Enter company name"
            required={true}
          />
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
          {!isCurrentJob && (
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
              dataAuto="isCurrentJob"
              name="isCurrentJob"
              label="I currently work here"
            />
          </div>
        </div>
      </div>

      {/* Responsibilities and Achievements */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">Details</h4>
        <div className="space-y-4">
          <CustomTextareaField
            dataAuto="responsibilities"
            name="responsibilities"
            label="Responsibilities"
            placeholder="Describe your job responsibilities and duties"
            required={false}
            rows={5}
          />
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
