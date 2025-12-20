"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomRadioButton from "@/components/form/input/CustomRadioButton";
import { showToast } from "@/components/ui/CustomToast";
import {
  CREATE_WORK_SCHEDULE,
  GET_WORK_SCHEDULE_BY_ID,
  GET_WORK_SCHEDULES,
  UPDATE_WORK_SCHEDULE,
} from "@/graphql/work-schedules.api";
import {
  IWorkScheduleFormData,
  workScheduleSchema,
} from "@/schemas/work-schedules.schema";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import RegularSchedule from "./components/RegularSchedule";
import ShiftSchedule from "./components/ShiftSchedule";
import FlexibleSchedule from "./components/FlexibleSchedule";
import WeekendSelector from "./components/WeekendSelector";
import { IWorkSchedule } from "@/types";
import { Fragment } from "react";

export default function WorkScheduleForm({ id = undefined }: { id?: number }) {
  // ROUTER
  const router = useRouter();

  // UPDATE FLAG
  const isUpdate = !!id;

  // QUERY FOR FETCHING EXISTING DATA
  const { data: workScheduleData, loading: fetchLoading } = useQuery<{
    workScheduleById: {
      data: IWorkSchedule;
    };
  }>(GET_WORK_SCHEDULE_BY_ID, {
    variables: { id },
    skip: !id,
  });

  // MUTATION FOR CREATING NEW WORK SCHEDULE
  const [createWorkSchedule, createResult] = useMutation(CREATE_WORK_SCHEDULE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_WORK_SCHEDULES }],
  });

  // MUTATION FOR UPDATING WORK SCHEDULE
  const [updateWorkSchedule, updateResult] = useMutation(UPDATE_WORK_SCHEDULE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_WORK_SCHEDULES }],
  });

  // HANDLE SUBMIT
  const handleSubmit = async (formValues: IWorkScheduleFormData) => {
    try {
      if (isUpdate) {
        const res = await updateWorkSchedule({
          variables: {
            updateWorkScheduleInput: {
              id,
              ...formValues,
            },
          },
        });
        if (res?.data) {
          showToast.success("Updated!", "Work schedule updated successfully");
          // REDIRECT TO WORK SCHEDULES PAGE
          router.replace("/administration/work-schedules");
        }
      } else {
        const res = await createWorkSchedule({
          variables: {
            createWorkScheduleInput: formValues,
          },
        });
        if (res?.data) {
          showToast.success("Created!", "Work schedule created successfully");
          // REDIRECT TO WORK SCHEDULES PAGE
          router.replace("/administration/work-schedules");
        }
      }
    } catch (error: any) {
      showToast.error(
        "Error",
        error.message ||
          `Failed to ${isUpdate ? "update" : "create"} work schedule`
      );

      throw error;
    }
  };
  // console.log({ workScheduleData });

  // Helper function to extract weekend days from schedules
  const getWeekendDays = (schedules: any[]) => {
    return schedules?.filter((s) => s.isWeekend).map((s) => s.day) || [0, 6];
  };

  // DEFAULT VALUES FOR UPDATE
  const defaultValues = isUpdate
    ? (() => {
        const schedules =
          workScheduleData?.workScheduleById?.data?.schedules || [];
        const scheduleType =
          workScheduleData?.workScheduleById?.data?.scheduleType || "";

        const baseValues = {
          name: workScheduleData?.workScheduleById?.data?.name || "",
          description:
            workScheduleData?.workScheduleById?.data?.description || "",
          scheduleType,
          breakType: workScheduleData?.workScheduleById?.data?.breakType || "",
          breakHours: workScheduleData?.workScheduleById?.data?.breakHours || 0,
          weekendDays: getWeekendDays(schedules),
          schedules: workScheduleData?.workScheduleById?.data?.schedules?.map(
            (schedule) => ({
              day: schedule.day,
              isWeekend: schedule.isWeekend,
              timeSlots:
                schedule.timeSlots?.map((timeSlot) => ({
                  startTime: timeSlot.startTime,
                  endTime: timeSlot.endTime,
                })) || [],
            })
          ),
        };

        return baseValues;
      })()
    : {
        scheduleType: "REGULAR",
        breakType: "PAID",
      };
  // console.log({ defaultValues });
  if (fetchLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CustomForm
      submitHandler={handleSubmit}
      resolver={workScheduleSchema}
      className={`flex flex-col gap-3 p-3`}
      defaultValues={defaultValues}
      key={`work-schedule-form-${id}`}
    >
      {/* NAME */}
      <CustomInputField name="name" label="Name" required={!isUpdate} />

      {/* WEEKEND SELECTOR */}
      <WeekendSelector />

      {/* SCHEDULE TYPE */}
      <ScheduleTypeSelector isUpdate={isUpdate} />

      {/* BREAK TYPE */}
      <div className="space-y-2">
        <CustomRadioButton
          name="breakType"
          label="Break Type"
          required={!isUpdate}
          dataAuto="break-type-radio"
          radioGroupClassName="grid-cols-2"
          options={[
            { title: "Paid", value: "PAID" },
            { title: "Unpaid", value: "UNPAID" },
          ]}
        />
      </div>

      {/* BREAK HOURS */}
      <CustomInputField
        type="number"
        name="breakHours"
        label="Break Hours"
        required={!isUpdate}
        min={0}
      />

      {/* DESCRIPTION */}
      <CustomTextareaField
        name="description"
        label="Description"
        required={!isUpdate}
      />

      {/* FORM ACTION */}
      <FormActionButton
        isPending={createResult.loading || updateResult.loading}
        cancelHandler={() => {
          router.replace("/administration/work-schedules");
        }}
      />
    </CustomForm>
  );
}

// Schedule Type Selector Component
function ScheduleTypeSelector({ isUpdate }: { isUpdate: boolean }) {
  const { watch } = useFormContext();
  const scheduleType = watch("scheduleType");

  return (
    <Fragment key={`schedule-type-selector-${scheduleType}`}>
      {/* SCHEDULE TYPE RADIO BUTTONS */}
      <div className="space-y-2">
        <CustomRadioButton
          name="scheduleType"
          label="Schedule Type"
          required={!isUpdate}
          dataAuto="schedule-type-radio"
          radioGroupClassName="grid-cols-3"
          options={[
            { title: "Regular", value: "REGULAR" },
            { title: "Schedule", value: "SCHEDULED" },
            // { title: "Flexible", value: "FLEXIBLE" },
          ]}
        />
      </div>

      {/* RENDER SCHEDULE COMPONENT BASED ON TYPE */}
      {scheduleType === "REGULAR" && <RegularSchedule />}
      {scheduleType === "SCHEDULED" && <ShiftSchedule />}
      {scheduleType === "FLEXIBLE" && <FlexibleSchedule />}
    </Fragment>
  );
}
