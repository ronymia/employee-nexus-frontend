"use client";
import { useState } from "react";
import { IBusinessSchedule } from "@/types";
import {
  convertTo12HourFormat,
  generateWeekDays,
} from "@/utils/date-time.utils";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import FormActionButton from "@/components/form/FormActionButton";
import { UPDATE_BUSINESS_SCHEDULE } from "@/graphql/business.api";
import { useMutation } from "@apollo/client/react";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import useAppStore from "@/stores/appStore";
import * as z from "zod";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import CustomTimeInput from "@/components/form/input/CustomTimeInput";
import BulkScheduleUpdateForm from "./BulkScheduleUpdateForm";

interface BusinessSettingsScheduleProps {
  businessSchedules: IBusinessSchedule[];
}

const scheduleSchema = z.object({
  startTime: z.string().nonempty("Start time is required"),
  endTime: z.string().nonempty("End time is required"),
  isWeekend: z.boolean(),
});

export default function BusinessSettingsSchedule({
  businessSchedules,
}: BusinessSettingsScheduleProps) {
  const { popupOption, setPopupOption } = usePopupOption();
  const { user } = useAppStore((state) => state);
  const { hasPermission } = usePermissionGuard();
  const [selectedSchedule, setSelectedSchedule] =
    useState<IBusinessSchedule | null>(null);

  const [updateBusinessSchedule, updateResult] = useMutation(
    UPDATE_BUSINESS_SCHEDULE,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        { query: GET_BUSINESS_BY_ID, variables: { id: user.businessId } },
      ],
    }
  );

  const now = new Date();

  // Generate default schedule if empty (Monday to Sunday, 9 AM to 5 PM, Sunday closed)
  const defaultSchedules: IBusinessSchedule[] = Array.from(
    { length: 7 },
    (_, index) => ({
      id: index,
      businessId: user.businessId,
      day: index.toString(),
      startTime: "09:00",
      endTime: "17:00",
      isWeekend: index === 0, // Sunday is weekend
    })
  );

  // Use provided schedules or default
  const displaySchedules =
    businessSchedules && businessSchedules.length > 0
      ? businessSchedules
      : defaultSchedules;

  const handleEditClick = (schedule: IBusinessSchedule) => {
    setSelectedSchedule(schedule);
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "",
      data: schedule,
      title: `Edit ${
        generateWeekDays({ startOfWeekDay: 0 })[Number(schedule.day)]?.name
      } Schedule`,
    });
  };

  const handleSubmit = async (formValues: any) => {
    if (!selectedSchedule) return;

    await updateBusinessSchedule({
      variables: {
        updateBusinessScheduleInput: {
          id: selectedSchedule.id,
          day: Number(selectedSchedule.day),
          startTime: formValues.startTime,
          endTime: formValues.endTime,
          isWeekend: formValues.isWeekend,
        },
      },
    }).then(() => {
      setPopupOption((prev) => ({ ...prev, open: false }));
      setSelectedSchedule(null);
    });
  };
  return (
    <div className={`max-w-3xl mx-auto p-4 space-y-4`}>
      {/* Weekly schedule table */}
      <div className={`bg-white p-4 rounded-lg shadow`}>
        <div className={`flex items-center justify-between mb-3`}>
          <h3 className="text-lg font-semibold mb-3">Weekly Hours</h3>
          {hasPermission(Permissions.WorkScheduleUpdate) && (
            <button
              onClick={() => {
                setPopupOption({
                  open: true,
                  closeOnDocumentClick: true,
                  actionType: "update",
                  form: "bulk_schedule",
                  data: displaySchedules,
                  title: "Update All Schedules",
                });
              }}
              className="btn btn-primary btn-sm bg-linear-to-tl to-primary shadow-md from-primary"
            >
              Update All
            </button>
          )}
        </div>
        <ul className="divide-y divide-gray-200">
          {displaySchedules.map((schedule: IBusinessSchedule) => {
            const dayName = generateWeekDays({ startOfWeekDay: 0 })[
              Number(schedule.day)
            ];
            const isToday = Number(schedule.day) === now.getDay();
            const isClosed = schedule.isWeekend;
            const isDefaultSchedule = businessSchedules.length === 0;
            const timeRange = isClosed
              ? "Closed"
              : `${convertTo12HourFormat(
                  schedule.startTime
                )} - ${convertTo12HourFormat(schedule.endTime)}`;

            return (
              <li
                key={schedule.id}
                className={`flex justify-between items-center py-2 ${
                  isToday ? "font-semibold text-green-600" : ""
                } ${isClosed ? "text-gray-400 italic" : ""}`}
              >
                <span>{dayName?.name}</span>
                <div className="flex items-center gap-3">
                  <span>{timeRange}</span>
                  {isDefaultSchedule && (
                    <span className="text-xs badge badge-outline badge-warning">
                      Default
                    </span>
                  )}
                  {hasPermission(Permissions.WorkScheduleUpdate) && (
                    <button
                      onClick={() => handleEditClick(schedule)}
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Edit Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        {popupOption.form === "bulk_schedule" ? (
          <BulkScheduleUpdateForm
            schedules={displaySchedules}
            handleClosePopup={() => {
              setPopupOption((prev) => ({ ...prev, open: false }));
            }}
          />
        ) : (
          selectedSchedule && (
            <CustomForm
              submitHandler={handleSubmit}
              resolver={scheduleSchema}
              defaultValues={{
                startTime: selectedSchedule.startTime || "",
                endTime: selectedSchedule.endTime || "",
                isWeekend: selectedSchedule.isWeekend || false,
              }}
              className={`flex flex-col gap-3 p-3`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CustomTimeInput
                  name="startTime"
                  label="Start Time (HH:MM)"
                  placeholder="09:00"
                  required
                />
                <CustomTimeInput
                  name="endTime"
                  label="End Time (HH:MM)"
                  placeholder="17:00"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 -mt-2">
                Use 24-hour format (e.g., 09:00 for 9 AM, 17:00 for 5 PM)
              </p>

              <ToggleSwitch name="isWeekend" label="Mark as Weekend/Closed" />

              <FormActionButton
                isPending={updateResult.loading}
                cancelHandler={() => {
                  setPopupOption((prev) => ({ ...prev, open: false }));
                  setSelectedSchedule(null);
                }}
              />
            </CustomForm>
          )
        )}
      </CustomPopup>
    </div>
  );
}
