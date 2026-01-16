"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { motion } from "motion/react";
import * as z from "zod";
import CustomPopup from "@/components/modal/CustomPopup";
import CustomForm from "@/components/form/CustomForm";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import CustomTimeInput from "@/components/form/input/CustomTimeInput";
import FormActionButton from "@/components/form/FormActionButton";
import { IBusinessSchedule } from "@/types";
import {
  convertTo12HourFormat,
  generateWeekDays,
} from "@/utils/date-time.utils";
import usePopupOption from "@/hooks/usePopupOption";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import {
  MdAccessTime,
  MdCalendarToday,
  MdClose,
  MdCheckCircle,
} from "react-icons/md";
import {
  GET_BUSINESS_SCHEDULE_BY_BUSINESS_ID,
  UPDATE_BUSINESS_SCHEDULE,
} from "@/graphql/business-schedule.api";

// ==================== INTERFACES ====================
interface IBusinessScheduleProps {
  businessId: number;
}

interface ISingleScheduleFormProps {
  schedule: IBusinessSchedule;
  onClose: () => void;
  onSubmit: (formValues: any) => Promise<void>;
  isLoading: boolean;
}

interface IBulkScheduleFormProps {
  schedules: IBusinessSchedule[];
  onClose: () => void;
  businessId: number;
}

// ==================== VALIDATION SCHEMA ====================
const scheduleSchema = z.object({
  startTime: z.string().nonempty("Start time is required"),
  endTime: z.string().nonempty("End time is required"),
  isWeekend: z.boolean(),
});

// ==================== ANIMATION VARIANTS ====================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
  },
};

// ==================== LOADING SKELETON SUB-COMPONENT ====================
function ScheduleSkeleton() {
  return (
    <div className="max-w-4xl mx-auto md:p-4 space-y-4">
      <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg border border-indigo-100">
        {/* HEADER SKELETON */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-300 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-24 bg-gray-300 rounded animate-pulse" />
        </div>

        {/* SCHEDULE LIST SKELETON */}
        <div className="space-y-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-white/60 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== SINGLE SCHEDULE UPDATE FORM SUB-COMPONENT ====================
function SingleScheduleForm({
  schedule,
  onClose,
  onSubmit,
  isLoading,
}: ISingleScheduleFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <CustomForm
        submitHandler={onSubmit}
        resolver={scheduleSchema}
        defaultValues={{
          startTime: schedule.startTime || "",
          endTime: schedule.endTime || "",
          isWeekend: schedule.isWeekend || false,
        }}
        className="flex flex-col gap-4 p-4"
      >
        {/* TIME INPUTS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 bg-linear-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MdAccessTime className="text-lg text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-base-content">
              Operating Hours
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CustomTimeInput
              name="startTime"
              label="Start Time (HH:MM)"
              placeholder="09:00"
              required
              disabled={isLoading}
            />
            <CustomTimeInput
              name="endTime"
              label="End Time (HH:MM)"
              placeholder="17:00"
              required
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-base-content/60 flex items-center gap-1">
            <MdAccessTime className="text-sm" />
            Use 24-hour format (e.g., 09:00 for 9 AM, 17:00 for 5 PM)
          </p>
        </motion.div>

        {/* WEEKEND TOGGLE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-linear-to-br from-red-50 to-orange-50 p-4 rounded-lg border border-red-100"
        >
          <ToggleSwitch
            name="isWeekend"
            label="Mark as Weekend/Closed"
            disabled={isLoading}
          />
        </motion.div>

        {/* ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FormActionButton isPending={isLoading} cancelHandler={onClose} />
        </motion.div>
      </CustomForm>
    </motion.div>
  );
}

// ==================== BULK SCHEDULE UPDATE FORM SUB-COMPONENT ====================
function BulkScheduleForm({
  schedules,
  onClose,
  businessId,
}: IBulkScheduleFormProps) {
  // ==================== HOOKS ====================

  // ==================== MUTATIONS ====================
  const [updateBusinessSchedule, updateBusinessScheduleResult] = useMutation(
    UPDATE_BUSINESS_SCHEDULE,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: GET_BUSINESS_SCHEDULE_BY_BUSINESS_ID,
          variables: { businessId },
        },
      ],
    }
  );

  // ==================== HANDLERS ====================
  const handleSubmit = async (formValues: any) => {
    try {
      // UPDATE ALL SCHEDULES IN PARALLEL
      const promises = formValues.schedules.map((schedule: any) =>
        updateBusinessSchedule({
          variables: {
            businessId,
            updateBusinessScheduleInput: {
              id: schedule.id,
              dayOfWeek: Number(schedule.dayOfWeek),
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              isWeekend: schedule.isWeekend,
            },
          },
        })
      );

      await Promise.all(promises);
      onClose();
    } catch (error) {
      console.error("Error updating schedules:", error);
    }
  };

  // ==================== COMPUTED VALUES ====================
  const weekDays = generateWeekDays({ startOfWeekDay: 0 });
  const now = new Date();
  const currentDay = now.getDay();

  // VALIDATION SCHEMA
  const bulkScheduleSchema = z.object({
    schedules: z.array(
      z.object({
        id: z.number(),
        dayOfWeek: z.number(),
        startTime: z.string().nonempty("Start time is required"),
        endTime: z.string().nonempty("End time is required"),
        isWeekend: z.boolean(),
      })
    ),
  });

  // ==================== RENDER ====================
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <CustomForm
        submitHandler={handleSubmit}
        resolver={bulkScheduleSchema}
        defaultValues={{
          schedules: schedules.map((s) => ({
            id: s.id,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime || "09:00",
            endTime: s.endTime || "17:00",
            isWeekend: s.isWeekend || false,
          })),
        }}
        className="flex flex-col gap-4 overflow-y-auto scrollbar-hide h-full"
      >
        {/* INFO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2"
        >
          <MdCalendarToday className="text-xl text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-base-content">
              Update All Schedules
            </p>
            <p className="text-xs text-base-content/60">
              Set operating hours for all days at once. Use 24-hour format
              (e.g., 09:00 for 9 AM, 17:00 for 5 PM)
            </p>
          </div>
        </motion.div>

        {/* SCHEDULE CARDS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {schedules.map((schedule, index) => {
            const dayName = weekDays[Number(schedule.dayOfWeek)]?.name;
            const isToday = Number(schedule.dayOfWeek) === currentDay;
            const isWeekend = schedule.isWeekend;

            return (
              <motion.div
                key={schedule.id}
                variants={itemVariants}
                className={`border rounded-lg p-4 space-y-3 transition-all ${
                  isWeekend
                    ? "border-red-200 bg-linear-to-br from-red-50 to-orange-50 opacity-75"
                    : isToday
                    ? "border-primary bg-linear-to-br from-primary/5 to-primary/10 shadow-md"
                    : "border-gray-200 bg-linear-to-br from-gray-50 to-white"
                }`}
              >
                {/* DAY HEADER */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isWeekend
                        ? "bg-error/20"
                        : isToday
                        ? "bg-primary/20"
                        : "bg-gray-200"
                    }`}
                  >
                    <MdCalendarToday
                      className={`text-base ${
                        isWeekend
                          ? "text-error"
                          : isToday
                          ? "text-primary"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <h4
                    className={`font-semibold text-base ${
                      isWeekend
                        ? "text-error"
                        : isToday
                        ? "text-primary"
                        : "text-gray-700"
                    }`}
                  >
                    {dayName}
                    {isToday && (
                      <span className="ml-2 badge badge-primary badge-xs">
                        Today
                      </span>
                    )}
                    {isWeekend && (
                      <span className="ml-2 badge badge-error badge-xs">
                        Closed
                      </span>
                    )}
                  </h4>
                </div>

                {/* TIME INPUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <CustomTimeInput
                    name={`schedules.${index}.startTime`}
                    label="Start Time"
                    placeholder="09:00"
                    required
                    disabled={updateBusinessScheduleResult.loading}
                  />
                  <CustomTimeInput
                    name={`schedules.${index}.endTime`}
                    label="End Time"
                    placeholder="17:00"
                    required
                    disabled={updateBusinessScheduleResult.loading}
                  />
                </div>

                {/* WEEKEND TOGGLE */}
                <div className="pt-2">
                  <ToggleSwitch
                    name={`schedules.${index}.isWeekend`}
                    label="Mark as Closed/Weekend"
                    disabled={updateBusinessScheduleResult.loading}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white pt-4 border-t mt-2 sticky bottom-0"
        >
          <div className="flex items-center gap-2 mb-3 text-xs text-base-content/60">
            <MdAccessTime className="text-sm" />
            <p>Changes will be applied to all selected days</p>
          </div>
          <FormActionButton
            isPending={updateBusinessScheduleResult.loading}
            cancelHandler={onClose}
          />
        </motion.div>
      </CustomForm>
    </motion.div>
  );
}

// ==================== BUSINESS SCHEDULE COMPONENT ====================
export default function BusinessSchedule({
  businessId,
}: IBusinessScheduleProps) {
  // ==================== HOOKS ====================
  const { popupOption, setPopupOption } = usePopupOption();
  const { hasPermission } = usePermissionGuard();
  const [selectedSchedule, setSelectedSchedule] =
    useState<IBusinessSchedule | null>(null);

  // ==================== QUERIES ====================
  const { data, loading } = useQuery<{
    businessSchedulesByBusinessId: {
      data: IBusinessSchedule[];
    };
  }>(GET_BUSINESS_SCHEDULE_BY_BUSINESS_ID, {
    variables: { businessId },
    skip: !businessId,
  });

  // ==================== MUTATIONS ====================
  const [updateBusinessSchedule, updateResult] = useMutation(
    UPDATE_BUSINESS_SCHEDULE,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: GET_BUSINESS_SCHEDULE_BY_BUSINESS_ID,
          variables: { businessId },
        },
      ],
    }
  );

  // ==================== COMPUTED VALUES ====================
  const businessSchedules = data?.businessSchedulesByBusinessId?.data || [];
  console.log({ data, businessId });

  const now = new Date();

  // ==================== HANDLERS ====================
  const handleEditClick = (schedule: IBusinessSchedule) => {
    setSelectedSchedule(schedule);
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "single_business_schedule",
      data: schedule,
      title: `Edit ${
        generateWeekDays({ startOfWeekDay: 0 })[Number(schedule.dayOfWeek)]
          ?.name
      } Schedule`,
    });
  };

  const handleSubmit = async (formValues: any) => {
    if (!selectedSchedule) return;

    await updateBusinessSchedule({
      variables: {
        businessId,
        updateBusinessScheduleInput: {
          id: selectedSchedule.id,
          dayOfWeek: Number(selectedSchedule.dayOfWeek),
          startTime: formValues.startTime,
          endTime: formValues.endTime,
          isWeekend: formValues.isWeekend,
        },
      },
    }).then(() => {
      setPopupOption((prev) => ({ ...prev, open: false }));
      setSelectedSchedule(null);
    });
  };

  const handleCloseModal = () => {
    setPopupOption((prev) => ({ ...prev, open: false }));
    setSelectedSchedule(null);
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return <ScheduleSkeleton />;
  }

  // ==================== RENDER ====================
  return (
    <div className="max-w-4xl mx-auto md:p-4 space-y-4">
      {/* WEEKLY SCHEDULE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg border border-indigo-100"
      >
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MdCalendarToday className="text-xl text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-base-content">
                Weekly Schedule
              </h3>
              <p className="text-sm text-base-content/60">
                Manage your business operating hours
              </p>
            </div>
          </div>
          {hasPermission(Permissions.BusinessUpdate) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setPopupOption({
                  open: true,
                  closeOnDocumentClick: true,
                  actionType: "update",
                  form: "bulk_business_schedule",
                  data: businessSchedules,
                  title: "Update All Schedules",
                });
              }}
              className="btn btn-primary btn-sm bg-linear-to-tl to-primary shadow-md from-primary"
            >
              <MdAccessTime className="text-lg" />
              Update All
            </motion.button>
          )}
        </div>

        {/* SCHEDULE LIST */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {businessSchedules.length > 0 ? (
            businessSchedules.map((schedule: IBusinessSchedule) => {
              const dayName = generateWeekDays({ startOfWeekDay: 0 })[
                Number(schedule.dayOfWeek)
              ];
              const isToday = Number(schedule.dayOfWeek) === now.getDay();
              const isClosed = schedule.isWeekend;
              const timeRange = isClosed
                ? "Closed"
                : `${convertTo12HourFormat(
                    schedule.startTime
                  )} - ${convertTo12HourFormat(schedule.endTime)}`;

              return (
                <motion.div
                  key={schedule.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className={`flex justify-between items-center p-4 rounded-lg backdrop-blur-sm transition-all ${
                    isToday
                      ? "bg-primary/20 border-2 border-primary shadow-md"
                      : "bg-white/60 border border-white/40"
                  } ${isClosed ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    {isClosed ? (
                      <MdClose className="text-xl text-error shrink-0" />
                    ) : (
                      <MdCheckCircle className="text-xl text-success shrink-0" />
                    )}
                    <div>
                      <div
                        className={`font-semibold ${
                          isToday ? "text-primary" : "text-base-content"
                        }`}
                      >
                        {dayName?.name}
                        {isToday && (
                          <span className="ml-2 badge badge-primary badge-xs">
                            Today
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-sm ${
                          isClosed
                            ? "italic text-gray-500"
                            : "text-base-content/70"
                        }`}
                      >
                        {timeRange}
                      </div>
                    </div>
                  </div>
                  {hasPermission(Permissions.BusinessUpdate) && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditClick(schedule)}
                      className="btn btn-ghost btn-xs text-primary hover:bg-primary/10"
                    >
                      Edit
                    </motion.button>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8 text-base-content/60">
              <MdCalendarToday className="text-4xl mx-auto mb-2 opacity-30" />
              <p>No schedules found. Please add your business hours.</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* MODALS */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        {popupOption.form === "bulk_business_schedule" ? (
          <BulkScheduleForm
            schedules={businessSchedules}
            onClose={handleCloseModal}
            businessId={businessId}
          />
        ) : popupOption.form === "single_business_schedule" &&
          selectedSchedule ? (
          <SingleScheduleForm
            schedule={selectedSchedule}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            isLoading={updateResult.loading}
          />
        ) : null}
      </CustomPopup>
    </div>
  );
}
