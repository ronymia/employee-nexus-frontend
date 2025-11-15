"use client";

import { useState } from "react";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { IAttendanceSettings } from "@/types/attendance-settings.type";

interface IGeolocationTabProps {
  settings?: IAttendanceSettings;
  updateSettings: any;
  isLoading: boolean;
  refetch: () => void;
}

export default function GeolocationTab({
  settings,
  updateSettings,
  isLoading,
}: IGeolocationTabProps) {
  const [geoEnabled, setGeoEnabled] = useState(
    settings?.isGeoLocationEnabled ?? false
  );
  const [apiKey, setApiKey] = useState("");

  const handleOnSubmit = async (formValues: any) => {
    await updateSettings({
      variables: {
        isGeoLocationEnabled: formValues.isGeoLocationEnabled,
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
          googleMapApiKey: "",
        }}
        className="space-y-6"
      >
        {/* Chose geolocation service */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">Chose geolocation service</h3>

          <div className="flex items-center gap-x-3">
            <ToggleSwitch
              name="isGeoLocationEnabled"
              onChange={(value) => setGeoEnabled(value)}
            />
            <span className="text-sm font-medium">Enable</span>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Note:</span> Google Map is a map
              and location service provider which is integrated with this app to
              get the Geolocation data of an employee when Punching In. Create
              an account to this website for the api key which is must need to
              get the location data..
            </p>
          </div>

          {/* API Key Input */}
          {geoEnabled && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Api key
              </label>
              <CustomInputField
                name="googleMapApiKey"
                type="text"
                placeholder="AIzaSyDz4_lORmoUdOKmYle0iYEgnrhIV-pEzeQ"
                wrapperClassName="max-w-full"
              />
              <a
                href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Learn how to get the api key
              </a>
            </div>
          )}
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
