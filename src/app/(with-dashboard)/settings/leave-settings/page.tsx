"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import CustomForm from "@/components/form/CustomForm";
import CustomLoading from "@/components/loader/CustomLoading";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import CustomSelect from "@/components/form/input/CustomSelect";
import {
  GET_LEAVE_SETTINGS,
  UPDATE_LEAVE_SETTINGS,
} from "@/graphql/leave-settings.api";
import { ILeaveSettings, MONTHS } from "@/types";
import { ILeaveSettingsFormData } from "@/schemas";

export default function LeaveSettingsPage() {
  // GET LEAVE SETTINGS
  const { data, loading } = useQuery<{
    leaveSettingByBusinessId: {
      message: string;
      statusCode: number;
      success: boolean;
      data: ILeaveSettings;
    };
  }>(GET_LEAVE_SETTINGS, {});

  // UPDATE LEAVE SETTINGS
  const [updateSettings, updateResult] = useMutation(UPDATE_LEAVE_SETTINGS, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_LEAVE_SETTINGS }],
  });

  const handleOnSubmit = async (formValues: ILeaveSettingsFormData) => {
    await updateSettings({
      variables: {
        startMonth: Number(formValues.startMonth),
        autoApproval: formValues.autoApproval,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <CustomLoading />
      </div>
    );
  }

  const settings = data?.leaveSettingByBusinessId?.data;

  // Transform months array for CustomSelect
  const monthOptions = MONTHS.map((month) => ({
    label: month.label,
    value: month.value,
  }));

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="mb-5">
        <h1 className="text-2xl font-medium">Leave Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Configure leave allowance and approval settings
        </p>
      </header>

      {/* Settings Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <CustomForm
          submitHandler={handleOnSubmit}
          defaultValues={{
            startMonth: settings?.startMonth,
            autoApproval: settings?.autoApproval,
          }}
          className="space-y-8"
        >
          {/* Allowance Policy Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-blue-600">
              Allowance Policy
            </h2>

            {/* Leave Start Month */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Leave will start from the month of{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <CustomSelect
                name="startMonth"
                label=""
                dataAuto="startMonth"
                options={monthOptions}
                required={true}
                placeholder="Select month"
                position="bottom"
                isLoading={false}
              />
            </div>
          </div>

          {/* Approval Policy Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-blue-600">
              Approval Policy
            </h2>

            {/* Auto Approval */}
            <div className="flex items-start gap-x-4">
              <div className="pt-1">
                <ToggleSwitch name="autoApproval" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium mb-1">Auto approval:</h3>
                <p className="text-sm text-gray-600">
                  In the enabled state, all leave requests will be approved
                  automatically without any reviews. As default, the app
                  considers all employees for auto approval. Note that it&apos;s
                  possible to manage employees for auto approval.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={updateResult.loading}
              className="btn btn-primary px-6"
            >
              {updateResult.loading ? (
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
    </section>
  );
}
