"use client";

import { useState } from "react";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import { IAttendanceSettings } from "@/types/attendance-settings.type";

interface IDefinitionsTabProps {
  settings?: IAttendanceSettings;
  updateSettings: any;
  isLoading: boolean;
  refetch: () => void;
}

type AttendanceStatus = "early" | "regular" | "late";
type WorkQuality = "good" | "bad";

export default function DefinitionsTab({
  settings,
  updateSettings,
  isLoading,
}: IDefinitionsTabProps) {
  const [attendanceStatus, setAttendanceStatus] =
    useState<AttendanceStatus>("regular");
  const [workQuality, setWorkQuality] = useState<WorkQuality>("good");

  const handleOnSubmit = async (formValues: any) => {
    await updateSettings({
      variables: {
        punchInTimeTolerance: Number(formValues.punchInTimeTolerance),
        workAvailabilityDefinition: Number(
          formValues.workAvailabilityDefinition
        ),
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
        {/* Clock in time tolerance */}
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-medium mb-1">
              Clock in time tolerance(Minutes)
            </h3>
            <p className="text-sm text-gray-500 italic">
              The adjustment considers the punch in time based on a work shift.
            </p>
          </div>

          <CustomInputField
            name="punchInTimeTolerance"
            type="number"
            placeholder="20.00"
            min={0}
            max={120}
            wrapperClassName="max-w-full"
          />

          {/* Status Indicators */}
          <div className="flex items-center gap-4 text-sm">
            <button
              type="button"
              //   onClick={() => setAttendanceStatus("early")}
              className={`bg-orange-500 text-white px-4 py-1.5 rounded-full font-medium transition-all ${
                attendanceStatus === "early"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Early
            </button>
            <span className="text-gray-600">Before on time</span>

            <button
              type="button"
              onClick={() => setAttendanceStatus("regular")}
              className={`bg-green-500 text-white px-4 py-1.5 rounded-full font-medium transition-all ${
                attendanceStatus === "regular"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Regular
            </button>
            <span className="text-gray-600">On time to tolerance Late</span>

            <button
              type="button"
              onClick={() => setAttendanceStatus("late")}
              className={`bg-red-500 text-white px-4 py-1.5 rounded-full font-medium transition-all ${
                attendanceStatus === "late"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Late
            </button>
            <span className="text-gray-600">After tolerance</span>
          </div>
        </div>

        {/* Work availability definition */}
        <div className="space-y-3 pt-4 border-t">
          <div>
            <h3 className="text-base font-medium mb-1">
              Work availability definition(Percentage)
            </h3>
            <p className="text-sm text-gray-500 italic">
              The attendance percentage that defines an employee Good or Bad.
            </p>
          </div>

          <CustomInputField
            name="workAvailabilityDefinition"
            type="number"
            placeholder="80"
            min={0}
            max={100}
            wrapperClassName="max-w-full"
          />

          {/* Quality Indicators */}
          <div className="flex items-center gap-4 text-sm">
            <button
              type="button"
              onClick={() => setWorkQuality("good")}
              className={`bg-green-500 text-white px-4 py-1.5 rounded-full font-medium transition-all ${
                workQuality === "good"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Good
            </button>
            <span className="text-gray-600">Equal or above of the percent</span>

            <button
              type="button"
              onClick={() => setWorkQuality("bad")}
              className={`bg-red-500 text-white px-4 py-1.5 rounded-full font-medium transition-all ${
                workQuality === "bad"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Bad
            </button>
            <span className="text-gray-600">Bellow the percent</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
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
