"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import { useFormContext, useWatch } from "react-hook-form";
import { IEmployee } from "@/types";
import { useQuery } from "@apollo/client/react";
import { GET_LEAVE_TYPES } from "@/graphql/leave-types.api";

enum LeaveDuration {
  SINGLE_DAY = "SINGLE_DAY",
  MULTI_DAY = "MULTI_DAY",
  HALF_DAY = "HALF_DAY",
}

interface ILeave {
  id?: number;
  userId: number;
  leaveTypeId: number;
  leaveYear: number;
  leaveDuration: LeaveDuration;
  startDate: string;
  endDate?: string;
  totalHours: number;
  status: string;
  reviewedAt?: string;
  reviewedBy?: number;
  rejectionReason?: string;
  attachments?: string;
  notes?: string;
}

interface LeaveFormProps {
  employees: IEmployee[];
  leave?: ILeave;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function LeaveForm({
  employees,
  leave,
  actionType,
  onClose,
}: LeaveFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Leave Form Submit:", {
      ...data,
      actionType,
    });
    // TODO: Implement GraphQL mutation
    onClose();
  };

  const defaultValues = {
    userId: leave?.userId || "",
    leaveTypeId: leave?.leaveTypeId || "",
    leaveYear: leave?.leaveYear || new Date().getFullYear(),
    leaveDuration: leave?.leaveDuration || LeaveDuration.SINGLE_DAY,
    startDate: leave?.startDate || new Date().toISOString().split("T")[0],
    endDate: leave?.endDate || "",
    attachments: leave?.attachments || "",
    notes: leave?.notes || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <LeaveFormFields employees={employees} actionType={actionType} />
      <FormActionButton isPending={false} cancelHandler={onClose} />
    </CustomForm>
  );
}

function LeaveFormFields({
  employees,
  actionType,
}: {
  employees: IEmployee[];
  actionType: "create" | "update";
}) {
  const { control } = useFormContext();
  const leaveDuration = useWatch({
    control,
    name: "leaveDuration",
    defaultValue: LeaveDuration.SINGLE_DAY,
  });

  // Fetch leave types
  const { data: leaveTypesData } = useQuery<{
    leaveTypes: { data: any[] };
  }>(GET_LEAVE_TYPES);

  const employeeOptions = employees.map((emp) => ({
    label: emp.profile?.fullName || emp.email,
    value: emp.id.toString(),
  }));

  const leaveTypeOptions = (leaveTypesData?.leaveTypes?.data || []).map(
    (type) => ({
      label: type.name,
      value: type.id.toString(),
    })
  );

  const durationOptions = [
    { label: "Single Day", value: LeaveDuration.SINGLE_DAY },
    { label: "Multi Day", value: LeaveDuration.MULTI_DAY },
    { label: "Half Day", value: LeaveDuration.HALF_DAY },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 3 }, (_, i) => ({
    label: (currentYear - 1 + i).toString(),
    value: (currentYear - 1 + i).toString(),
  }));

  return (
    <div className="space-y-4">
      {/* Employee & Leave Type Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            dataAuto="userId"
            name="userId"
            label="Employee"
            placeholder="Select Employee"
            required={true}
            options={employeeOptions}
            disabled={actionType === "update"}
            isLoading={false}
          />
          <CustomSelect
            dataAuto="leaveTypeId"
            name="leaveTypeId"
            label="Leave Type"
            placeholder="Select Leave Type"
            required={true}
            options={leaveTypeOptions}
            isLoading={false}
          />
          <CustomSelect
            dataAuto="leaveYear"
            name="leaveYear"
            label="Leave Year"
            placeholder="Select Year"
            required={true}
            options={yearOptions}
            isLoading={false}
          />
          <CustomSelect
            dataAuto="leaveDuration"
            name="leaveDuration"
            label="Duration Type"
            placeholder="Select Duration"
            required={true}
            options={durationOptions}
            isLoading={false}
          />
        </div>
      </div>

      {/* Date Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Leave Period
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomDatePicker
            dataAuto="startDate"
            name="startDate"
            label="Start Date"
            placeholder="Select Start Date"
            required={true}
          />
          {leaveDuration === LeaveDuration.MULTI_DAY && (
            <CustomDatePicker
              dataAuto="endDate"
              name="endDate"
              label="End Date"
              placeholder="Select End Date"
              required={true}
            />
          )}
        </div>
      </div>

      {/* Attachments */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Supporting Documents
        </h4>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Attachments</span>
          </label>
          <input
            type="file"
            name="attachments"
            className="file-input file-input-bordered w-full"
            data-auto="attachments"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-xs text-base-content/60 mt-1">
            You can upload multiple files (PDF, DOC, DOCX, JPG, PNG)
          </p>
        </div>
      </div>

      {/* Notes */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Additional Information
        </h4>
        <CustomTextareaField
          dataAuto="notes"
          name="notes"
          label="Notes"
          placeholder="Add any additional notes or reason for leave..."
          required={false}
          rows={3}
        />
      </div>
    </div>
  );
}
