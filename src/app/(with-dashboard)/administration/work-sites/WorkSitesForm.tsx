"use client";

import { showToast } from "@/components/ui/CustomToast";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomRadioButton from "@/components/form/input/CustomRadioButton";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomAddressAutocomplete from "@/components/form/input/CustomAddressAutocomplete";
import CustomGoogleMap from "@/components/map/CustomGoogleMap";
import { useFormContext } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useState, useCallback } from "react";
import {
  CREATE_WORK_SITES,
  GET_WORK_SITES,
  UPDATE_WORK_SITES,
} from "@/graphql/work-sites.api";
import {
  workSiteSchema,
  IWorkSiteFormData,
  LocationTrackingType,
} from "@/schemas";
import { IWorkSite } from "@/types";

// ========================
// INTERFACES
// ========================
interface WorkSiteFormProps {
  handleClosePopup: () => void;
  data: IWorkSite;
}

interface WorkSiteFormFieldsProps {
  createResult: any;
  updateResult: any;
  handleClosePopup: () => void;
  initialLocation: { lat: number; lng: number } | null;
}

interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

// ========================
// HELPER FUNCTIONS
// ========================
const prepareFormData = (formValues: IWorkSiteFormData): any => {
  const prepared: any = { ...formValues };

  // Convert maxRadius to number
  if (prepared.maxRadius && typeof prepared.maxRadius === "string") {
    prepared.maxRadius = Number(prepared.maxRadius);
  }

  // Clean up based on location tracking type
  if (prepared.locationTrackingType === LocationTrackingType.NONE) {
    // Delete all location-related fields
    delete prepared.address;
    delete prepared.lat;
    delete prepared.lng;
    delete prepared.maxRadius;
    delete prepared.ipAddress;
  } else if (
    prepared.locationTrackingType === LocationTrackingType.GEO_FENCING
  ) {
    // Delete IP fields
    delete prepared.ipAddress;
  } else if (
    prepared.locationTrackingType === LocationTrackingType.IP_WHITELIST
  ) {
    // Delete geo fields
    delete prepared.address;
    delete prepared.lat;
    delete prepared.lng;
    delete prepared.maxRadius;
  }

  return prepared;
};

// ========================
// MAIN COMPONENT
// ========================
export default function WorkSiteForm({
  handleClosePopup,
  data,
}: WorkSiteFormProps) {
  // MUTATION TO CREATE A NEW
  const [createWorkSite, createResult] = useMutation(CREATE_WORK_SITES, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_WORK_SITES }],
  });

  // MUTATION TO UPDATE AN EXISTING
  const [updateWorkSite, updateResult] = useMutation(UPDATE_WORK_SITES, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_WORK_SITES }],
  });

  // HANDLER FOR FORM SUBMISSION
  const handleOnSubmit = async (formValues: IWorkSiteFormData) => {
    try {
      console.log({ formValues });
      const preparedData = prepareFormData(formValues);

      if (data?.id) {
        preparedData.id = Number(data.id);
        const res = await updateWorkSite({
          variables: {
            updateWorkSiteInput: preparedData,
          },
        });
        if (res?.data) {
          showToast.success("Updated!", "Work site updated successfully");
          handleClosePopup();
        }
      } else {
        const res = await createWorkSite({
          variables: { createWorkSiteInput: preparedData },
        });
        if (res?.data) {
          showToast.success("Created!", "Work site created successfully");
          handleClosePopup();
        }
      }
    } catch (error: any) {
      showToast.error(
        "Error",
        error.message || `Failed to ${data?.id ? "update" : "create"} work site`
      );
    }
  };

  const defaultValues = {
    ...data,
    locationTrackingType:
      data?.locationTrackingType || LocationTrackingType.NONE,
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <CustomForm
        submitHandler={handleOnSubmit}
        resolver={workSiteSchema}
        defaultValues={defaultValues}
        className="flex flex-col gap-y-4"
      >
        <WorkSiteFormFields
          createResult={createResult}
          updateResult={updateResult}
          handleClosePopup={handleClosePopup}
          initialLocation={
            data?.lat && data?.lng ? { lat: data.lat, lng: data.lng } : null
          }
        />
      </CustomForm>
    </APIProvider>
  );
}

// ========================
// FORM FIELDS COMPONENT
// ========================
function WorkSiteFormFields({
  createResult,
  updateResult,
  handleClosePopup,
  initialLocation,
}: WorkSiteFormFieldsProps) {
  const { watch, setValue } = useFormContext();
  const [mapLocation, setMapLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(initialLocation);

  // Watch form values
  const locationTrackingType = watch("locationTrackingType");
  const maxRadius = watch("maxRadius");

  // Determine which fields to show
  const showGeoFields =
    locationTrackingType === LocationTrackingType.GEO_FENCING;
  const showIPFields =
    locationTrackingType === LocationTrackingType.IP_WHITELIST;
  // const showLocationFields = locationTrackingType !== LocationTrackingType.NONE;

  // Handle location updates
  const handleLocationUpdate = useCallback(
    (lat: number, lng: number) => {
      setMapLocation({ lat, lng });
      setValue("lat", lat, { shouldValidate: false });
      setValue("lng", lng, { shouldValidate: false });
    },
    [setValue]
  );

  const handleAddressSelect = useCallback(
    (data: LocationData) => {
      handleLocationUpdate(data.lat, data.lng);
    },
    [handleLocationUpdate]
  );

  const handleDetectIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setValue("ipAddress", data.ip, { shouldValidate: true });
      showToast.success("Success", `IP address detected: ${data.ip}`);
    } catch (error) {
      console.error("Failed to fetch IP:", error);
      showToast.error(
        "Error",
        "Failed to detect IP address. Please enter manually."
      );
    }
  };

  const isPending = createResult.loading || updateResult.loading;

  return (
    <>
      {/* BASIC INFORMATION */}
      <section className="space-y-3">
        <CustomInputField
          name="name"
          label="Work Site Name"
          placeholder="e.g., Main Office, Branch 1"
          required
        />
        <CustomTextareaField
          name="description"
          label="Description"
          placeholder="Describe the work site..."
          required
          rows={3}
        />
      </section>

      {/* LOCATION TRACKING */}
      <section className="space-y-4">
        <div className="space-y-4">
          <CustomRadioButton
            required
            dataAuto="locationTrackingType"
            name="locationTrackingType"
            label="Location Tracking Type"
            radioGroupClassName="grid-cols-3"
            options={[
              { title: "🚫 None", value: LocationTrackingType.NONE },
              // { title: "📝 Manual", value: LocationTrackingType.MANUAL },
              {
                title: "📍 Geo-Fencing",
                value: LocationTrackingType.GEO_FENCING,
              },
              {
                title: "🌐 IP Whitelist",
                value: LocationTrackingType.IP_WHITELIST,
              },
            ]}
          />

          {/* GEO LOCATION SECTION */}
          {showGeoFields && (
            <GeoLocationSection
              mapLocation={mapLocation}
              maxRadius={maxRadius}
              onAddressSelect={handleAddressSelect}
              onLocationChange={handleLocationUpdate}
            />
          )}

          {/* IP ADDRESS SECTION */}
          {showIPFields && <IPAddressSection onDetectIP={handleDetectIP} />}
        </div>
      </section>

      {/* FORM ACTIONS */}
      <FormActionButton
        cancelHandler={handleClosePopup}
        isPending={isPending}
      />
    </>
  );
}

// ========================
// GEO LOCATION SECTION
// ========================
function GeoLocationSection({
  mapLocation,
  maxRadius,
  onAddressSelect,
  onLocationChange,
}: {
  mapLocation: { lat: number; lng: number } | null;
  maxRadius: number;
  onAddressSelect: (data: LocationData) => void;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="alert alert-info py-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="text-xs">
          Search for an address or drag the marker to set the exact location
        </span>
      </div>

      <CustomAddressAutocomplete
        name="address"
        label="Work Site Address"
        placeholder="Search for an address..."
        onAddressSelect={onAddressSelect}
      />

      <CustomInputField
        name="maxRadius"
        label="Max Radius (meters)"
        placeholder="e.g., 500"
        type="number"
      />

      {mapLocation && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Location Map</label>
          <CustomGoogleMap
            location={mapLocation}
            height="350px"
            radius={maxRadius ? Number(maxRadius) : undefined}
            onLocationChange={onLocationChange}
          />
          <p className="text-xs text-base-content/60">
            📍 Drag the marker to adjust the exact location | 🔵 Blue circle
            shows the allowed check-in area
          </p>
        </div>
      )}
    </div>
  );
}

// ========================
// IP ADDRESS SECTION
// ========================
function IPAddressSection({ onDetectIP }: { onDetectIP: () => Promise<void> }) {
  return (
    <div className="space-y-3">
      <div className="alert alert-info py-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="text-xs">
          Employees can only check-in from this IP address
        </span>
      </div>

      <CustomInputField
        name="ipAddress"
        label="IP Address"
        placeholder="e.g., 192.168.1.1 or 203.0.113.45"
      />

      <button
        type="button"
        className="btn btn-sm btn-outline w-full"
        onClick={onDetectIP}
      >
        🌐 Auto-Detect My Current IP
      </button>

      <p className="text-xs text-base-content/60">
        💡 Tip: Use your office's static public IP address for best results
      </p>
    </div>
  );
}
