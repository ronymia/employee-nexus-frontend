"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { motion } from "motion/react";
import * as z from "zod";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomTimeInput from "@/components/form/input/CustomTimeInput";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import {
  UPDATE_BUSINESS_SCHEDULE,
  GET_BUSINESS_BY_ID,
} from "@/graphql/business.api";
import { IBusinessSchedule } from "@/types";
import { generateWeekDays } from "@/utils/date-time.utils";
import useAppStore from "@/stores/appStore";
import { MdCalendarToday, MdAccessTime, MdInfo } from "react-icons/md";

// ==================== INTERFACES ====================
interface IBulkScheduleUpdateFormProps {
  schedules: IBusinessSchedule[];
  handleClosePopup: () => void;
}

// ==================== VALIDATION SCHEMA ====================
const bulkScheduleSchema = z.object({
  schedules: z.array(
    z.object({
      id: z.number(),
      day: z.string(),
      startTime: z.string().nonempty("Start time is required"),
      endTime: z.string().nonempty("End time is required"),
      isWeekend: z.boolean(),
    })
  ),
});

type IBulkScheduleFormData = z.infer<typeof bulkScheduleSchema>;

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
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// ==================== BULK SCHEDULE UPDATE FORM ====================
export default function BulkScheduleUpdateForm({
  schedules,
  handleClosePopup,
}: IBulkScheduleUpdateFormProps) {
  // ==================== HOOKS ====================
  const { user } = useAppStore((state) => state);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UPDATE SCHEDULE MUTATION
  const [updateBusinessSchedule] = useMutation(UPDATE_BUSINESS_SCHEDULE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_BUSINESS_BY_ID, variables: { id: user.businessId } },
    ],
  });

  // ==================== HANDLERS ====================
  const handleSubmit = async (formValues: IBulkScheduleFormData) => {
    setIsSubmitting(true);
    try {
      // UPDATE ALL SCHEDULES IN PARALLEL
      const promises = formValues.schedules.map((schedule) =>
        updateBusinessSchedule({
          variables: {
            updateBusinessScheduleInput: {
              id: schedule.id,
              day: Number(schedule.day),
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              isWeekend: schedule.isWeekend,
            },
          },
        })
      );

      await Promise.all(promises);
      handleClosePopup();
    } catch (error) {
      console.error("Error updating schedules:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const weekDays = generateWeekDays({ startOfWeekDay: 0 });
  const now = new Date();
  const currentDay = now.getDay();

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
            day: s.day,
            startTime: s.startTime || "09:00",
            endTime: s.endTime || "17:00",
            isWeekend: s.isWeekend || false,
          })),
        }}
        className="flex flex-col gap-4 overflow-y-auto scrollbar-hide"
      >
        {/* INFO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2"
        >
          <MdInfo className="text-xl text-primary shrink-0 mt-0.5" />
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
            const dayName = weekDays[Number(schedule.day)]?.name;
            const isToday = Number(schedule.day) === currentDay;
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
                    disabled={isSubmitting}
                  />
                  <CustomTimeInput
                    name={`schedules.${index}.endTime`}
                    label="End Time"
                    placeholder="17:00"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* WEEKEND TOGGLE */}
                <div className="pt-2">
                  <ToggleSwitch
                    name={`schedules.${index}.isWeekend`}
                    label="Mark as Closed/Weekend"
                    disabled={isSubmitting}
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
          className="bg-white pt-4 border-t mt-2"
        >
          <div className="flex items-center gap-2 mb-3 text-xs text-base-content/60">
            <MdAccessTime className="text-sm" />
            <p>Changes will be applied to all selected days</p>
          </div>
          <FormActionButton
            isPending={isSubmitting}
            cancelHandler={handleClosePopup}
          />
        </motion.div>
      </CustomForm>
    </motion.div>
  );
}
