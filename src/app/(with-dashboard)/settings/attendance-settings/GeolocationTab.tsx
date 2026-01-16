"use client";

import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import {
  BUSINESS_SETTING_BY_BUSINESS_ID,
  UPDATE_BUSINESS_SETTING,
} from "@/graphql/business-settings.api";
import { IAttendanceSettings, IBusinessSetting } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { MdLocationOn, MdInfo, MdOpenInNew } from "react-icons/md";

// ==================== INTERFACES ====================
interface IGeolocationTabProps {
  settings?: IAttendanceSettings;
  updateSettings: any;
  isLoading: boolean;
  refetch: () => void;
}

interface IFormValues {
  isGeoFencingEnabled: boolean;
  googleMapApiKey?: string;
}

// ==================== LOADING SKELETON SUB-COMPONENT ====================
function GeolocationTabLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 animate-pulse">
      {/* HEADER SKELETON */}
      <div className="space-y-3">
        <div className="h-6 w-48 bg-gray-300 rounded"></div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* INFO BOX SKELETON */}
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* BUTTON SKELETON */}
      <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
        <div className="h-10 w-full sm:w-32 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

// ==================== GEOLOCATION TAB COMPONENT ====================
export default function GeolocationTab({
  settings,
  updateSettings,
  isLoading,
}: IGeolocationTabProps) {
  // ==================== QUERIES ====================
  const { data, loading } = useQuery<{
    businessSettingByBusinessId: {
      data: IBusinessSetting;
    };
  }>(BUSINESS_SETTING_BY_BUSINESS_ID, {
    variables: {
      businessId: settings?.businessId,
    },
    skip: !settings?.businessId,
  });

  // ==================== MUTATIONS ====================
  const [updateBusinessSetting, updateResult] = useMutation(
    UPDATE_BUSINESS_SETTING,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: BUSINESS_SETTING_BY_BUSINESS_ID,
          variables: { businessId: settings?.businessId },
        },
      ],
    }
  );

  // ==================== COMPUTED VALUES ====================
  const businessSettings = data?.businessSettingByBusinessId?.data;

  // ==================== HANDLERS ====================
  const handleOnSubmit = async (formValues: IFormValues) => {
    try {
      // SAVE GEO FENCING TO ATTENDANCE SETTINGS
      await updateSettings({
        variables: {
          isGeoFencingEnabled: formValues.isGeoFencingEnabled,
        },
      });

      // SAVE GOOGLE MAPS API KEY TO BUSINESS SETTINGS
      if (formValues.googleMapApiKey && settings?.businessId) {
        await updateBusinessSetting({
          variables: {
            businessId: settings.businessId,
            updateBusinessSettingInput: {
              googleApiKey: formValues.googleMapApiKey,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error updating geolocation settings:", error);
    }
  };

  // SHOW SKELETON WHILE LOADING
  if (isLoading || loading || updateResult.loading) {
    return <GeolocationTabLoadingSkeleton />;
  }

  // ==================== RENDER ====================
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CustomForm
        submitHandler={handleOnSubmit}
        defaultValues={{
          isGeoFencingEnabled: settings?.isGeoFencingEnabled ?? false,
          googleMapApiKey: businessSettings?.googleApiKey || "",
        }}
        className="p-4 sm:p-6 space-y-6"
      >
        {/* GEOLOCATION SERVICE SECTION */}
        <div className="space-y-4 p-4 bg-linear-to-br from-purple-50/50 to-pink-50/30 rounded-lg border border-purple-100/50">
          {/* HEADER WITH ICON */}
          <div className="flex items-start gap-3">
            <MdLocationOn className="text-purple-600 text-2xl shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Geolocation Service
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Track employee location when they punch in using Google Maps
                integration
              </p>
            </div>
          </div>

          {/* TOGGLE SWITCH */}
          <div className="flex items-center gap-3 p-3 bg-white/80 rounded-md border border-purple-200/50">
            <ToggleSwitch name="isGeoFencingEnabled" />
            <span className="text-sm sm:text-base font-medium text-gray-700">
              Enable Geolocation Tracking
            </span>
          </div>

          {/* INFO ALERT */}
          <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-md border border-blue-200">
            <MdInfo className="text-blue-600 text-xl shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
                <span className="font-semibold">Google Maps Integration:</span>{" "}
                This service captures employee location data during punch-in
                events. You need a Google Maps API key to enable this feature.
                Create an account on Google Cloud Platform to obtain your API
                key.
              </p>
            </div>
          </div>
        </div>

        {/* API KEY CONFIGURATION SECTION */}
        <div className="space-y-4 p-4 bg-linear-to-br from-indigo-50/50 to-blue-50/30 rounded-lg border border-indigo-100/50">
          {/* HEADER */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              Google Maps API Key
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Enter your Google Maps API key to enable location tracking
            </p>
          </div>

          {/* API KEY INPUT */}
          <div className="space-y-3">
            <CustomInputField
              name="googleMapApiKey"
              type="text"
              placeholder="AIzaSyDz4_lORmoUdOKmYle0iYEgnrhIV-pEzeQ"
              wrapperClassName="max-w-full"
            />

            {/* HELP LINK */}
            <a
              href="https://developers.google.com/maps/documentation/javascript/get-api-key"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              <MdOpenInNew className="text-base" />
              <span>Learn how to get your Google Maps API key</span>
            </a>
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
