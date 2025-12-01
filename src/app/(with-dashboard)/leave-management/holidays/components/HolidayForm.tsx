"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { useFormContext, useWatch } from "react-hook-form";

enum HolidayType {
  PUBLIC = "PUBLIC",
  RELIGIOUS = "RELIGIOUS",
  COMPANY_SPECIFIC = "COMPANY_SPECIFIC",
  REGIONAL = "REGIONAL",
}

interface IHoliday {
  id?: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  isPaid: boolean;
  holidayType: HolidayType;
  businessId?: number;
}

interface HolidayFormProps {
  holiday?: IHoliday;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function HolidayForm({
  holiday,
  actionType,
  onClose,
}: HolidayFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Holiday Form Submit:", {
      ...data,
      actionType,
    });
    // TODO: Implement GraphQL mutation
    onClose();
  };

  const defaultValues = {
    name: holiday?.name || "",
    description: holiday?.description || "",
    startDate: holiday?.startDate || new Date().toISOString().split("T")[0],
    endDate: holiday?.endDate || new Date().toISOString().split("T")[0],
    holidayType: holiday?.holidayType || HolidayType.PUBLIC,
    isRecurring: holiday?.isRecurring || false,
    isPaid: holiday?.isPaid !== undefined ? holiday.isPaid : true,
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <HolidayFormFields />
      <FormActionButton isPending={false} cancelHandler={onClose} />
    </CustomForm>
  );
}

function HolidayFormFields() {
  const { control } = useFormContext();
  const isRecurring = useWatch({
    control,
    name: "isRecurring",
    defaultValue: false,
  });

  const isPaid = useWatch({
    control,
    name: "isPaid",
    defaultValue: true,
  });

  const holidayTypeOptions = [
    { label: "Public Holiday", value: HolidayType.PUBLIC },
    { label: "Religious Holiday", value: HolidayType.RELIGIOUS },
    { label: "Company Specific", value: HolidayType.COMPANY_SPECIFIC },
    { label: "Regional Holiday", value: HolidayType.REGIONAL },
  ];

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Holiday Details
        </h4>
        <div className="grid grid-cols-1 gap-4">
          <CustomInputField
            dataAuto="name"
            name="name"
            type="text"
            label="Holiday Name"
            placeholder="e.g., New Year's Day"
            required={true}
          />
          <CustomTextareaField
            dataAuto="description"
            name="description"
            label="Description"
            placeholder="Add a brief description of the holiday..."
            required={false}
            rows={3}
          />
          <CustomSelect
            dataAuto="holidayType"
            name="holidayType"
            label="Holiday Type"
            placeholder="Select Holiday Type"
            required={true}
            options={holidayTypeOptions}
            isLoading={false}
          />
        </div>
      </div>

      {/* Date Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Holiday Period
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomDatePicker
            dataAuto="startDate"
            name="startDate"
            label="Start Date"
            placeholder="Select Start Date"
            required={true}
          />
          <CustomDatePicker
            dataAuto="endDate"
            name="endDate"
            label="End Date"
            placeholder="Select End Date"
            required={true}
          />
        </div>
        <p className="text-xs text-base-content/60 mt-2">
          For single-day holidays, set both start and end dates to the same day
        </p>
      </div>

      {/* Holiday Settings */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Holiday Settings
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
            <div>
              <p className="font-medium text-sm">Recurring Holiday</p>
              <p className="text-xs text-base-content/60">
                This holiday repeats annually
              </p>
            </div>
            <ToggleSwitch
              dataAuto="isRecurring"
              name="isRecurring"
              defaultChecked={isRecurring}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
            <div>
              <p className="font-medium text-sm">Paid Holiday</p>
              <p className="text-xs text-base-content/60">
                Employees receive paid time off
              </p>
            </div>
            <ToggleSwitch
              dataAuto="isPaid"
              name="isPaid"
              defaultChecked={isPaid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
