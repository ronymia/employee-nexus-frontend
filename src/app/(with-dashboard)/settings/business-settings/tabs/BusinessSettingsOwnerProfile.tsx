"use client";
import { IUser } from "@/types";
import FieldView from "@/components/form/FieldView";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import FormActionButton from "@/components/form/FormActionButton";
import { UPDATE_USER_PROFILE } from "@/graphql/user.api";
import { useMutation } from "@apollo/client/react";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import useAppStore from "@/stores/appStore";
import { userProfileSchema } from "@/schemas/user.schema";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import { GenderRadio, MaritalStatusRadio } from "@/components/input-fields";

interface BusinessSettingsOwnerProfileProps {
  ownerData: IUser;
}

export default function BusinessSettingsOwnerProfile({
  ownerData,
}: BusinessSettingsOwnerProfileProps) {
  const { popupOption, setPopupOption } = usePopupOption();
  const { user } = useAppStore((state) => state);
  const { hasPermission } = usePermissionGuard();

  const [updateUserProfile, updateResult] = useMutation(UPDATE_USER_PROFILE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_BUSINESS_BY_ID, variables: { id: user.businessId } },
    ],
  });

  const handleSubmit = async (formValues: any) => {
    await updateUserProfile({
      variables: {
        updateProfileInput: {
          id: Number(ownerData.profile.id),
          ...formValues,
        },
      },
    }).then(() => {
      setPopupOption((prev) => ({ ...prev, open: false }));
    });
  };

  return (
    <div className={`max-w-3xl mx-auto p-6 space-y-6`}>
      {/* Header */}
      <div
        className={`flex flex-col md:flex-row items-start md:items-center justify-between bg-base-300 p-4 md:p-6 rounded-lg shadow gap-4`}
      >
        <div className={`flex items-center space-x-3 md:space-x-4`}>
          {/* Avatar */}
          <div
            className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-base-100 flex items-center justify-center text-lg md:text-xl font-semibold text-green-950 shrink-0`}
          >
            {ownerData?.profile?.fullName?.charAt(0)}
          </div>
          <div>
            <h2 className={`text-xl md:text-2xl font-bold mb-1 text-green-950`}>
              {ownerData?.profile?.fullName}
            </h2>
            <span
              className={`text-xs md:text-sm text-green-900 font-medium block`}
            >
              {ownerData?.email}
            </span>
            <small
              className={`text-xs md:text-sm text-green-900 block font-medium`}
            >
              {ownerData?.status}
            </small>
          </div>
        </div>
        {hasPermission(Permissions.UserUpdate) && (
          <button
            type={`button`}
            onClick={() =>
              setPopupOption({
                open: true,
                closeOnDocumentClick: true,
                actionType: "update",
                form: "",
                data: ownerData,
                title: "Edit Owner Profile",
              })
            }
            className={`bg-linear-to-tl to-primary shadow-md from-primary hover:bg-green-700 text-base-300 font-semibold px-4 py-2 rounded-md w-full md:w-auto text-sm md:text-base`}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Contact Information */}
      <div
        className={`bg-base-300 p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4`}
      >
        <FieldView label={`Address`} value={ownerData?.profile?.address} />
        <FieldView label={`City`} value={ownerData?.profile?.city} />
        <FieldView label={`Country`} value={ownerData?.profile?.country} />
        <FieldView label={`Postcode`} value={ownerData?.profile?.postcode} />
        <FieldView label={`Phone`} value={ownerData?.profile?.phone} />
        <FieldView
          label={`Date of Birth`}
          value={ownerData?.profile?.dateOfBirth}
        />
        <FieldView label={`Gender`} value={ownerData?.profile?.gender} />
        <FieldView
          label={`Marital Status`}
          value={ownerData?.profile?.maritalStatus}
        />
      </div>

      {/* Edit Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        <CustomForm
          submitHandler={handleSubmit}
          resolver={userProfileSchema}
          defaultValues={{
            fullName: ownerData?.profile?.fullName || "",
            address: ownerData?.profile?.address || "",
            city: ownerData?.profile?.city || "",
            country: ownerData?.profile?.country || "",
            postcode: ownerData?.profile?.postcode || "",
            phone: ownerData?.profile?.phone || "",
            dateOfBirth: ownerData?.profile?.dateOfBirth || "",
            gender: ownerData?.profile?.gender || "",
            maritalStatus: ownerData?.profile?.maritalStatus || "",
          }}
          className={`flex flex-col gap-3 p-3`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CustomInputField
              name="fullName"
              label="Full Name"
              required
              placeholder="Enter full name"
            />
            <CustomInputField
              name="phone"
              label="Phone"
              required
              placeholder="Enter phone number"
            />
            <CustomDatePicker
              dataAuto="dateOfBirth"
              name="dateOfBirth"
              label="Date of Birth"
              required
            />
            <GenderRadio
              name="gender"
              required={true}
              radioGroupClassName="grid-cols-2"
            />
            <MaritalStatusRadio name="maritalStatus" required={true} />
            <CustomInputField
              name="address"
              label="Address"
              required
              placeholder="Enter address"
            />
            <CustomInputField
              name="city"
              label="City"
              required
              placeholder="Enter city"
            />
            <CustomInputField
              name="country"
              label="Country"
              required
              placeholder="Enter country"
            />
            <CustomInputField
              name="postcode"
              label="Postcode"
              required
              placeholder="Enter postcode"
            />
          </div>

          <FormActionButton
            isPending={updateResult.loading}
            cancelHandler={() =>
              setPopupOption((prev) => ({ ...prev, open: false }))
            }
          />
        </CustomForm>
      </CustomPopup>
    </div>
  );
}
