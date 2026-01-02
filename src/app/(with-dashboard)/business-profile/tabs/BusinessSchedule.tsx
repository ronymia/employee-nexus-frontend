"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { motion } from "motion/react";
import * as z from "zod";
import CustomPopup from "@/components/modal/CustomPopup";
import CustomForm from "@/components/form/CustomForm";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import CustomTimeInput from "@/components/form/input/CustomTimeInput";
import FormActionButton from "@/components/form/FormActionButton";
import {
  UPDATE_BUSINESS_SCHEDULE,
  GET_BUSINESS_BY_ID,
} from "@/graphql/business.api";
import { IBusinessSchedule } from "@/types";
import {
  convertTo12HourFormat,
  generateWeekDays,
} from "@/utils/date-time.utils";
import usePopupOption from "@/hooks/usePopupOption";
import useAppStore from "@/stores/appStore";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import BulkScheduleUpdateForm from "./BulkScheduleUpdateForm";
import {
  MdAccessTime,
  MdCalendarToday,
  MdClose,
  MdCheckCircle,
} from "react-icons/md";

// ==================== INTERFACES ====================
interface IBusinessScheduleProps {
  businessSchedules: IBusinessSchedule[];
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

// ==================== BUSINESS SCHEDULE COMPONENT ====================
export default function BusinessSchedule({
  businessSchedules,
}: IBusinessScheduleProps) {
  // ==================== HOOKS ====================
  const { popupOption, setPopupOption } = usePopupOption();
  const { user } = useAppStore((state) => state);
  const { hasPermission } = usePermissionGuard();
  const [selectedSchedule, setSelectedSchedule] =
    useState<IBusinessSchedule | null>(null);

  // UPDATE SCHEDULE MUTATION
  const [updateBusinessSchedule, updateResult] = useMutation(
    UPDATE_BUSINESS_SCHEDULE,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        { query: GET_BUSINESS_BY_ID, variables: { id: user.businessId } },
      ],
    }
  );

  const now = new Date();

  // GENERATE DEFAULT SCHEDULE (Monday to Sunday, 9 AM to 5 PM, Sunday closed)
  const defaultSchedules: IBusinessSchedule[] = Array.from(
    { length: 7 },
    (_, index) => ({
      id: index,
      businessId: user.businessId,
      day: index.toString(),
      startTime: "09:00",
      endTime: "17:00",
      isWeekend: index === 0, // Sunday is weekend
    })
  );

  // USE PROVIDED SCHEDULES OR DEFAULT
  const displaySchedules =
    businessSchedules && businessSchedules.length > 0
      ? businessSchedules
      : defaultSchedules;

  // ==================== HANDLERS ====================
  const handleEditClick = (schedule: IBusinessSchedule) => {
    setSelectedSchedule(schedule);
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "",
      data: schedule,
      title: `Edit ${
        generateWeekDays({ startOfWeekDay: 0 })[Number(schedule.day)]?.name
      } Schedule`,
    });
  };

  const handleSubmit = async (formValues: any) => {
    if (!selectedSchedule) return;

    await updateBusinessSchedule({
      variables: {
        updateBusinessScheduleInput: {
          id: selectedSchedule.id,
          day: Number(selectedSchedule.day),
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

  // ==================== RENDER ====================
  return (
    <div className={`max-w-4xl mx-auto md:p-4 space-y-4`}>
      {/* WEEKLY SCHEDULE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg border border-indigo-100`}
      >
        {/* HEADER */}
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6`}
        >
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
          {hasPermission(Permissions.WorkScheduleUpdate) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setPopupOption({
                  open: true,
                  closeOnDocumentClick: true,
                  actionType: "update",
                  form: "bulk_schedule",
                  data: displaySchedules,
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
          {displaySchedules.map((schedule: IBusinessSchedule) => {
            const dayName = generateWeekDays({ startOfWeekDay: 0 })[
              Number(schedule.day)
            ];
            const isToday = Number(schedule.day) === now.getDay();
            const isClosed = schedule.isWeekend;
            const isDefaultSchedule = businessSchedules.length === 0;
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
                <div className="flex items-center gap-2">
                  {isDefaultSchedule && (
                    <span className="badge badge-outline badge-warning badge-sm">
                      Default
                    </span>
                  )}
                  {hasPermission(Permissions.WorkScheduleUpdate) && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditClick(schedule)}
                      className="btn btn-ghost btn-xs text-primary hover:bg-primary/10"
                    >
                      Edit
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* EDIT MODAL */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        {popupOption.form === "bulk_schedule" ? (
          <BulkScheduleUpdateForm
            schedules={displaySchedules}
            handleClosePopup={() => {
              setPopupOption((prev) => ({ ...prev, open: false }));
            }}
          />
        ) : (
          selectedSchedule && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <CustomForm
                submitHandler={handleSubmit}
                resolver={scheduleSchema}
                defaultValues={{
                  startTime: selectedSchedule.startTime || "",
                  endTime: selectedSchedule.endTime || "",
                  isWeekend: selectedSchedule.isWeekend || false,
                }}
                className={`flex flex-col gap-4 p-4`}
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
                      disabled={updateResult.loading}
                    />
                    <CustomTimeInput
                      name="endTime"
                      label="End Time (HH:MM)"
                      placeholder="17:00"
                      required
                      disabled={updateResult.loading}
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
                    disabled={updateResult.loading}
                  />
                </motion.div>

                {/* ACTION BUTTONS */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <FormActionButton
                    isPending={updateResult.loading}
                    cancelHandler={() => {
                      setPopupOption((prev) => ({ ...prev, open: false }));
                      setSelectedSchedule(null);
                    }}
                  />
                </motion.div>
              </CustomForm>
            </motion.div>
          )
        )}
      </CustomPopup>
    </div>
  );
}
