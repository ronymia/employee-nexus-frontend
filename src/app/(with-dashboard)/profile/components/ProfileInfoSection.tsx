"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_PROFILE } from "@/graphql/profile.api";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import FormActionButton from "@/components/form/FormActionButton";
import { userProfileSchema } from "@/schemas/user.schema";
import { FiEdit2 } from "react-icons/fi";
import dayjs from "dayjs";
import { GenderRadio, MaritalStatusRadio } from "@/components/input-fields";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import { IUser } from "@/types";

interface ProfileInfoSectionProps {
  user: IUser;
  refetch: () => void;
  showAddress?: boolean;
}

export default function ProfileInfoSection({
  user,
  refetch,
  showAddress = false,
}: ProfileInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      setIsEditing(false);
      refetch();
    },
  });

  const handleSubmit = async (formValues: any) => {
    try {
      // Remove email from submission as it's not part of profile update
      const { email, ...profileData } = formValues;

      const result = await updateProfile({
        variables: {
          updateProfileInput: {
            ...profileData,
            id: Number(user?.profile?.id),
            profilePicture: user?.profile?.profilePicture || "",
          },
        },
        fetchPolicy: "no-cache",
      });

      if (result.data) {
        console.log(result);
        // onClose();
      }
    } catch (error) {
      console.error("Error submitting employee:", error);
    }
  };

  const profile = user?.profile;

  if (!showAddress) {
    // Personal Info Tab
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Personal Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-sm btn-primary"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <CustomForm
            submitHandler={handleSubmit}
            resolver={userProfileSchema}
            defaultValues={{
              fullName: profile?.fullName || "",
              dateOfBirth: profile?.dateOfBirth || "",
              gender: profile?.gender || "",
              maritalStatus: profile?.maritalStatus || "",
              phone: profile?.phone || "",
              address: profile?.address || "",
              city: profile?.city || "",
              country: profile?.country || "",
              postcode: profile?.postcode || "",
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInputField
                name="fullName"
                label="Full Name"
                placeholder="Enter full name"
                required
              />
              <CustomInputField
                name="phone"
                label="Phone Number"
                placeholder="Enter phone number"
                required
              />
              <CustomDatePicker
                name="dateOfBirth"
                dataAuto="dateOfBirth"
                label="Date of Birth"
                placeholder="DD-MM-YYYY"
                required
              />
              <GenderRadio name="gender" dataAuto="gender-select" required />
              <MaritalStatusRadio
                name="maritalStatus"
                dataAuto="marital-status-select"
                required
              />
            </div>

            <CustomInputField
              name="address"
              label="Address"
              placeholder="Enter address"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomInputField
                name="city"
                label="City"
                placeholder="Enter city"
                required
              />
              <CustomInputField
                name="country"
                label="Country"
                placeholder="Enter country"
                required
              />
              <CustomInputField
                name="postcode"
                label="Postcode"
                placeholder="Enter postcode"
                required
              />
            </div>

            <FormActionButton
              isPending={loading}
              cancelHandler={() => setIsEditing(false)}
            />
          </CustomForm>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Full Name" value={profile?.fullName} />
            <InfoItem label="Phone Number" value={profile?.phone} />
            <InfoItem
              label="Date of Birth"
              value={
                profile?.dateOfBirth
                  ? dayjs(profile.dateOfBirth).format("DD MMM YYYY")
                  : "N/A"
              }
            />
            <InfoItem label="Gender" value={profile?.gender} />
            <InfoItem label="Marital Status" value={profile?.maritalStatus} />
          </div>
        )}
      </div>
    );
  }

  // Address Tab
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Address Information
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-sm btn-primary"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <CustomForm
          submitHandler={handleSubmit}
          resolver={userProfileSchema}
          defaultValues={{
            fullName: profile?.fullName || "",
            dateOfBirth: profile?.dateOfBirth || "",
            gender: profile?.gender || "",
            maritalStatus: profile?.maritalStatus || "",
            phone: profile?.phone || "",
            address: profile?.address || "",
            city: profile?.city || "",
            country: profile?.country || "",
            postcode: profile?.postcode || "",
          }}
          className="space-y-4"
        >
          <CustomInputField
            name="address"
            label="Address"
            placeholder="Enter address"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomInputField
              name="city"
              label="City"
              placeholder="Enter city"
              required
            />
            <CustomInputField
              name="country"
              label="Country"
              placeholder="Enter country"
              required
            />
            <CustomInputField
              name="postcode"
              label="Postcode"
              placeholder="Enter postcode"
              required
            />
          </div>

          {/* Hidden fields to satisfy schema */}
          <input type="hidden" name="fullName" />
          <input type="hidden" name="dateOfBirth" />
          <input type="hidden" name="gender" />
          <input type="hidden" name="maritalStatus" />
          <input type="hidden" name="phone" />

          <FormActionButton
            isPending={loading}
            cancelHandler={() => setIsEditing(false)}
          />
        </CustomForm>
      ) : (
        <div className="space-y-4">
          <InfoItem label="Address" value={profile?.address} fullWidth />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoItem label="City" value={profile?.city} />
            <InfoItem label="Country" value={profile?.country} />
            <InfoItem label="Postcode" value={profile?.postcode} />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value?: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-base font-medium text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}
