"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { useFormContext, useWatch } from "react-hook-form";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_WORK_SCHEDULES,
  CREATE_EMPLOYEE_SCHEDULE_ASSIGNMENT,
  UPDATE_EMPLOYEE_SCHEDULE_ASSIGNMENT,
  GET_USER_SCHEDULE_ASSIGNMENTS,
} from "@/graphql/work-schedules.api";
import {
  IWorkSchedule,
  IScheduleAssignment,
} from "@/types/work-schedules.type";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import { useState } from "react";

dayjs.extend(customParseFormat);

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
  const [isPending, setIsPending] = useState(false);

  // Query to get all work schedules
  const { data: schedulesData, loading: schedulesLoading } = useQuery<{
    workSchedules: {
      data: IWorkSchedule[];
    };
  }>(GET_WORK_SCHEDULES);

  // Create mutation
  const [createScheduleAssignment] = useMutation(
    CREATE_EMPLOYEE_SCHEDULE_ASSIGNMENT,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        { query: GET_USER_SCHEDULE_ASSIGNMENTS, variables: { userId } },
      ],
    }
  );

  // Update mutation
  const [updateScheduleAssignment] = useMutation(
    UPDATE_EMPLOYEE_SCHEDULE_ASSIGNMENT,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        { query: GET_USER_SCHEDULE_ASSIGNMENTS, variables: { userId } },
      ],
    }
  );

  const handleSubmit = async (data: any) => {
    try {
      setIsPending(true);

      const startDate = dayjs(data.startDate, "DD-MM-YYYY").toISOString();
      const endDate = data.isCurrent
        ? null
        : data.endDate
        ? dayjs(data.endDate, "DD-MM-YYYY").toISOString()
        : null;

      if (actionType === "create") {
        await createScheduleAssignment({
          variables: {
            createEmployeeScheduleAssignmentInput: {
              userId,
              workScheduleId: parseInt(data.workScheduleId),
              startDate,
              endDate,
              isActive: data.isActive ?? true,
              notes: data.notes || null,
            },
          },
        });
      } else {
        await updateScheduleAssignment({
          variables: {
            id: assignment?.id,
            updateEmployeeScheduleAssignmentInput: {
              workScheduleId: parseInt(data.workScheduleId),
              startDate,
              endDate,
              isActive: data.isActive,
              notes: data.notes || null,
            },
          },
        });
      }

      onClose();
    } catch (error) {
      console.error("Error submitting schedule assignment:", error);
    } finally {
      setIsPending(false);
    }
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
      <ScheduleAssignmentFormFields
        actionType={actionType}
        schedules={schedulesData?.workSchedules?.data || []}
        schedulesLoading={schedulesLoading}
      />
      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
  );
}

function ScheduleAssignmentFormFields({
  actionType,
  schedules,
  schedulesLoading,
}: {
  actionType: "create" | "update";
  schedules: IWorkSchedule[];
  schedulesLoading: boolean;
}) {
  const { control } = useFormContext();
  const isCurrent = useWatch({
    control,
    name: "isCurrent",
    defaultValue: false,
  });

  const workScheduleOptions = schedules
    .filter((schedule) => schedule.status === "ACTIVE")
    .map((schedule) => ({
      label: `${schedule.name} (${schedule.scheduleType})`,
      value: schedule.id.toString(),
    }));

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
            isLoading={schedulesLoading}
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
