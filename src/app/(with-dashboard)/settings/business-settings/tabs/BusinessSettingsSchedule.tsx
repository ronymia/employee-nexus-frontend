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
        </div>
        <ul className="divide-y divide-gray-200">
          {businessSchedules.map((schedule: IBusinessSchedule) => {
            const dayName = generateWeekDays({ startOfWeekDay: 0 })[
              Number(schedule.day)
            ];
            const isToday = Number(schedule.day) === now.getDay();
            const isClosed = schedule.isWeekend;
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
        {selectedSchedule && (
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
              <CustomInputField
                name="startTime"
                label="Start Time"
                type="time"
                required
              />
              <CustomInputField
                name="endTime"
                label="End Time"
                type="time"
                required
              />
            </div>

            <ToggleSwitch name="isWeekend" label="Mark as Weekend/Closed" />

            <FormActionButton
              isPending={updateResult.loading}
              cancelHandler={() => {
                setPopupOption((prev) => ({ ...prev, open: false }));
                setSelectedSchedule(null);
              }}
            />
          </CustomForm>
        )}
      </CustomPopup>
    </div>
  );
}
