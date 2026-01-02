"use client";

import CustomForm from "@/components/form/CustomForm";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { IAttendanceSettings } from "@/types";
import { MdCheckCircle, MdInfo } from "react-icons/md";

// ==================== INTERFACE ====================
interface IPreferenceTabProps {
  settings?: IAttendanceSettings;
  updateSettings: any;
  isLoading: boolean;
  refetch: () => void;
}

// ==================== LOADING SKELETON SUB-COMPONENT ====================
function PreferenceTabLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 animate-pulse">
      {/* SETTINGS SECTION SKELETON */}
      <div className="space-y-6">
        {/* AUTO APPROVAL SETTING SKELETON */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-linear-to-br from-gray-100 to-gray-50 rounded-lg border border-gray-200">
          {/* TOGGLE SKELETON */}
          <div className="flex items-center sm:items-start sm:pt-1">
            <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
          </div>

          {/* CONTENT SKELETON */}
          <div className="flex-1 space-y-2">
            {/* TITLE SKELETON */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>

            {/* DESCRIPTION SKELETON */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            </div>

            {/* INFO BADGE SKELETON */}
            <div className="flex items-start gap-2 mt-3 p-3 bg-white/80 rounded-md border border-gray-200">
              <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS SKELETON */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <div className="h-10 w-full sm:w-40 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

// ==================== PREFERENCE TAB COMPONENT ====================
export default function PreferenceTab({
  settings,
  updateSettings,
  isLoading,
}: IPreferenceTabProps) {
  // HANDLE FORM SUBMISSION
  const handleOnSubmit = async (formValues: { autoApproval: boolean }) => {
    await updateSettings({
      variables: {
        autoApproval: formValues.autoApproval,
      },
    });
  };

  // SET DEFAULT VALUES FROM SETTINGS
  const defaultValues = {
    punchInTimeTolerance: settings?.punchInTimeTolerance || 15,
    workAvailabilityDefinition: settings?.workAvailabilityDefinition || 80,
    punchInOutAlert: settings?.punchInOutAlert ?? true,
    punchInOutInterval: settings?.punchInOutInterval || 1,
    autoApproval: settings?.autoApproval ?? false,
  };

  // SHOW SKELETON WHILE LOADING
  if (isLoading) {
    return <PreferenceTabLoadingSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CustomForm
        submitHandler={handleOnSubmit}
        defaultValues={defaultValues}
        className="p-4 sm:p-6"
      >
        {/* SETTINGS SECTION */}
        <div className="space-y-6">
          {/* AUTO APPROVAL SETTING */}
          <div className="p-4 bg-linear-to-br from-blue-50/50 to-indigo-50/30 rounded-lg border border-blue-100/50">
            {/* HEADER WITH TOGGLE - Mobile: inline, Desktop: separate */}
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-0">
              {/* TITLE WITH ICON */}
              <div className="flex items-center gap-2">
                <MdCheckCircle className="text-primary text-xl shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Auto Approval
                </h3>
              </div>

              {/* TOGGLE SWITCH - Visible on mobile */}
              <div className="sm:hidden">
                <ToggleSwitch name="autoApproval" />
              </div>
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden sm:flex sm:items-start gap-4">
              {/* TOGGLE SWITCH - Visible on desktop */}
              <div className="pt-1">
                <ToggleSwitch name="autoApproval" />
              </div>

              {/* CONTENT SECTION */}
              <div className="flex-1 space-y-2">
                {/* DESCRIPTION */}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  When enabled, all attendance requests will be approved
                  automatically without manual review. By default, this applies
                  to all employees, but you can configure specific employees for
                  auto approval.
                </p>

                {/* INFO BADGE */}
                <div className="flex items-start gap-2 mt-3 p-3 bg-white/80 rounded-md border border-primary/50">
                  <MdInfo className="text-primary text-lg shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Note:</span> You
                    can manage individual employee auto-approval settings from
                    the employee management section.
                  </p>
                </div>
              </div>
            </div>

            {/* MOBILE LAYOUT - Content below toggle */}
            <div className="sm:hidden space-y-3 mt-3">
              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 leading-relaxed">
                When enabled, all attendance requests will be approved
                automatically without manual review. By default, this applies to
                all employees, but you can configure specific employees for auto
                approval.
              </p>

              {/* INFO BADGE */}
              <div className="flex items-start gap-2 p-3 bg-white/80 rounded-md border border-primary/50">
                <MdInfo className="text-primary text-lg shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700">
                  <span className="font-medium text-gray-900">Note:</span> You
                  can manage individual employee auto-approval settings from the
                  employee management section.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          {/* SAVE BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full sm:w-auto px-6 py-2.5 text-sm sm:text-base font-medium transition-all duration-200 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
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
  );
}
