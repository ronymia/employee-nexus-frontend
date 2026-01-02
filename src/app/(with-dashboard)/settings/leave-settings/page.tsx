"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import CustomForm from "@/components/form/CustomForm";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import CustomSelect from "@/components/form/input/CustomSelect";
import PageHeader from "@/components/ui/PageHeader";
import {
  GET_LEAVE_SETTINGS,
  UPDATE_LEAVE_SETTINGS,
} from "@/graphql/leave-settings.api";
import { ILeaveSettings, MONTHS } from "@/types";
import { ILeaveSettingsFormData } from "@/schemas";
import { MdCalendarToday, MdCheckCircle, MdInfo } from "react-icons/md";

// ==================== LOADING SKELETON SUB-COMPONENT ====================
function LeaveSettingsLoadingSkeleton() {
  return (
    <section className="space-y-6 animate-pulse">
      {/* HEADER SKELETON */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 rounded"></div>
      </div>

      {/* FORM SKELETON */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 space-y-6">
        {/* SECTION 1 */}
        <div className="space-y-3">
          <div className="h-6 w-40 bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* DIVIDER */}
        <div className="h-px w-full bg-gray-200"></div>

        {/* SECTION 2 */}
        <div className="space-y-3">
          <div className="h-6 w-36 bg-gray-300 rounded"></div>
          <div className="flex gap-3">
            <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* BUTTON SKELETON */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <div className="h-10 w-full sm:w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    </section>
  );
}

// ==================== LEAVE SETTINGS PAGE COMPONENT ====================
export default function LeaveSettingsPage() {
  // ==================== HOOKS ====================
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

  // ==================== HANDLERS ====================
  const handleOnSubmit = async (formValues: ILeaveSettingsFormData) => {
    await updateSettings({
      variables: {
        startMonth: Number(formValues.startMonth),
        autoApproval: formValues.autoApproval,
      },
    });
  };

  // SHOW SKELETON WHILE LOADING
  if (loading) {
    return <LeaveSettingsLoadingSkeleton />;
  }

  const settings = data?.leaveSettingByBusinessId?.data;

  // TRANSFORM MONTHS ARRAY FOR SELECT OPTIONS
  const monthOptions = MONTHS.map((month) => ({
    label: month.label,
    value: month.value,
  }));

  // ==================== RENDER ====================
  return (
    <section className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Leave Settings"
        subtitle="Configure leave allowance and approval settings"
      />

      {/* SETTINGS FORM */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <CustomForm
          submitHandler={handleOnSubmit}
          defaultValues={{
            startMonth: settings?.startMonth,
            autoApproval: settings?.autoApproval,
          }}
          className="p-4 sm:p-6 space-y-6"
        >
          {/* ALLOWANCE POLICY SECTION */}
          <div className="space-y-4 p-4 bg-linear-to-br from-green-50/50 to-emerald-50/30 rounded-lg border border-green-100/50">
            {/* HEADER WITH ICON */}
            <div className="flex items-start gap-3">
              <MdCalendarToday className="text-green-600 text-2xl shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                  Allowance Policy
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Define when the leave year starts for your organization
                </p>
              </div>
            </div>

            {/* LEAVE START MONTH */}
            <div className="space-y-2">
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
              <p className="text-xs text-gray-500 flex items-start gap-1">
                <MdInfo className="text-sm shrink-0 mt-0.5" />
                <span>
                  This determines the annual leave cycle for all employees
                </span>
              </p>
            </div>
          </div>

          {/* APPROVAL POLICY SECTION */}
          <div className="space-y-4 p-4 bg-linear-to-br from-blue-50/50 to-indigo-50/30 rounded-lg border border-blue-100/50">
            {/* HEADER WITH ICON */}
            <div className="flex items-start gap-3">
              <MdCheckCircle className="text-primary text-2xl shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                  Approval Policy
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Configure automatic approval settings for leave requests
                </p>
              </div>
            </div>

            {/* AUTO APPROVAL TOGGLE */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 bg-white/80 rounded-md border border-primary/50">
              {/* TOGGLE SWITCH */}
              <div className="flex items-center sm:pt-1">
                <ToggleSwitch name="autoApproval" />
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  Auto Approval
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  When enabled, all leave requests will be approved
                  automatically without manual review. By default, this applies
                  to all employees, but you can configure specific employees for
                  auto approval.
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-200">
            {/* SAVE BUTTON */}
            <button
              type="submit"
              disabled={loading || updateResult.loading}
              className="btn btn-primary w-full sm:w-auto px-6 py-2.5 text-sm sm:text-base font-medium transition-all duration-200 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updateResult.loading ? (
                // LOADING STATE
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Saving...</span>
                </span>
              ) : (
                // NORMAL STATE
                <span className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  <span>Save Changes</span>
                </span>
              )}
            </button>
          </div>
        </CustomForm>
      </div>
    </section>
  );
}
