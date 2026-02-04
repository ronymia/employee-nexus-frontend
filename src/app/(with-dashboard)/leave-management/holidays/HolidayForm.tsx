"use client";

// ==================== EXTERNAL IMPORTS ====================
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_HOLIDAY,
  GET_HOLIDAYS,
  HOLIDAY_OVERVIEW,
  UPDATE_HOLIDAY,
} from "@/graphql/holiday.api";
import { IHoliday, HolidayType } from "@/types/holiday.type";
import { showToast } from "@/components/ui/CustomToast";
import {
  customFormatDate,
  formatDateForAPI,
  FORMAT_PRESETS,
} from "@/utils/date-format.utils";

// ==================== TYPESCRIPT INTERFACES ====================
interface IHolidayFormProps {
  holiday?: IHoliday | null;
  actionType: "create" | "update";
  onClose: () => void;
}

// ==================== SUB-COMPONENTS ====================

// BASIC INFO SECTION
interface IBasicInfoSectionProps {
  holidayTypeOptions: { label: string; value: HolidayType }[];
}

function BasicInfoSection({ holidayTypeOptions }: IBasicInfoSectionProps) {
  return (
    <div className="border border-primary/20 rounded-lg p-4">
      <h4 className="text-base font-semibold mb-3 text-primary">
        Basic Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInputField
          dataAuto="name"
          name="name"
          label="Holiday Name"
          placeholder="Enter holiday name"
          required={true}
        />
        <CustomSelect
          dataAuto="holidayType"
          name="holidayType"
          label="Holiday Type"
          placeholder="Select holiday type"
          required={true}
          options={holidayTypeOptions}
          isLoading={false}
        />
      </div>
      <div className="mt-4">
        <CustomTextareaField
          dataAuto="description"
          name="description"
          label="Description"
          placeholder="Enter holiday description"
          required={false}
          rows={3}
        />
      </div>
    </div>
  );
}

// DATE SECTION
function DateSection() {
  return (
    <div className="border border-primary/20 rounded-lg p-4">
      <h4 className="text-base font-semibold mb-3 text-primary">
        Holiday Period
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomDatePicker
          dataAuto="startDate"
          name="startDate"
          label="Start Date"
          placeholder="Select start date"
          required={true}
        />
        <CustomDatePicker
          dataAuto="endDate"
          name="endDate"
          label="End Date"
          placeholder="Select end date"
          required={true}
          right
        />
      </div>
    </div>
  );
}

// OPTIONS SECTION
function OptionsSection() {
  return (
    <div className="border border-primary/20 rounded-lg p-4">
      <h4 className="text-base font-semibold mb-3 text-primary">Options</h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
          <div>
            <p className="font-medium text-sm">Paid Holiday</p>
            <p className="text-xs text-base-content/60">
              Employees receive paid time off
            </p>
          </div>
          <ToggleSwitch name="isPaid" />
        </div>

        <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
          <div>
            <p className="font-medium text-sm">Recurring Holiday</p>
            <p className="text-xs text-base-content/60">
              This holiday repeats annually
            </p>
          </div>
          <ToggleSwitch name="isRecurring" />
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function HolidayForm({
  holiday,
  actionType,
  onClose,
}: IHolidayFormProps) {
  // ==================== GRAPHQL MUTATIONS ====================
  // CREATE HOLIDAY
  const [createHoliday, createResult] = useMutation(CREATE_HOLIDAY, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: HOLIDAY_OVERVIEW }, { query: GET_HOLIDAYS }],
  });

  // UPDATE HOLIDAY
  const [updateHoliday, updateResult] = useMutation(UPDATE_HOLIDAY, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: HOLIDAY_OVERVIEW }, { query: GET_HOLIDAYS }],
  });

  // ==================== HOLIDAY TYPE OPTIONS ====================
  const holidayTypeOptions = [
    { label: "Public Holiday", value: HolidayType.PUBLIC },
    { label: "Religious Holiday", value: HolidayType.RELIGIOUS },
    { label: "Company Specific", value: HolidayType.COMPANY_SPECIFIC },
    { label: "Regional Holiday", value: HolidayType.REGIONAL },
  ];

  // ==================== FORM SUBMISSION ====================
  const handleSubmit = async (data: any) => {
    try {
      // FORMAT DATES TO ISO 8601 (UTC)
      const startDate = formatDateForAPI(data.startDate);
      const endDate = formatDateForAPI(data.endDate);

      // PREPARE INPUT
      const input = {
        name: data.name,
        description: data.description || undefined,
        startDate,
        endDate,
        holidayType: data.holidayType,
        isPaid: data.isPaid || false,
        isRecurring: data.isRecurring || false,
      };

      // CREATE OR UPDATE
      if (actionType === "create") {
        await createHoliday({
          variables: {
            createHolidayInput: input,
          },
        });
        showToast.success("Created!", "Holiday has been created successfully");
      } else {
        await updateHoliday({
          variables: {
            updateHolidayInput: { ...input, id: Number(holiday?.id) },
          },
        });
        showToast.success("Updated!", "Holiday has been updated successfully");
      }

      onClose();
    } catch (error: any) {
      console.error("Error submitting holiday:", error);
      showToast.error(
        "Error",
        error.message || `Failed to ${actionType} holiday`,
      );
      throw error;
    }
  };

  // ==================== DEFAULT VALUES ====================
  const defaultValues = {
    name: holiday?.name || "",
    description: holiday?.description || "",
    startDate: holiday?.startDate
      ? customFormatDate(holiday.startDate, FORMAT_PRESETS.INPUT_DATE)
      : customFormatDate(new Date(), FORMAT_PRESETS.INPUT_DATE),
    endDate: holiday?.endDate
      ? customFormatDate(holiday.endDate, FORMAT_PRESETS.INPUT_DATE)
      : customFormatDate(new Date(), FORMAT_PRESETS.INPUT_DATE),
    holidayType: holiday?.holidayType || "",
    isPaid: holiday?.isPaid || false,
    isRecurring: holiday?.isRecurring || false,
  };

  // ==================== RENDER ====================
  return (
    <CustomForm
      submitHandler={handleSubmit}
      defaultValues={defaultValues}
      className={`flex flex-col gap-4`}
    >
      <div className="space-y-4">
        {/* BASIC INFO */}
        <BasicInfoSection holidayTypeOptions={holidayTypeOptions} />

        {/* DATE SECTION */}
        <DateSection />

        {/* OPTIONS */}
        <OptionsSection />
      </div>

      {/* FORM ACTIONS */}
      <FormActionButton
        isPending={createResult.loading || updateResult.loading}
        cancelHandler={onClose}
      />
    </CustomForm>
  );
}
