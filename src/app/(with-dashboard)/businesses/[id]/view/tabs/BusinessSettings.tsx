"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  MdSettings,
  MdLanguage,
  MdCalendarToday,
  MdNotifications,
  MdLabel,
  MdPalette,
  MdSave,
} from "react-icons/md";

import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import {
  BUSINESS_SETTING_BY_BUSINESS_ID,
  UPDATE_BUSINESS_SETTING,
} from "@/graphql/business-settings.api";
import * as z from "zod";
import { generateWeekDays } from "@/utils/date-time.utils";
import { IBusinessSetting } from "@/types";

// ==================== INTERFACES ====================
interface IBusinessSettingsProps {
  businessId: number;
}

// ==================== VALIDATION SCHEMA ====================
const businessSettingsSchema = z.object({
  businessStartDay: z.coerce.number().min(0).max(6),
  businessTimeZone: z.string().nonempty("Timezone is required"),
  currency: z.string().nonempty("Currency is required"),
  deleteReadNotifications: z.string().nonempty("Required"),
  identifierPrefix: z
    .string()
    .nonempty("Prefix is required")
    .max(10, "Max 10 characters"),
  theme: z.string().optional(),
});

// ==================== ANIMATION VARIANTS ====================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// ==================== LOADING SKELETON SUB-COMPONENT ====================
function SettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto md:p-4 space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            <div className="h-12 bg-gray-100 rounded animate-pulse" />
            <div className="h-12 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function BusinessSettings({
  businessId,
}: IBusinessSettingsProps) {
  // ==================== STATE ====================
  const [isEditing, setIsEditing] = useState(false);

  // ==================== QUERIES ====================
  const { data, loading } = useQuery<{
    businessSettingByBusinessId: {
      data: IBusinessSetting;
    };
  }>(BUSINESS_SETTING_BY_BUSINESS_ID, {
    variables: {
      businessId: businessId,
    },
    skip: !businessId,
  });

  // ==================== MUTATIONS ====================
  const [updateBusinessSetting, updateResult] = useMutation(
    UPDATE_BUSINESS_SETTING,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: BUSINESS_SETTING_BY_BUSINESS_ID,
          variables: { businessId },
        },
      ],
    }
  );

  // ==================== HANDLERS ====================
  const handleSubmit = async (formValues: any) => {
    try {
      await updateBusinessSetting({
        variables: {
          businessId,
          updateBusinessSettingInput: {
            businessId,
            ...formValues,
          },
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating business settings:", error);
    }
  };

  // ==================== COMPUTED VALUES ====================
  const settings = data?.businessSettingByBusinessId?.data;

  // Currency options
  const currencyOptions = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "BDT", label: "BDT - Bangladeshi Taka" },
    { value: "INR", label: "INR - Indian Rupee" },
    { value: "JPY", label: "JPY - Japanese Yen" },
    { value: "CNY", label: "CNY - Chinese Yuan" },
  ];

  // Timezone options (common timezones)
  const timezoneOptions = [
    { value: "Asia/Dhaka", label: "Asia/Dhaka (GMT+6)" },
    { value: "America/New_York", label: "America/New_York (EST)" },
    { value: "America/Los_Angeles", label: "America/Los_Angeles (PST)" },
    { value: "Europe/London", label: "Europe/London (GMT)" },
    { value: "Europe/Paris", label: "Europe/Paris (CET)" },
    { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
    { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
    { value: "Australia/Sydney", label: "Australia/Sydney (AEDT)" },
  ];

  // Start day options
  const startDayOptions = generateWeekDays({ startOfWeekDay: 0 }).map(
    (item) => ({
      value: item.dayOfWeek,
      label: item.name,
    })
  );

  // Notification deletion options
  const notificationOptions = [
    { value: "7", label: "7 days" },
    { value: "14", label: "14 days" },
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    { value: "never", label: "Never delete" },
  ];

  // ==================== LOADING STATE ====================
  if (loading) {
    return <SettingsSkeleton />;
  }

  // ==================== RENDER ====================
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto md:p-4 space-y-6"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <MdSettings className="text-2xl text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Business Settings
            </h1>
            <p className="text-sm text-base-content/60">
              Configure your business preferences
            </p>
          </div>
        </div>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="btn btn-primary btn-sm"
          >
            <MdSettings className="text-lg" />
            Edit Settings
          </motion.button>
        )}
      </div>

      <CustomForm
        submitHandler={handleSubmit}
        resolver={businessSettingsSchema}
        defaultValues={{
          businessStartDay: settings?.businessStartDay || 0,
          businessTimeZone: settings?.businessTimeZone || "Asia/Dhaka",
          currency: settings?.currency || "USD",
          deleteReadNotifications: settings?.deleteReadNotifications || "30",
          identifierPrefix: settings?.identifierPrefix || "",
          theme: settings?.theme || "",
        }}
        className="space-y-6"
      >
        {/* GENERAL SETTINGS */}
        <motion.div
          variants={cardVariants}
          className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <MdCalendarToday className="text-xl text-primary" />
            <h2 className="text-lg font-semibold text-base-content">
              General Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Start Day */}
            <CustomSelect
              dataAuto="businessStartDay"
              name="businessStartDay"
              label="Business Start Day"
              placeholder="Select start day"
              options={startDayOptions}
              required
              disabled={!isEditing || updateResult.loading}
              isLoading={loading}
            />

            {/* Identifier Prefix */}
            <CustomInputField
              name="identifierPrefix"
              label="Identifier Prefix"
              placeholder="e.g., ETB"
              required
              maxLength={10}
              disabled={!isEditing || updateResult.loading}
            />
          </div>
        </motion.div>

        {/* LOCALIZATION SETTINGS */}
        <motion.div
          variants={cardVariants}
          className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <MdLanguage className="text-xl text-success" />
            <h2 className="text-lg font-semibold text-base-content">
              Localization
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timezone */}
            <CustomSelect
              dataAuto="businessTimeZone"
              name="businessTimeZone"
              label="Business Timezone"
              placeholder="Select timezone"
              options={timezoneOptions}
              required
              disabled={!isEditing || updateResult.loading}
              isLoading={loading}
            />

            {/* Currency */}
            <CustomSelect
              dataAuto="currency"
              name="currency"
              label="Currency"
              placeholder="Select currency"
              options={currencyOptions}
              required
              disabled={!isEditing || updateResult.loading}
              isLoading={loading}
            />
          </div>
        </motion.div>

        {/* NOTIFICATION SETTINGS */}
        <motion.div
          variants={cardVariants}
          className="bg-linear-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <MdNotifications className="text-xl text-warning" />
            <h2 className="text-lg font-semibold text-base-content">
              Notification Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Delete Read Notifications */}
            <CustomSelect
              dataAuto="deleteReadNotifications"
              name="deleteReadNotifications"
              label="Delete Read Notifications After"
              placeholder="Select duration"
              options={notificationOptions}
              required
              disabled={!isEditing || updateResult.loading}
              isLoading={loading}
            />
          </div>
        </motion.div>

        {/* APPEARANCE SETTINGS */}
        <motion.div
          variants={cardVariants}
          className="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <MdPalette className="text-xl text-secondary" />
            <h2 className="text-lg font-semibold text-base-content">
              Appearance
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Theme */}
            <CustomInputField
              name="theme"
              label="Theme"
              placeholder="e.g., dark, light"
              disabled={!isEditing || updateResult.loading}
            />
          </div>
        </motion.div>

        {/* ACTION BUTTONS */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end gap-3 pt-4 border-t"
          >
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-ghost"
              disabled={updateResult.loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updateResult.loading}
            >
              {updateResult.loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Saving...
                </>
              ) : (
                <>
                  <MdSave className="text-lg" />
                  Save Settings
                </>
              )}
            </button>
          </motion.div>
        )}
      </CustomForm>

      {/* INFO CARD */}
      {!isEditing && (
        <motion.div
          variants={cardVariants}
          className="bg-info/10 border border-info/20 rounded-lg p-4"
        >
          <div className="flex items-start gap-2">
            <MdLabel className="text-xl text-info shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-base-content">
                Settings Information
              </p>
              <p className="text-base-content/60 mt-1">
                These settings control how your business operates within the
                system. Click "Edit Settings" to make changes.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
