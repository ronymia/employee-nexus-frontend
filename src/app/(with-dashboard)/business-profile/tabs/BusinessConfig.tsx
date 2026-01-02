"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { motion } from "motion/react";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomRadioButton from "@/components/form/input/CustomRadioButton";
import CustomPopup from "@/components/modal/CustomPopup";
import FieldView from "@/components/form/FieldView";
import {
  BUSINESS_SETTING_BY_BUSINESS_ID,
  UPDATE_BUSINESS_SETTING,
} from "@/graphql/business.api";
import { IBusinessSettingsFormData, businessSettingsSchema } from "@/schemas";
import { IBusinessSetting } from "@/types";
import { generateWeekDays } from "@/utils/date-time.utils";
import usePopupOption from "@/hooks/usePopupOption";
import {
  MdSettings,
  MdCalendarToday,
  MdAccessTime,
  MdNotifications,
  MdLabel,
} from "react-icons/md";

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// ==================== BUSINESS CONFIG COMPONENT ====================
export default function BusinessConfig() {
  // ==================== HOOKS ====================
  const { popupOption, setPopupOption } = usePopupOption();

  // FETCH BUSINESS SETTINGS
  const { data, loading } = useQuery<{
    businessSettingByBusinessId: {
      data: IBusinessSetting;
    };
  }>(BUSINESS_SETTING_BY_BUSINESS_ID);

  // UPDATE SETTINGS MUTATION
  const [updateBusinessSetting, updateResult] = useMutation(
    UPDATE_BUSINESS_SETTING,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: BUSINESS_SETTING_BY_BUSINESS_ID }],
    }
  );

  // ==================== HANDLERS ====================
  const handleSubmit = async (formValues: IBusinessSettingsFormData) => {
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
        updateBusinessSettingInput: {
          ...input,
          id: Number(data?.businessSettingByBusinessId.data.id),
        },
      },
    }).then(() => {
      setPopupOption((prev) => ({ ...prev, open: false }));
    });
  };

  // ==================== DERIVED DATA ====================
  const businessSetting = data?.businessSettingByBusinessId?.data;
  const weekDays = generateWeekDays({ startOfWeekDay: 0 });
  const businessStartDayName = weekDays.find(
    (day) => day.value === parseInt(businessSetting?.businessStartDay || "0")
  )?.name;

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-pulse">
        {/* HEADER SKELETON */}
        <div className="bg-gray-200 p-6 rounded-xl h-32"></div>

        {/* CARDS SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 p-5 rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto p-4 md:p-6 space-y-6"
    >
      {/* HEADER */}
      <motion.div
        variants={itemVariants}
        className="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-lg border border-purple-100"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MdSettings className="text-2xl text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content">
                Business Configuration
              </h2>
              <p className="text-sm text-base-content/60">
                Manage your business settings and preferences
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
            className="btn btn-primary btn-sm w-full md:w-auto"
          >
            <MdSettings className="text-lg" />
            Edit Configuration
          </motion.button>
        </div>
      </motion.div>

      {/* CONFIGURATION CARDS */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* BUSINESS START DAY */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-linear-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MdCalendarToday className="text-lg text-primary" />
            </div>
            <div className="flex-1">
              <FieldView
                label="Business Start Day"
                value={businessStartDayName || ""}
              />
            </div>
          </div>
        </motion.div>

        {/* BUSINESS TIME ZONE */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-linear-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-100 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
              <MdAccessTime className="text-lg text-success" />
            </div>
            <div className="flex-1">
              <FieldView
                label="Business Time Zone"
                value={businessSetting?.businessTimeZone || "Not set"}
              />
            </div>
          </div>
        </motion.div>

        {/* DELETE READ NOTIFICATIONS */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-linear-to-br from-orange-50 to-red-50 p-5 rounded-lg border border-orange-100 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
              <MdNotifications className="text-lg text-warning" />
            </div>
            <div className="flex-1">
              <FieldView
                label="Delete Read Notifications"
                value={businessSetting?.deleteReadNotifications || "Not set"}
              />
            </div>
          </div>
        </motion.div>

        {/* IDENTIFIER PREFIX */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-linear-to-br from-yellow-50 to-amber-50 p-5 rounded-lg border border-yellow-100 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center shrink-0">
              <MdLabel className="text-lg text-info" />
            </div>
            <div className="flex-1">
              <FieldView
                label="Identifier Prefix"
                value={businessSetting?.identifierPrefix || "Not set"}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* EDIT MODAL */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
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
            className="flex flex-col gap-4"
          >
            {/* BUSINESS START DAY */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-linear-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MdCalendarToday className="text-lg text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-base-content">
                  Week Configuration
                </h3>
              </div>
              <CustomSelect
                name="businessStartDay"
                label="Business Start Day"
                required
                dataAuto="businessStartDay"
                isLoading={false}
                options={weekDays.map((day) => ({
                  label: day.name,
                  value: day.value,
                }))}
                disabled={updateResult.loading}
              />
            </motion.div>

            {/* TIME ZONE & PREFIX */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-linear-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <MdAccessTime className="text-lg text-success" />
                </div>
                <h3 className="text-lg font-semibold text-base-content">
                  Regional Settings
                </h3>
              </div>
              <div className="space-y-3">
                <CustomInputField
                  name="businessTimeZone"
                  label="Business Time Zone"
                  placeholder="e.g., America/New_York"
                  disabled={updateResult.loading}
                />
                <CustomInputField
                  name="identifierPrefix"
                  label="Identifier Prefix"
                  placeholder="e.g., BIZ"
                  disabled={updateResult.loading}
                />
              </div>
            </motion.div>

            {/* NOTIFICATIONS */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-linear-to-br from-orange-50 to-red-50 p-4 rounded-lg border border-orange-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                  <MdNotifications className="text-lg text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-base-content">
                  Notifications
                </h3>
              </div>
              <CustomRadioButton
                dataAuto="deleteReadNotifications"
                name="deleteReadNotifications"
                label="Delete Read Notifications"
                required
                options={[
                  { title: "After 7 days", value: "7_days" },
                  { title: "After 30 Days", value: "30_days" },
                ]}
                disabled={updateResult.loading}
              />
            </motion.div>

            {/* ACTION BUTTONS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <FormActionButton
                isPending={updateResult.loading}
                cancelHandler={() =>
                  setPopupOption((prev) => ({ ...prev, open: false }))
                }
              />
            </motion.div>
          </CustomForm>
        </motion.div>
      </CustomPopup>
    </motion.div>
  );
}
