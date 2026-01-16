"use client";

import { motion } from "motion/react";
import { useMutation, useQuery } from "@apollo/client/react";
import dayjs from "dayjs";
import {
  // HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar,
} from "react-icons/hi2";
import { MdLocationOn, MdPerson } from "react-icons/md";
import { PiPencilSimple, PiGenderMale, PiGenderFemale } from "react-icons/pi";
import { BsHeart, BsHeartFill } from "react-icons/bs";

import { IUser } from "@/types";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import CustomForm from "@/components/form/CustomForm";
import CustomInputField from "@/components/form/input/CustomInputField";
import FormActionButton from "@/components/form/FormActionButton";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import { GenderRadio, MaritalStatusRadio } from "@/components/input-fields";
import {
  GET_BUSINESS_USER_BY_ID,
  UPDATE_USER_PROFILE,
} from "@/graphql/user.api";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import useAppStore from "@/stores/appStore";
import { userProfileSchema } from "@/schemas/user.schema";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import { HiOutlineMail } from "react-icons/hi";

dayjs.extend(require("dayjs/plugin/advancedFormat"));

// ==================== INTERFACES ====================
interface IBusinessOwnerProfileProps {
  ownerId: number;
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
function OwnerProfileSkeleton() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="max-w-5xl mx-auto"
    >
      <div className="w-full border shadow-md rounded-xl py-6 px-4 md:py-8 md:px-8 bg-primary text-primary-content relative overflow-hidden">
        {/* SHIMMER EFFECT */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative">
          {/* AVATAR SKELETON */}
          <div className="shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 animate-pulse" />
          </div>

          {/* INFO SKELETON */}
          <div className="flex-1 w-full space-y-4">
            {/* NAME SKELETON */}
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="h-8 w-48 bg-white/20 rounded animate-pulse" />
                <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />
            </div>

            {/* EMAIL SKELETON */}
            <div className="h-12 w-full bg-white/10 rounded-lg animate-pulse" />

            {/* DIVIDER */}
            <div className="h-px bg-white/20" />

            {/* INFO GRID SKELETON */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-white/10 rounded-lg animate-pulse"
                />
              ))}
              <div className="h-16 bg-white/10 rounded-lg animate-pulse md:col-span-2" />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ==================== COMPONENT ====================
export default function BusinessOwnerProfile({
  ownerId,
}: IBusinessOwnerProfileProps) {
  // ==================== HOOKS ====================
  const { popupOption, setPopupOption } = usePopupOption();
  const { user } = useAppStore((state) => state);
  const { hasPermission } = usePermissionGuard();

  // ==================== QUERIES ====================
  const { data, loading } = useQuery<{
    userById: {
      data: IUser;
    };
  }>(GET_BUSINESS_USER_BY_ID, {
    variables: { id: ownerId },
    skip: !ownerId,
  });

  // ==================== MUTATIONS ====================
  const [updateUserProfile, updateResult] = useMutation(UPDATE_USER_PROFILE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_BUSINESS_BY_ID, variables: { id: user.businessId } },
    ],
  });

  // ==================== HANDLERS ====================
  const handleSubmit = async (formValues: any) => {
    await updateUserProfile({
      variables: {
        updateProfileInput: {
          id: Number(ownerId),
          ...formValues,
        },
      },
    }).then(() => {
      setPopupOption((prev) => ({ ...prev, open: false }));
    });
  };

  // ==================== COMPUTED VALUES ====================
  const ownerData = data?.userById?.data;

  const initials = ownerData?.profile?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = ownerData?.status === "ACTIVE";

  // ==================== LOADING STATE ====================
  if (loading) {
    return <OwnerProfileSkeleton />;
  }

  // ==================== EMPTY STATE ====================
  if (!ownerData) {
    return (
      <motion.section
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="max-w-5xl mx-auto"
      >
        <div className="w-full border shadow-md rounded-xl py-12 px-4 md:py-16 md:px-8 bg-gray-50 relative overflow-hidden text-center">
          <MdPerson className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content/60 mb-2">
            No Owner Profile Found
          </h3>
          <p className="text-base-content/50">
            Owner profile information is not available.
          </p>
        </div>
      </motion.section>
    );
  }

  // ==================== RENDER ====================
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="max-w-5xl mx-auto"
    >
      {/* OWNER PROFILE CARD */}
      <div className="w-full border shadow-md rounded-xl text-primary-content py-6 px-4 md:py-8 md:px-8 bg-primary relative overflow-hidden">
        {/* SUBTLE PATTERN OVERLAY */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]" />

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative">
          {/* AVATAR WITH GRADIENT */}
          <motion.div
            className="shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-linear-to-br from-white/90 to-white/70 flex items-center justify-center text-3xl md:text-4xl font-bold text-primary shadow-xl border-4 border-white/30">
                {initials}
              </div>
              {/* STATUS INDICATOR */}
              <div
                className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${
                  isActive ? "bg-green-500" : "bg-red-500"
                } shadow-lg`}
                title={ownerData?.status}
              />
            </div>
          </motion.div>

          {/* OWNER INFO */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 w-full space-y-4"
          >
            {/* HEADER: NAME & EDIT BUTTON */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold drop-shadow">
                  {ownerData?.profile?.fullName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`badge badge-sm ${
                      isActive ? "badge-success" : "badge-error"
                    } font-medium`}
                  >
                    {ownerData?.status}
                  </span>
                  <span className="text-xs opacity-80 font-medium">
                    Business Owner
                  </span>
                </div>
              </div>
              {hasPermission(Permissions.UserUpdate) && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
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
                  className="btn btn-circle btn-sm btn-ghost hover:bg-white/10 backdrop-blur-sm"
                  title="Edit Owner Profile"
                >
                  <PiPencilSimple className="text-lg" />
                </motion.button>
              )}
            </div>

            {/* EMAIL */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
            >
              <HiOutlineMail className="text-xl shrink-0" />
              <div className="truncate">
                <div className="text-xs opacity-80 font-medium">Email</div>
                <div className="font-semibold truncate">{ownerData?.email}</div>
              </div>
            </motion.div>

            {/* DIVIDER */}
            <div className="h-px bg-white/20 my-4" />

            {/* CONTACT & PERSONAL INFO GRID */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-medium"
            >
              {/* PHONE */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
              >
                <HiOutlinePhone className="text-lg shrink-0" />
                <div>
                  <div className="text-xs opacity-80">Phone</div>
                  <div className="font-semibold">
                    {ownerData?.profile?.phone || "N/A"}
                  </div>
                </div>
              </motion.div>

              {/* DATE OF BIRTH */}
              {ownerData?.profile?.dateOfBirth && (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
                >
                  <HiOutlineCalendar className="text-lg shrink-0" />
                  <div>
                    <div className="text-xs opacity-80">Date of Birth</div>
                    <div className="font-semibold">
                      {dayjs(ownerData.profile.dateOfBirth).format(
                        "DD MMMM YYYY"
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* GENDER */}
              {ownerData?.profile?.gender && (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
                >
                  {ownerData.profile.gender === "MALE" ? (
                    <PiGenderMale className="text-lg shrink-0" />
                  ) : (
                    <PiGenderFemale className="text-lg shrink-0" />
                  )}
                  <div>
                    <div className="text-xs opacity-80">Gender</div>
                    <div className="font-semibold capitalize">
                      {ownerData.profile.gender.toLowerCase()}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MARITAL STATUS */}
              {ownerData?.profile?.maritalStatus && (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200"
                >
                  {ownerData.profile.maritalStatus === "MARRIED" ? (
                    <BsHeartFill className="text-lg shrink-0" />
                  ) : (
                    <BsHeart className="text-lg shrink-0" />
                  )}
                  <div>
                    <div className="text-xs opacity-80">Marital Status</div>
                    <div className="font-semibold capitalize">
                      {ownerData.profile.maritalStatus.toLowerCase()}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ADDRESS */}
              {ownerData?.profile?.address && (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-start gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200 md:col-span-2"
                >
                  <MdLocationOn className="text-xl shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs opacity-80 font-medium">
                      Address
                    </div>
                    <div className="font-semibold">
                      {ownerData.profile.address}
                      {ownerData.profile.city && `, ${ownerData.profile.city}`}
                      {ownerData.profile.postcode &&
                        ` ${ownerData.profile.postcode}`}
                      {ownerData.profile.country && (
                        <div>{ownerData.profile.country}</div>
                      )}
                    </div>
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
            className="flex flex-col gap-4 p-4"
          >
            {/* PERSONAL INFORMATION SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3 bg-linear-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MdPerson className="text-lg text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-base-content">
                  Personal Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <CustomInputField
                    name="fullName"
                    label="Full Name"
                    required
                    placeholder="Enter full name"
                    disabled={updateResult.loading}
                  />
                </div>
                <CustomInputField
                  name="phone"
                  label="Phone Number"
                  required
                  placeholder="Enter phone number"
                  disabled={updateResult.loading}
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
                    placeholder="Enter address"
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
                  placeholder="Enter postcode"
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
