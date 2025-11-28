"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomRadioButton from "@/components/form/input/CustomRadioButton";
import {
  CREATE_WORK_SCHEDULE,
  GET_WORK_SCHEDULE_BY_ID,
  GET_WORK_SCHEDULES,
  UPDATE_WORK_SCHEDULE,
} from "@/graphql/work-schedules.api";
import {
  IUpdateWorkScheduleFormData,
  IWorkScheduleFormData,
  updateWorkScheduleSchema,
  workScheduleSchema,
} from "@/schemas/work-schedules.schema";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import RegularSchedule from "./components/RegularSchedule";
import ShiftSchedule from "./components/ShiftSchedule";
import FlexibleSchedule from "./components/FlexibleSchedule";
import WeekendSelector from "./components/WeekendSelector";

export default function WorkScheduleForm({ id = undefined }: { id?: number }) {
  const router = useRouter();
  const isUpdate = !!id;

  // QUERY FOR FETCHING EXISTING DATA
  const { data: workScheduleData, loading: fetchLoading } = useQuery<{
    workScheduleById: {
      data: {
        id: number;
        name: string;
        description: string;
        scheduleType: string;
        breakType: string;
        breakHours: number;
      };
    };
  }>(GET_WORK_SCHEDULE_BY_ID, {
    variables: { id },
    skip: !id,
  });

  // MUTATIONS
  const [createWorkSchedule, createResult] = useMutation(CREATE_WORK_SCHEDULE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_WORK_SCHEDULES }],
  });

  const [updateWorkSchedule, updateResult] = useMutation(UPDATE_WORK_SCHEDULE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_WORK_SCHEDULES }],
  });

  // HANDLE SUBMIT
  const handleSubmit = async (
    formValues: IWorkScheduleFormData | IUpdateWorkScheduleFormData
  ) => {
    if (isUpdate) {
      await updateWorkSchedule({
        variables: {
          id,
          updateWorkScheduleInput: formValues,
        },
      }).then(() => {
        // REDIRECT TO WORK SCHEDULES PAGE
        router.replace("/administration/work-schedules");
      });
    } else {
      await createWorkSchedule({
        variables: {
          createWorkScheduleInput: formValues,
        },
      }).then(() => {
        // REDIRECT TO WORK SCHEDULES PAGE
        router.replace("/administration/work-schedules");
      });
    }
  };

  // DEFAULT VALUES FOR UPDATE
  const defaultValues = isUpdate
    ? {
        name: workScheduleData?.workScheduleById?.data?.name || "",
        description:
          workScheduleData?.workScheduleById?.data?.description || "",
        scheduleType:
          workScheduleData?.workScheduleById?.data?.scheduleType || "REGULAR",
        breakType:
          workScheduleData?.workScheduleById?.data?.breakType || "PAID",
        breakHours: workScheduleData?.workScheduleById?.data?.breakHours || 0,
      }
    : {
        scheduleType: "REGULAR",
        breakType: "PAID",
      };

  if (fetchLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CustomForm
      submitHandler={handleSubmit}
      resolver={isUpdate ? updateWorkScheduleSchema : workScheduleSchema}
      className={`flex flex-col gap-3 p-3`}
      defaultValues={defaultValues}
    >
      {/* NAME */}
      <CustomInputField name="name" label="Name" required={!isUpdate} />

      {/* DESCRIPTION */}
      {/* <CustomTextareaField
        name="description"
        label="Description"
        required={!isUpdate}
      /> */}

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
    <>
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
            { title: "Shift", value: "SHIFT" },
            { title: "Flexible", value: "FLEXIBLE" },
          ]}
        />
      </div>

      {/* RENDER SCHEDULE COMPONENT BASED ON TYPE */}
      {scheduleType === "REGULAR" && <RegularSchedule />}
      {scheduleType === "SHIFT" && <ShiftSchedule />}
      {scheduleType === "FLEXIBLE" && <FlexibleSchedule />}
    </>
  );
}
