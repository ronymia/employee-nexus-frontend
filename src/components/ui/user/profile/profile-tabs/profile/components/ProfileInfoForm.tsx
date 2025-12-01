"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import { IEmployee } from "@/types";
import dayjs from "dayjs";
import { useMutation } from "@apollo/client/react";
import { UPDATE_PROFILE } from "@/graphql/profile.api";
import { GET_EMPLOYEE_BY_ID } from "@/graphql/employee.api";

interface ProfileInfoFormProps {
  employee?: IEmployee;
  onClose: () => void;
}

export default function ProfileInfoForm({
  employee,
  onClose,
}: ProfileInfoFormProps) {
  // MUTATION TO UPDATE PROFILE
  const [updateProfile, updateResult] = useMutation(UPDATE_PROFILE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_EMPLOYEE_BY_ID, variables: { id: Number(employee?.id) } },
    ],
  });

  const handleSubmit = async (formValues: any) => {
    try {
      // Remove email from submission as it's not part of profile update
      const { email, ...profileData } = formValues;

      const result = await updateProfile({
        variables: {
          updateProfileInput: {
            ...profileData,
            id: Number(employee?.profile?.id),
            profilePicture: employee?.profile?.profilePicture || "",
          },
        },
        fetchPolicy: "no-cache",
      });

      if (result.data) {
        console.log(result);
        onClose();
      }
    } catch (error) {
      console.error("Error submitting employee:", error);
    }
  };

  const defaultValues = {
    fullName: employee?.profile?.fullName || "",
    email: employee?.email || "",
    phone: employee?.profile?.phone || "",
    dateOfBirth: employee?.profile?.dateOfBirth
      ? dayjs(employee.profile.dateOfBirth, "DD-MM-YYYY").format("DD-MM-YYYY")
      : "",
    gender: employee?.profile?.gender || "",
    maritalStatus: employee?.profile?.maritalStatus || "",
    address: employee?.profile?.address || "",
    city: employee?.profile?.city || "",
    country: employee?.profile?.country || "",
    postcode: employee?.profile?.postcode || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <div className="space-y-4">
        {/* Personal Information Section */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInputField
              dataAuto="fullName"
              name="fullName"
              type="text"
              label="Full Name"
              placeholder="Enter full name"
              required={true}
            />
            <CustomInputField
              dataAuto="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter email"
              required={true}
              readOnly={true}
            />
            <CustomInputField
              dataAuto="phone"
              name="phone"
              type="tel"
              label="Phone"
              placeholder="Enter phone number"
              required={true}
            />
            <CustomDatePicker
              dataAuto="dateOfBirth"
              name="dateOfBirth"
              label="Date of Birth"
              required={false}
              formatDate="DD-MM-YYYY"
            />
            <CustomSelect
              dataAuto="gender"
              name="gender"
              label="Gender"
              placeholder="Select gender"
              required={false}
              isLoading={false}
              options={[
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
                { label: "Other", value: "OTHER" },
              ]}
            />
            <CustomSelect
              dataAuto="maritalStatus"
              name="maritalStatus"
              label="Marital Status"
              placeholder="Select status"
              required={false}
              isLoading={false}
              options={[
                { label: "Single", value: "SINGLE" },
                { label: "Married", value: "MARRIED" },
                { label: "Divorced", value: "DIVORCED" },
                { label: "Widowed", value: "WIDOWED" },
              ]}
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Address Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <CustomTextareaField
                dataAuto="address"
                name="address"
                label="Street Address"
                placeholder="Enter street address"
                required={false}
                rows={2}
              />
            </div>
            <CustomInputField
              dataAuto="city"
              name="city"
              type="text"
              label="City"
              placeholder="Enter city"
              required={false}
            />
            <CustomInputField
              dataAuto="country"
              name="country"
              type="text"
              label="Country"
              placeholder="Enter country"
              required={false}
            />
            <CustomInputField
              dataAuto="postcode"
              name="postcode"
              type="text"
              label="Postcode"
              placeholder="Enter postcode"
              required={false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <FormActionButton
          isPending={updateResult.loading}
          cancelHandler={onClose}
        />
      </div>
    </CustomForm>
  );
}
