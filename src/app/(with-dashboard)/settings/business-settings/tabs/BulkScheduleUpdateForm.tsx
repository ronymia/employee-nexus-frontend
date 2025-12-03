"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomTimeInput from "@/components/form/input/CustomTimeInput";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { UPDATE_BUSINESS_SCHEDULE } from "@/graphql/business.api";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import { IBusinessSchedule } from "@/types";
import { useMutation } from "@apollo/client/react";
import useAppStore from "@/stores/appStore";
import * as z from "zod";
import { generateWeekDays } from "@/utils/date-time.utils";
import { useState } from "react";

interface BulkScheduleUpdateFormProps {
  schedules: IBusinessSchedule[];
  handleClosePopup: () => void;
}

const bulkScheduleSchema = z.object({
  schedules: z.array(
    z.object({
      id: z.number(),
      day: z.string(),
      startTime: z.string().nonempty("Start time is required"),
      endTime: z.string().nonempty("End time is required"),
      isWeekend: z.boolean(),
    })
  ),
});

type BulkScheduleFormData = z.infer<typeof bulkScheduleSchema>;

export default function BulkScheduleUpdateForm({
  schedules,
  handleClosePopup,
}: BulkScheduleUpdateFormProps) {
  const { user } = useAppStore((state) => state);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateBusinessSchedule] = useMutation(UPDATE_BUSINESS_SCHEDULE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_BUSINESS_BY_ID, variables: { id: user.businessId } },
    ],
  });

  const handleSubmit = async (formValues: BulkScheduleFormData) => {
    setIsSubmitting(true);
    try {
      // Update all schedules one by one
      const promises = formValues.schedules.map((schedule) =>
        updateBusinessSchedule({
          variables: {
            updateBusinessScheduleInput: {
              id: schedule.id,
              day: Number(schedule.day),
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              isWeekend: schedule.isWeekend,
            },
          },
        })
      );

      await Promise.all(promises);
      handleClosePopup();
    } catch (error) {
      console.error("Error updating schedules:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const weekDays = generateWeekDays({ startOfWeekDay: 0 });

  return (
    <CustomForm
      submitHandler={handleSubmit}
      resolver={bulkScheduleSchema}
      defaultValues={{
        schedules: schedules.map((s) => ({
          id: s.id,
          day: s.day,
          startTime: s.startTime || "09:00",
          endTime: s.endTime || "17:00",
          isWeekend: s.isWeekend || false,
        })),
      }}
      className="flex flex-col gap-4 p-4 max-h-[70vh] overflow-y-auto"
    >
      <div className="space-y-4">
        {schedules.map((schedule, index) => {
          const dayName = weekDays[Number(schedule.day)]?.name;
          return (
            <div
              key={schedule.id}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <h4 className="font-semibold text-base text-gray-700">
                {dayName}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CustomTimeInput
                  name={`schedules.${index}.startTime`}
                  label="Start Time"
                  placeholder="09:00"
                  required
                />
                <CustomTimeInput
                  name={`schedules.${index}.endTime`}
                  label="End Time"
                  placeholder="17:00"
                  required
                />
              </div>

              <ToggleSwitch
                name={`schedules.${index}.isWeekend`}
                label="Closed/Weekend"
              />
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 bg-white pt-4 border-t">
        <p className="text-sm text-gray-500 mb-3">
          Use 24-hour format (e.g., 09:00 for 9 AM, 17:00 for 5 PM)
        </p>
        <FormActionButton
          isPending={isSubmitting}
          cancelHandler={handleClosePopup}
        />
      </div>
    </CustomForm>
  );
}
