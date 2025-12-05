"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomFileUploader from "@/components/form/input/CustomFileUploader";
import { useFormContext, useWatch } from "react-hook-form";
import { ILeave, LeaveDuration } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_LEAVE_TYPES } from "@/graphql/leave-types.api";
import { CREATE_LEAVE, LEAVE_REQUEST, UPDATE_LEAVE } from "@/graphql/leave.api";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useAppStore from "@/hooks/useAppStore";

dayjs.extend(customParseFormat);

interface LeaveFormProps {
  leave?: ILeave;
  actionType: "create" | "update";
  onClose: () => void;
  refetch?: () => void;
}

export default function LeaveForm({
  leave,
  actionType,
  onClose,
  refetch,
}: LeaveFormProps) {
  const [isPending, setIsPending] = useState(false);
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [createLeave] = useMutation(LEAVE_REQUEST);
  const [updateLeave] = useMutation(UPDATE_LEAVE);

  // Upload attachments function
  const uploadAttachments = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/assets/upload-file`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${file.name}`);
      }

      const result = await response.json();
      return result.imagePath;
    });

    return Promise.all(uploadPromises);
  };

  // Calculate total hours based on dates and duration
  const calculateTotalHours = (
    startDate: string,
    endDate: string | undefined,
    duration: LeaveDuration
  ): number => {
    if (duration === LeaveDuration.HALF_DAY) {
      return 4;
    }

    if (duration === LeaveDuration.SINGLE_DAY) {
      return 8;
    }

    // MULTI_DAY - calculate days between dates
    if (duration === LeaveDuration.MULTI_DAY && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const days = end.diff(start, "day") + 1; // Include both start and end date
      return days * 8;
    }

    return 8; // Default to single day
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsPending(true);

      // Handle file upload
      let attachmentPaths: string[] = [];
      if (data.attachments && data.attachments instanceof File) {
        const newFiles: File[] = [data.attachments];

        if (newFiles.length > 0) {
          attachmentPaths = await uploadAttachments(newFiles);
          console.log({ attachmentPaths });
        }
      }

      // Calculate total hours
      const totalHours = calculateTotalHours(
        data.startDate,
        data.endDate,
        data.leaveDuration
      );

      // Format dates to ISO 8601
      const startDate = dayjs(data.startDate, "DD-MM-YYYY").toISOString();
      const endDate =
        data.endDate && data.leaveDuration === LeaveDuration.MULTI_DAY
          ? dayjs(data.endDate, "DD-MM-YYYY").toISOString()
          : undefined;

      const input = {
        userId: Number(user?.id),
        leaveTypeId: Number(data.leaveTypeId),
        leaveYear: Number(data.leaveYear),
        leaveDuration: data.leaveDuration,
        startDate,
        endDate,
        totalHours,
        attachments:
          attachmentPaths.length > 0
            ? JSON.stringify(attachmentPaths)
            : leave?.attachments || undefined,
        notes: data.notes || undefined,
      };

      if (actionType === "create") {
        await createLeave({
          variables: {
            createLeaveInput: input,
          },
        });
      } else {
        await updateLeave({
          variables: {
            updateLeaveInput: { ...input, id: Number(leave?.id) },
          },
        });
      }

      refetch?.();
      onClose();
    } catch (error) {
      console.error("Error submitting leave:", error);
    } finally {
      setIsPending(false);
    }
  };

  const defaultValues = {
    leaveTypeId: leave?.leaveTypeId ? Number(leave.leaveTypeId) : "",
    leaveYear: leave?.leaveYear || new Date().getFullYear(),
    leaveDuration: leave?.leaveDuration || LeaveDuration.SINGLE_DAY,
    startDate: leave?.startDate
      ? dayjs(leave.startDate).format("DD-MM-YYYY")
      : dayjs().format("DD-MM-YYYY"),
    endDate: leave?.endDate ? dayjs(leave.endDate).format("DD-MM-YYYY") : "",
    attachments: leave?.attachments ? JSON.parse(leave.attachments)?.at(0) : [],
    notes: leave?.notes || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <LeaveFormFields actionType={actionType} />
      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
  );
}

function LeaveFormFields({ actionType }: { actionType: "create" | "update" }) {
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

  const leaveTypeOptions = (leaveTypesData?.leaveTypes?.data || []).map(
    (type) => ({
      label: type.name,
      value: type.id,
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
    value: currentYear - 1 + i,
  }));

  return (
    <div className="space-y-4">
      {/* Leave Type Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <CustomFileUploader
          name="attachments"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          dataAuto="attachments"
          multiple={true}
        />
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
