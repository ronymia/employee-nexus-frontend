"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { IAttendanceSettings } from "@/types";
import { attendanceSettingsSchema } from "@/schemas";

interface IPreferenceTabProps {
  settings?: IAttendanceSettings;
  updateSettings: any;
  isLoading: boolean;
  refetch: () => void;
}

export default function PreferenceTab({
  settings,
  updateSettings,
  isLoading,
}: IPreferenceTabProps) {
  const handleOnSubmit = async (formValues: any) => {
    await updateSettings({
      variables: {
        autoApproval: formValues.autoApproval,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <CustomForm
        submitHandler={handleOnSubmit}
        defaultValues={{
          punchInTimeTolerance: settings?.punchInTimeTolerance || 15,
          workAvailabilityDefinition:
            settings?.workAvailabilityDefinition || 80,
          punchInOutAlert: settings?.punchInOutAlert ?? true,
          punchInOutInterval: settings?.punchInOutInterval || 1,
          autoApproval: settings?.autoApproval ?? false,
          isGeoLocationEnabled: settings?.isGeoLocationEnabled ?? false,
        }}
        className="space-y-6"
      >
        {/* Auto Approval */}
        <div className="flex items-start gap-x-4">
          <div className="pt-1">
            <ToggleSwitch name="autoApproval" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-medium mb-1">Auto approval:</h3>
            <p className="text-sm text-gray-600">
              In the enabled state, all the attendance request would be approved
              automatically without any reviews. As default, the app considers
              all employee for approval. Note that its possible to manage
              employees for auto approval.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary px-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Save
              </span>
            )}
          </button>
        </div>
      </CustomForm>
    </div>
  );
}
