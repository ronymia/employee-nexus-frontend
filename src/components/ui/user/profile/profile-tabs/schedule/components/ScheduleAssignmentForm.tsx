"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { useFormContext, useWatch } from "react-hook-form";
import moment from "moment";

interface IWorkSchedule {
  id: number;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  scheduleType: "REGULAR" | "FLEXIBLE" | "SHIFT" | "ROTATIONAL";
  breakType: "PAID" | "UNPAID";
  breakHours: number;
}

interface IScheduleAssignment {
  id: number;
  userId: number;
  workScheduleId: number;
  workSchedule: IWorkSchedule;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
}

interface ScheduleAssignmentFormProps {
  userId: number;
  assignment?: IScheduleAssignment;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function ScheduleAssignmentForm({
  userId,
  assignment,
  actionType,
  onClose,
}: ScheduleAssignmentFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Schedule Assignment Form Submit:", {
      ...data,
      userId,
      actionType,
    });
    // TODO: Implement GraphQL mutation
    onClose();
  };

  const defaultValues = {
    workScheduleId: assignment?.workScheduleId || "",
    startDate: assignment?.startDate
      ? moment(assignment.startDate).format("DD-MM-YYYY")
      : "",
    endDate: assignment?.endDate
      ? moment(assignment.endDate).format("DD-MM-YYYY")
      : "",
    isActive: assignment?.isActive ?? true,
    isCurrent: !assignment?.endDate || false,
    notes: assignment?.notes || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <ScheduleAssignmentFormFields actionType={actionType} />
      <FormActionButton isPending={false} cancelHandler={onClose} />
    </CustomForm>
  );
}

function ScheduleAssignmentFormFields({
  actionType,
}: {
  actionType: "create" | "update";
}) {
  const { control } = useFormContext();
  const isCurrent = useWatch({
    control,
    name: "isCurrent",
    defaultValue: false,
  });

  // TODO: Fetch work schedules from GraphQL
  const workScheduleOptions = [
    { label: "Regular Schedule (9-5)", value: "1" },
    { label: "Shift Schedule (Rotating)", value: "2" },
    { label: "Flexible Schedule", value: "3" },
    { label: "Part-time Schedule", value: "4" },
  ];

  return (
    <div className="space-y-4">
      {/* Schedule Selection */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Work Schedule
        </h4>
        <div className="space-y-4">
          <CustomSelect
            dataAuto="workScheduleId"
            name="workScheduleId"
            label="Select Schedule"
            placeholder="Choose a work schedule"
            required={true}
            isLoading={false}
            options={workScheduleOptions}
          />
          <div className="alert alert-info text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              The selected schedule will define the employee's working hours and
              days.
            </span>
          </div>
        </div>
      </div>

      {/* Assignment Period */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Assignment Period
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomDatePicker
            dataAuto="startDate"
            name="startDate"
            label="Start Date"
            required={true}
            formatDate="DD-MM-YYYY"
            placeholder="Select start date"
          />
          {!isCurrent && (
            <CustomDatePicker
              dataAuto="endDate"
              name="endDate"
              label="End Date"
              required={false}
              formatDate="DD-MM-YYYY"
              placeholder="Select end date"
            />
          )}
          <div className="md:col-span-2">
            <ToggleSwitch
              dataAuto="isCurrent"
              name="isCurrent"
              label="This is the current schedule (no end date)"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      {actionType === "update" && (
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">Status</h4>
          <ToggleSwitch
            dataAuto="isActive"
            name="isActive"
            label="Mark this assignment as active"
          />
          <p className="text-xs text-base-content/60 mt-2">
            Only one schedule assignment can be active at a time. Activating
            this will deactivate other assignments.
          </p>
        </div>
      )}

      {/* Additional Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Additional Information
        </h4>
        <CustomTextareaField
          dataAuto="notes"
          name="notes"
          label="Notes"
          placeholder="Add any notes about this schedule assignment"
          required={false}
          rows={4}
        />
      </div>
    </div>
  );
}
