// components/BusinessSettingsConfig.tsx
"use client";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import CustomPopup from "@/components/modal/CustomPopup";
import FieldView from "@/components/form/FieldView";
import {
  BUSINESS_SETTING_BY_BUSINESS_ID,
  UPDATE_BUSINESS_SETTING,
} from "@/graphql/business.api";
import { IBusinessSettingsFormData, businessSettingsSchema } from "@/schemas";
import { IBusinessSetting } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { generateWeekDays } from "@/utils/date-time.utils";
import usePopupOption from "@/hooks/usePopupOption";

export default function BusinessSettingsConfig() {
  const { popupOption, setPopupOption } = usePopupOption();

  const { data, loading, refetch } = useQuery<{
    businessSettingByBusinessId: {
      data: IBusinessSetting;
    };
  }>(BUSINESS_SETTING_BY_BUSINESS_ID);

  const [updateBusinessSetting, updateResult] = useMutation(
    UPDATE_BUSINESS_SETTING,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: BUSINESS_SETTING_BY_BUSINESS_ID }],
    }
  );

  const handleSubmit = async (formValues: IBusinessSettingsFormData) => {
    console.log({ formValues });
    const input = {
      businessStartDay: formValues.businessStartDay,
      businessTimeZone: formValues.businessTimeZone || null,
      currency: formValues.currency || null,
      deleteReadNotifications: formValues.deleteReadNotifications || null,
      identifierPrefix: formValues.identifierPrefix || null,
      isSelfRegistered: formValues.isSelfRegistered || null,
      theme: formValues.theme || null,
    };
    await updateBusinessSetting({
      variables: {
        updateBusinessSettingInput: input,
      },
    }).then(() => {
      setPopupOption((prev) => ({ ...prev, open: false }));
    });
  };

  const businessSetting = data?.businessSettingByBusinessId?.data;

  const weekDays = generateWeekDays({ startOfWeekDay: 0 });
  const businessStartDayName = weekDays.find(
    (day) => day.value === parseInt(businessSetting?.businessStartDay || "0")
  )?.name;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`max-w-3xl mx-auto p-6 space-y-6`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between bg-base-300 p-6 rounded-lg shadow`}
      >
        <h2 className={`text-2xl font-bold text-green-950`}>
          Business Configuration
        </h2>
        <button
          type="button"
          onClick={() =>
            setPopupOption({
              open: true,
              closeOnDocumentClick: true,
              actionType: "update",
              form: "",
              data: null,
              title: "Edit Business Configuration",
            })
          }
          className={`bg-linear-to-tl to-primary shadow-md from-primary hover:bg-green-700 text-base-300 font-semibold px-4 py-2 rounded-md`}
        >
          Edit Configuration
        </button>
      </div>

      {/* View */}
      <div
        className={`bg-base-300 p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4`}
      >
        <FieldView
          label="Business Start Day"
          value={businessStartDayName || ""}
        />
        <FieldView
          label="Business Time Zone"
          value={businessSetting?.businessTimeZone || ""}
        />
        {/* <FieldView label="Currency" value={businessSetting?.currency || ""} /> */}
        <FieldView
          label="Delete Read Notifications"
          value={businessSetting?.deleteReadNotifications ? "Yes" : "No"}
        />
        <FieldView
          label="Identifier Prefix"
          value={businessSetting?.identifierPrefix || ""}
        />
        <FieldView
          label="Is Self Registered"
          value={businessSetting?.isSelfRegistered ? "Yes" : "No"}
        />
        {/* <FieldView label="Theme" value={businessSetting?.theme || ""} /> */}
      </div>

      {/* Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        <CustomForm
          submitHandler={handleSubmit}
          resolver={businessSettingsSchema}
          defaultValues={{
            businessStartDay: businessSetting?.businessStartDay
              ? parseInt(businessSetting.businessStartDay)
              : 0,
            businessTimeZone: businessSetting?.businessTimeZone || "",
            currency: businessSetting?.currency || "",
            deleteReadNotifications:
              businessSetting?.deleteReadNotifications || false,
            identifierPrefix: businessSetting?.identifierPrefix || "",
            isSelfRegistered: businessSetting?.isSelfRegistered || false,
            theme: businessSetting?.theme || "",
          }}
          className={`flex flex-col gap-3 p-3`}
        >
          <CustomSelect
            name="businessStartDay"
            label="Business Start Day"
            required
            dataAuto="businessStartDay"
            isLoading={false}
            options={weekDays.map((day) => ({
              label: day.name,
              value: day.value.toString(),
            }))}
          />

          <CustomInputField
            name="businessTimeZone"
            label="Business Time Zone"
          />

          {/* <CustomInputField name="currency" label="Currency" /> */}

          <ToggleSwitch
            name="deleteReadNotifications"
            label="Delete Read Notifications"
          />

          <CustomInputField name="identifierPrefix" label="Identifier Prefix" />

          <ToggleSwitch name="isSelfRegistered" label="Is Self Registered" />

          {/* <CustomInputField name="theme" label="Theme" /> */}

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
