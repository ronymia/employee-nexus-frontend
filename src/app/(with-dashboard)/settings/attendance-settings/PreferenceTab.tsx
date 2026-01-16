"use client";

import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
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
  const handleOnSubmit = async (formValues: {
    autoApproval: boolean;
    punchInOutAlert: boolean;
    punchInOutInterval: number;
  }) => {
    await updateSettings({
      variables: {
        autoApproval: formValues.autoApproval,
        punchInOutAlert: formValues.punchInOutAlert,
        punchInOutInterval: Number(formValues.punchInOutInterval),
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

          {/* PUNCH IN/OUT ALERT SETTING */}
          <div className="p-4 bg-linear-to-br from-purple-50/50 to-pink-50/30 rounded-lg border border-purple-100/50">
            {/* HEADER WITH TOGGLE */}
            <div className="flex items-center justify-between gap-3 mb-3 sm:mb-0">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Punch In/Out Alert
                </h3>
              </div>

              <div className="sm:hidden">
                <ToggleSwitch name="punchInOutAlert" />
              </div>
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden sm:flex sm:items-start gap-4">
              <div className="pt-1">
                <ToggleSwitch name="punchInOutAlert" />
              </div>

              <div className="flex-1 space-y-2">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Enable automated alerts to remind employees to punch in/out at
                  their scheduled times. This helps ensure timely attendance
                  tracking.
                </p>

                <div className="flex items-start gap-2 mt-3 p-3 bg-white/80 rounded-md border border-purple-200/50">
                  <MdInfo className="text-purple-600 text-lg shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Tip:</span>{" "}
                    Alerts are sent based on the interval configured below.
                  </p>
                </div>
              </div>
            </div>

            {/* MOBILE LAYOUT */}
            <div className="sm:hidden space-y-3 mt-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                Enable automated alerts to remind employees to punch in/out at
                their scheduled times.
              </p>

              <div className="flex items-start gap-2 p-3 bg-white/80 rounded-md border border-purple-200/50">
                <MdInfo className="text-purple-600 text-lg shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700">
                  <span className="font-medium text-gray-900">Tip:</span> Alerts
                  are sent based on the interval configured below.
                </p>
              </div>
            </div>
          </div>

          {/* PUNCH IN/OUT INTERVAL SETTING */}
          <div className="p-4 bg-linear-to-br from-orange-50/50 to-amber-50/30 rounded-lg border border-orange-100/50">
            <div className="flex items-start gap-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-600 mt-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                  Alert Interval (Minutes)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Set how frequently (in minutes) reminder alerts should be sent
                  to employees for punch in/out.
                </p>
              </div>
            </div>

            <CustomInputField
              name="punchInOutInterval"
              type="number"
              placeholder="60"
              min={1}
              max={1440}
              wrapperClassName="max-w-full"
            />

            <div className="flex items-start gap-2 mt-3 p-3 bg-white/80 rounded-md border border-orange-200/50">
              <MdInfo className="text-orange-600 text-lg shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-medium text-gray-900">Example:</span>{" "}
                Setting this to 60 minutes means alerts will be sent every hour
                if an employee hasn't punched in/out.
              </p>
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
