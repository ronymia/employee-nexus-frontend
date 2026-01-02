"use client";

import { useMutation } from "@apollo/client/react";
import { motion } from "motion/react";
import dayjs from "dayjs";
import ImageUploader from "@/components/ui/uploader/ImageUploader";
import CustomPopup from "@/components/modal/CustomPopup";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import FormActionButton from "@/components/form/FormActionButton";
import { UPDATE_BUSINESS, GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import { IBusiness } from "@/types";
import {
  businessProfileSchema,
  IBusinessProfileFormData,
} from "@/schemas/business.schema";
import usePopupOption from "@/hooks/usePopupOption";
import useAppStore from "@/stores/appStore";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import { HiOutlineCalendar, HiOutlinePhone } from "react-icons/hi2";
import { MdLocationOn } from "react-icons/md";
import { PiPencilSimple } from "react-icons/pi";
import { HiOutlineMail } from "react-icons/hi";

dayjs.extend(require("dayjs/plugin/advancedFormat"));

// ==================== INTERFACES ====================
interface IBusinessProfileCardProps {
  businessData: IBusiness;
  isLoading: boolean;
}

// ==================== ANIMATION VARIANTS ====================
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

// ==================== LOADING SKELETON SUB-COMPONENT ====================
function BusinessProfileCardSkeleton() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="max-w-5xl flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="w-full border border-primary shadow-md rounded-xl py-6 px-4 md:py-8 md:px-8 bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
        {/* SHIMMER EFFECT */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative">
          {/* LOGO SKELETON */}
          <div className="shrink-0">
            <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>
          </div>

          {/* INFO SKELETON */}
          <div className="flex-1 w-full space-y-4">
            {/* NAME SKELETON */}
            <div className="flex items-center justify-between gap-3">
              <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
            </div>

            {/* ADDRESS SKELETON */}
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-300 animate-pulse"></div>

            {/* CONTACT INFO GRID SKELETON */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ==================== BUSINESS PROFILE CARD COMPONENT ====================
export default function BusinessProfileCard({
  businessData,
  isLoading = false,
}: IBusinessProfileCardProps) {
  // ==================== HOOKS ====================
  const { popupOption, setPopupOption } = usePopupOption();
  const { user } = useAppStore((state) => state);
  const { hasPermission } = usePermissionGuard();

  // UPDATE BUSINESS MUTATION
  const [updateBusiness, updateResult] = useMutation(UPDATE_BUSINESS, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_BUSINESS_BY_ID, variables: { id: user.businessId } },
    ],
  });

  // ==================== HANDLERS ====================
  const handleLogoUpload = async (file: File) => {
    if (!file) return;

    // TODO: Upload file to storage and get URL
    // For now, you need to implement file upload to your backend or storage service
    // const imageUrl = await uploadFileToStorage(file);

    // Temporary: Create object URL for preview (this won't persist)
    const imageUrl = URL.createObjectURL(file);

    await updateBusiness({
      variables: {
        updateBusinessInput: {
          id: Number(businessData?.id),
          logo: imageUrl,
        },
      },
    });
  };

  const handleSubmit = async (formValues: IBusinessProfileFormData) => {
    await updateBusiness({
      variables: {
        updateBusinessInput: {
          id: Number(businessData?.id),
          ...formValues,
        },
      },
    }).then(() => {
      setPopupOption((prev) => ({ ...prev, open: false }));
    });
  };

  // SHOW SKELETON WHILE LOADING
  if (isLoading || !businessData) {
    return <BusinessProfileCardSkeleton />;
  }

  const isActive = businessData?.status === "ACTIVE";

  // ==================== RENDER ====================
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className={`max-w-5xl flex flex-col items-center justify-center overflow-hidden`}
    >
      {/* BUSINESS CARD */}
      <div className="w-full border shadow-md rounded-xl text-base-300 py-6 px-4 md:py-8 md:px-8 bg-linear-to-tr from-primary to-primary/50 relative overflow-hidden">
        {/* SUBTLE PATTERN OVERLAY */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]" />

        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative">
          {/* LOGO WITH HOVER EFFECT */}
          <motion.div
            className="shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <ImageUploader
                name="Logo"
                type="circular"
                defaultImage={businessData?.logo}
                handleGetImage={handleLogoUpload}
                isLoading={updateResult.loading}
              />
            </div>
          </motion.div>

          {/* BUSINESS INFO */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 w-full space-y-4"
          >
            {/* HEADER: NAME & EDIT BUTTON */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold drop-shadow text-green-950">
                  {businessData?.name}
                </h2>
                {/* STATUS BADGE */}
                <span
                  className={`badge badge-sm ${
                    isActive ? "badge-success" : "badge-error"
                  } font-medium`}
                >
                  {businessData?.status}
                </span>
              </div>
              {hasPermission(Permissions.BusinessUpdate) && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setPopupOption({
                      open: true,
                      closeOnDocumentClick: true,
                      actionType: "update",
                      form: "",
                      data: businessData,
                      title: "Edit Business Information",
                    })
                  }
                  className="btn btn-circle btn-sm btn-ghost text-green-950 hover:bg-green-950/10 backdrop-blur-sm"
                  title="Edit Business"
                >
                  <PiPencilSimple className="text-lg" />
                </motion.button>
              )}
            </div>

            {/* BUSINESS ADDRESS */}
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-2 text-white bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
            >
              <MdLocationOn className="text-xl shrink-0 mt-0.5" />
              <div>
                <div className="text-xs opacity-80 font-medium">Address</div>
                <div className="font-semibold">
                  {businessData?.address}
                  {businessData?.city && `, ${businessData.city}`}
                  {businessData?.postcode && ` ${businessData.postcode}`}
                  {businessData?.country && <div>{businessData.country}</div>}
                </div>
              </div>
            </motion.div>

            {/* DIVIDER */}
            <div className="h-px bg-white/20 my-4" />

            {/* CONTACT INFORMATION GRID */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-white font-medium"
            >
              {/* REGISTRATION DATE */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
              >
                <HiOutlineCalendar className="text-lg shrink-0" />
                <div>
                  <div className="text-xs text-white opacity-80">
                    Registered
                  </div>
                  <div className="font-semibold">
                    {dayjs(businessData?.registrationDate, "DD-MM-YYYY").format(
                      "DD MMMM YYYY"
                    )}
                  </div>
                </div>
              </motion.div>

              {/* EMAIL */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
              >
                <HiOutlineMail className="text-lg shrink-0" />
                <div className="truncate">
                  <div className="text-xs opacity-80">Email</div>
                  <div className="font-semibold truncate">
                    {businessData?.email}
                  </div>
                </div>
              </motion.div>

              {/* PHONE */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
              >
                <HiOutlinePhone className="text-lg shrink-0" />
                <div>
                  <div className="text-xs text-white opacity-80">Phone</div>
                  <div className="font-semibold">{businessData?.phone}</div>
                </div>
              </motion.div>

              {/* WEBSITE */}
              {businessData?.website && (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
                >
                  <span className="text-lg shrink-0">🌐</span>
                  <div className="truncate">
                    <div className="text-xs text-green-800 opacity-80">
                      Website
                    </div>
                    <a
                      href={businessData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline truncate block"
                    >
                      {businessData.website}
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <CustomForm
            submitHandler={handleSubmit}
            resolver={businessProfileSchema}
            defaultValues={{
              name: businessData?.name || "",
              email: businessData?.email || "",
              phone: businessData?.phone || "",
              website: businessData?.website || "",
              address: businessData?.address || "",
              city: businessData?.city || "",
              country: businessData?.country || "",
              postcode: businessData?.postcode || "",
            }}
            className={`flex flex-col gap-4 p-4`}
          >
            {/* BASIC INFORMATION SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3 bg-linear-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MdLocationOn className="text-lg text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-base-content">
                  Basic Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <CustomInputField
                    name="name"
                    label="Business Name"
                    required
                    placeholder="Enter business name"
                    disabled={updateResult.loading}
                  />
                </div>
                <CustomInputField
                  name="email"
                  label="Email Address"
                  type="email"
                  required
                  placeholder="business@example.com"
                  disabled={updateResult.loading}
                />
                <CustomInputField
                  name="phone"
                  label="Phone Number"
                  required
                  placeholder="+1 (555) 000-0000"
                  disabled={updateResult.loading}
                />
                <div className="md:col-span-2">
                  <CustomInputField
                    name="website"
                    label="Website URL"
                    placeholder="https://www.example.com"
                    disabled={updateResult.loading}
                  />
                </div>
              </div>
            </motion.div>

            {/* ADDRESS INFORMATION SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3 bg-linear-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <MdLocationOn className="text-lg text-success" />
                </div>
                <h3 className="text-lg font-semibold text-base-content">
                  Address Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <CustomInputField
                    name="address"
                    label="Street Address"
                    required
                    placeholder="123 Business Street"
                    disabled={updateResult.loading}
                  />
                </div>
                <CustomInputField
                  name="city"
                  label="City"
                  required
                  placeholder="Enter city"
                  disabled={updateResult.loading}
                />
                <CustomInputField
                  name="postcode"
                  label="Postal Code"
                  required
                  placeholder="12345"
                  disabled={updateResult.loading}
                />
                <div className="md:col-span-2">
                  <CustomInputField
                    name="country"
                    label="Country"
                    required
                    placeholder="Enter country"
                    disabled={updateResult.loading}
                  />
                </div>
              </div>
            </motion.div>

            {/* ACTION BUTTONS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
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
    </motion.section>
  );
}
