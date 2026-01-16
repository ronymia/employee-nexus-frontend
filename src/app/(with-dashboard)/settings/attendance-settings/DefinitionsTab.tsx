"use client";

import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import { IAttendanceSettings } from "@/types";
import { MdAccessTime, MdTrendingUp, MdInfo } from "react-icons/md";

// ==================== INTERFACES ====================
interface IDefinitionsTabProps {
  settings?: IAttendanceSettings;
  updateSettings: any;
  isLoading: boolean;
  refetch: () => void;
}

interface IFormValues {
  punchInTimeTolerance: number;
  workAvailabilityDefinition: number;
}

// ==================== LOADING SKELETON SUB-COMPONENT ====================
function DefinitionsTabLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 animate-pulse">
      {/* SECTION 1 SKELETON */}
      <div className="space-y-3">
        <div className="h-6 w-48 bg-gray-300 rounded"></div>
        <div className="h-4 w-full max-w-md bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-20 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px w-full bg-gray-200 my-6"></div>

      {/* SECTION 2 SKELETON */}
      <div className="space-y-3">
        <div className="h-6 w-56 bg-gray-300 rounded"></div>
        <div className="h-4 w-full max-w-lg bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-20 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* BUTTON SKELETON */}
      <div className="flex justify-end pt-6">
        <div className="h-10 w-full sm:w-32 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

// ==================== STATUS BADGE SUB-COMPONENT ====================
interface IStatusBadgeProps {
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  colorClass: string;
}

function StatusBadge({
  label,
  description,
  isActive,
  onClick,
  colorClass,
}: IStatusBadgeProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
      <button
        type="button"
        onClick={onClick}
        className={`px-4 py-1.5 rounded-full font-medium transition-all text-sm ${
          isActive
            ? `${colorClass} text-white shadow-md`
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        {label}
      </button>
      <span className="text-xs sm:text-sm text-gray-600">{description}</span>
    </div>
  );
}

// ==================== DEFINITIONS TAB COMPONENT ====================
export default function DefinitionsTab({
  settings,
  updateSettings,
  isLoading,
}: IDefinitionsTabProps) {
  // ==================== HOOKS ====================
  // (No state needed - badges are display-only)

  // ==================== HANDLERS ====================
  const handleOnSubmit = async (formValues: IFormValues) => {
    await updateSettings({
      variables: {
        punchInTimeTolerance: Number(formValues.punchInTimeTolerance),
        workAvailabilityDefinition: Number(
          formValues.workAvailabilityDefinition
        ),
      },
    });
  };

  // SHOW SKELETON WHILE LOADING
  if (isLoading) {
    return <DefinitionsTabLoadingSkeleton />;
  }

  // ==================== RENDER ====================
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CustomForm
        submitHandler={handleOnSubmit}
        defaultValues={{
          punchInTimeTolerance: settings?.punchInTimeTolerance || 15,
          workAvailabilityDefinition:
            settings?.workAvailabilityDefinition || 80,
        }}
        className="p-4 sm:p-6 space-y-6"
      >
        {/* CLOCK IN TIME TOLERANCE SECTION */}
        <div className="space-y-4 p-4 bg-linear-to-br from-blue-50/50 to-indigo-50/30 rounded-lg border border-blue-100/50">
          {/* HEADER */}
          <div className="flex items-start gap-3">
            <MdAccessTime className="text-primary text-2xl shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Clock In Time Tolerance (Minutes)
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                The adjustment considers the punch in time based on a work
                shift.
              </p>
            </div>
          </div>

          {/* INPUT FIELD */}
          <CustomInputField
            name="punchInTimeTolerance"
            type="number"
            placeholder="15"
            min={0}
            max={120}
            wrapperClassName="max-w-full"
          />

          {/* INFO BADGE */}
          <div className="flex items-start gap-2 p-3 bg-white/80 rounded-md border border-primary/50">
            <MdInfo className="text-primary text-lg shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-700 font-medium mb-2">
                Status Indicators:
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
                <StatusBadge
                  label="Early"
                  description="Before on time"
                  isActive={true}
                  onClick={() => {}}
                  colorClass="bg-orange-500"
                />
                <StatusBadge
                  label="Regular"
                  description="On time to tolerance"
                  isActive={true}
                  onClick={() => {}}
                  colorClass="bg-green-500"
                />
                <StatusBadge
                  label="Late"
                  description="After tolerance"
                  isActive={true}
                  onClick={() => {}}
                  colorClass="bg-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* WORK AVAILABILITY DEFINITION SECTION */}
        <div className="space-y-4 p-4 bg-linear-to-br from-green-50/50 to-emerald-50/30 rounded-lg border border-green-100/50">
          {/* HEADER */}
          <div className="flex items-start gap-3">
            <MdTrendingUp className="text-green-600 text-2xl shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Work Availability Definition (Percentage)
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Set the attendance percentage threshold that defines employee
                performance levels. This value determines when an employee's
                attendance is considered Good or needs improvement.
              </p>
            </div>
          </div>

          {/* INPUT FIELD */}
          <CustomInputField
            name="workAvailabilityDefinition"
            type="number"
            placeholder="80"
            min={0}
            max={100}
            wrapperClassName="max-w-full"
          />

          {/* INFO BADGE */}
          <div className="flex items-start gap-2 p-3 bg-white/80 rounded-md border border-green-200/50">
            <MdInfo className="text-green-600 text-lg shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-700 font-medium mb-2">
                Performance Levels:
              </p>
              <div className="flex flex-col gap-2">
                <StatusBadge
                  label="Good"
                  description="≥ Set percentage (e.g., ≥80%)"
                  isActive={true}
                  onClick={() => {}}
                  colorClass="bg-green-500"
                />
                <StatusBadge
                  label="Needs Improvement"
                  description="< Set percentage (e.g., <80%)"
                  isActive={true}
                  onClick={() => {}}
                  colorClass="bg-red-500"
                />
              </div>
              <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Example:</strong> If set to 80%, employees with ≥80%
                  attendance are marked as "Good", while those below 80% need
                  improvement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-200">
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
