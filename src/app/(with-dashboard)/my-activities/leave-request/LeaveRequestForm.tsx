"use client";

// ==================== EXTERNAL IMPORTS ====================
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomFileUploader from "@/components/form/input/CustomFileUploader";
import { useFormContext, useWatch } from "react-hook-form";
import {
  ILeave,
  ILeaveBalanceData,
  ILeaveBalanceResponse,
  IWorkSchedule,
  LeaveDuration,
} from "@/types";
import { minutesToHoursAndMinutes } from "@/utils/time.utils";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_LEAVE_TYPES } from "@/graphql/leave-types.api";
import {
  LEAVE_REQUEST,
  UPDATE_LEAVE,
  LEAVE_BALANCE,
} from "@/graphql/leave.api";
import { GET_EMPLOYEE_CALENDAR } from "@/graphql/employee-calendar.api";
import { GET_ACTIVE_EMPLOYEE_WORK_SCHEDULE } from "@/graphql/employee-work-schedule.api";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import useAppStore from "@/hooks/useAppStore";
import { motion, AnimatePresence } from "motion/react";
import { PiClock, PiHandPalmBold } from "react-icons/pi";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

// ==================== TYPESCRIPT INTERFACES ====================
interface ILeaveFormProps {
  leave?: ILeave;
  actionType: "create" | "update";
  onClose: () => void;
  refetch?: () => void;
}

// ==================== CALENDAR DATA INTERFACE ====================
// ==================== GRAPHQL QUERIES ====================
import { IEmployeeCalendarDataResponse } from "@/types/employee.type"; // Assuming type location or standard import

// ==================== SUB-COMPONENTS ====================

// RADIAL PROGRESS COMPONENT
function RadialProgress({
  percentage,
  size = 140,
  strokeWidth = 12,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClass =
    percentage > 80
      ? "text-error"
      : percentage > 50
        ? "text-warning"
        : "text-success";

  return (
    <div className="relative flex items-center justify-center p-2">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 relative z-10"
      >
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              className="stop-color-current"
              style={{ stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              className="stop-color-current"
              style={{ stopOpacity: 0.8 }}
            />
          </linearGradient>
        </defs>

        {/* Main Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-base-content/5"
        />

        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: [0.34, 1.56, 0.64, 1] }}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center z-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center"
        >
          <span className="text-3xl font-black tracking-tighter tabular-nums leading-none">
            {percentage}%
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 font-black mt-1">
            Utilization
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// LEAVE BALANCE DISPLAY
interface ILeaveBalanceDisplayProps {
  shouldFetchBalance: boolean;
  balanceLoading: boolean;
  leaveBalance?: ILeaveBalanceData;
}

function LeaveBalanceDisplay({
  shouldFetchBalance,
  balanceLoading,
  leaveBalance,
}: ILeaveBalanceDisplayProps) {
  if (!shouldFetchBalance) return null;

  // CALCULATE USAGE PERCENTAGE
  const usagePercentage = leaveBalance
    ? Math.round(
        (leaveBalance.usedMinutes / leaveBalance.allocatedMinutes) * 100,
      )
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {balanceLoading ? (
          <div className="relative overflow-hidden border border-base-content/5 rounded-3xl p-6 bg-base-100 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full border-4 border-base-content/5 border-t-primary animate-spin" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-48 bg-base-content/5 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-base-content/5 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        ) : leaveBalance ? (
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="group relative overflow-hidden border border-base-content/5 rounded-3xl p-6 md:p-8 bg-base-100 shadow-xl"
          >
            <div className="relative flex flex-col md:flex-row items-center gap-8 lg:gap-12">
              {/* LEFT COLUMN: VISUAL INDICATOR */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="relative p-1.5 rounded-3xl bg-base-200 border border-base-content/5 shadow-inner transition-transform duration-500">
                  <RadialProgress
                    percentage={isNaN(usagePercentage) ? 0 : usagePercentage}
                    size={120}
                    strokeWidth={10}
                  />
                </div>

                {/* DYNAMIC STATUS BADGE */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                    usagePercentage > 80
                      ? "bg-error/10 text-error border-error/20"
                      : usagePercentage > 50
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-success/10 text-success border-success/20"
                  }`}
                >
                  {usagePercentage > 80
                    ? "Full"
                    : usagePercentage > 50
                      ? "Low"
                      : "Optimal"}
                </motion.div>
              </div>

              {/* RIGHT COLUMN: DATA BENTO BOX */}
              <div className="flex-1 flex flex-col justify-center gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-base-200 border border-base-content/5 mb-2 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                      <span className="text-[9px] font-bold text-base-content/40 uppercase tracking-[0.15em]">
                        {leaveBalance.year} QUOTA
                      </span>
                    </div>
                    <h4 className="text-2xl font-black tracking-tighter text-base-content leading-none">
                      {leaveBalance.leaveTypeName}
                    </h4>
                  </div>
                </div>

                {/* BENTO STAT TILES */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {/* ALLOCATED */}
                  <div className="sm:col-span-1 group/tile relative p-4 rounded-2xl bg-base-200/50 border border-base-content/5 hover:bg-base-200 transition-all duration-300 shadow-sm text-base-content">
                    <span className="text-[9px] font-black text-base-content/20 uppercase tracking-widest block mb-1">
                      Total
                    </span>
                    <p className="text-lg font-black tracking-tight tabular-nums">
                      {minutesToHoursAndMinutes(leaveBalance.allocatedMinutes)}
                    </p>
                  </div>

                  {/* USED */}
                  <div className="sm:col-span-1 group/tile p-4 rounded-2xl bg-base-200/50 border border-base-content/5 hover:bg-base-200 transition-all duration-300 shadow-sm text-base-content">
                    <span className="text-[9px] font-black text-base-content/20 uppercase tracking-widest block mb-1">
                      Used
                    </span>
                    <p className="text-lg font-black tracking-tight tabular-nums font-mono">
                      {minutesToHoursAndMinutes(leaveBalance.usedMinutes)}
                    </p>
                  </div>

                  {/* REMAINING */}
                  <div className="sm:col-span-2 group/tile relative overflow-hidden p-4 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300 shadow-sm">
                    <div className="flex items-center justify-between gap-4 relative z-10">
                      <div>
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] block mb-0.5">
                          Available
                        </span>
                        <p className="text-3xl font-black tracking-tighter text-primary tabular-nums font-mono leading-none">
                          {minutesToHoursAndMinutes(
                            leaveBalance.remainingMinutes,
                          )}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover/tile:scale-110 transition-all">
                        <PiHandPalmBold size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}

// SELECTION PROMPT
function SelectionPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="border border-primary/20 rounded-xl p-8 bg-linear-to-br from-primary/5 via-transparent to-transparent text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <PiClock size={40} className="text-primary" />
        </motion.div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-semibold text-base-content mb-3"
      >
        Select Leave Details
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-base-content/60 mb-6"
      >
        Please select a Leave Type and Year to view your balance and proceed.
      </motion.p>
    </motion.div>
  );
}

// ==================== MAIN FORM COMPONENT ====================
export default function LeaveRequestForm({
  leave,
  actionType,
  onClose,
  refetch,
}: ILeaveFormProps) {
  const [isPending, setIsPending] = useState(false);
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [requestLeave] = useMutation(LEAVE_REQUEST);
  const [updateLeave] = useMutation(UPDATE_LEAVE);

  // Upload attachments function
  const uploadAttachments = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/assets/upload-file`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${file.name}`);
      }

      const result = await response.json();
      return result.imagePath;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsPending(true);

      // Handle file upload
      let attachmentPaths: string[] = [];
      if (data.attachments && data.attachments instanceof File) {
        const newFiles: File[] = [data.attachments];

        if (newFiles.length > 0) {
          attachmentPaths = await uploadAttachments(newFiles);
        }
      }

      // Format dates to ISO 8601 UTC
      const startDate = dayjs(data.startDate, "DD-MM-YYYY")
        .utc(true)
        .toISOString();
      const endDate =
        data.endDate && data.leaveDuration === LeaveDuration.MULTI_DAY
          ? dayjs(data.endDate, "DD-MM-YYYY").utc(true).toISOString()
          : undefined;

      const input = {
        userId: Number(user?.id),
        leaveTypeId: Number(data.leaveTypeId),
        leaveYear: Number(data.leaveYear),
        leaveDuration: data.leaveDuration,
        startDate,
        endDate,
        attachments:
          attachmentPaths.length > 0
            ? JSON.stringify(attachmentPaths)
            : leave?.attachments || undefined,
        notes: data.notes || undefined,
      };

      if (actionType === "create") {
        await requestLeave({
          variables: {
            requestLeaveInput: input,
          },
        });
      } else {
        await updateLeave({
          variables: {
            updateLeaveInput: { ...input, id: Number(leave?.id) },
          },
        });
      }

      refetch?.();
      onClose();
    } catch (error) {
      console.error("Error submitting leave:", error);
    } finally {
      setIsPending(false);
    }
  };

  const defaultValues = {
    leaveTypeId: leave?.leaveTypeId ? Number(leave.leaveTypeId) : "",
    leaveYear: leave?.leaveYear || new Date().getFullYear(),
    leaveDuration: leave?.leaveDuration || LeaveDuration.SINGLE_DAY,
    startDate: leave?.startDate
      ? dayjs(leave.startDate).format("DD-MM-YYYY")
      : "",
    endDate: leave?.endDate ? dayjs(leave.endDate).format("DD-MM-YYYY") : "",
    attachments: leave?.attachments ? JSON.parse(leave.attachments)?.at(0) : [],
    notes: leave?.notes || "",
  };

  return (
    <CustomForm
      submitHandler={handleSubmit}
      defaultValues={defaultValues}
      className={`flex flex-col gap-3`}
    >
      <LeaveFormFields leave={leave} />
      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
  );
}

function LeaveFormFields({ leave }: { leave?: ILeave }) {
  const { control } = useFormContext();
  const user = useAppStore((state) => state.user);
  const userId = user?.id;

  // WATCH FIELDS
  const leaveDuration = useWatch({
    control,
    name: "leaveDuration",
    defaultValue: LeaveDuration.SINGLE_DAY,
  });
  const leaveTypeId = useWatch({ control, name: "leaveTypeId" });
  const leaveYear = useWatch({ control, name: "leaveYear" });

  const shouldFetchBalance = !!(userId && leaveTypeId && leaveYear);

  // FETCH LEAVE TYPES
  const { data: leaveTypesData } = useQuery<{
    leaveTypes: { data: any[] };
  }>(GET_LEAVE_TYPES);

  const leaveTypeOptions = (leaveTypesData?.leaveTypes?.data || []).map(
    (type) => ({
      label: type.name,
      value: type.id,
    }),
  );

  // FETCH LEAVE BALANCE
  const { data: balanceData, loading: balanceLoading } =
    useQuery<ILeaveBalanceResponse>(LEAVE_BALANCE, {
      variables: {
        userId: Number(userId),
        leaveTypeId: Number(leaveTypeId),
        year: Number(leaveYear),
      },
      skip: !shouldFetchBalance,
      fetchPolicy: "network-only",
    });

  const leaveBalance = balanceData?.leaveBalance?.data;

  // ==================== CALENDAR QUERY ====================
  const { data: calendarData } = useQuery<IEmployeeCalendarDataResponse>(
    GET_EMPLOYEE_CALENDAR,
    {
      variables: {
        query: {
          userId: Number(userId),
          year: Number(leaveYear),
        },
      },
      skip: !userId || !leaveYear,
    },
  );

  // ==================== WORK SCHEDULE QUERY ====================
  const { data: scheduleData } = useQuery<{
    getActiveWorkSchedule: {
      data: {
        workSchedule: IWorkSchedule;
      };
    };
  }>(GET_ACTIVE_EMPLOYEE_WORK_SCHEDULE, {
    variables: { userId: Number(userId) },
    skip: !userId,
  });

  const workSchedule = scheduleData?.getActiveWorkSchedule?.data?.workSchedule;

  // PROCESS CALENDAR DATA INTO SPECIAL DATES
  const getWeekendDates = () => {
    if (!workSchedule?.schedules || !leaveYear) return [];

    const weekendDays = workSchedule.schedules
      .filter((schedule: any) => schedule.isWeekend)
      .map((schedule: any) => schedule.dayOfWeek);

    if (weekendDays.length === 0) return [];

    const startOfYear = dayjs().year(Number(leaveYear)).startOf("year");
    const endOfYear = dayjs().year(Number(leaveYear)).endOf("year");
    const weekendDates = [];

    let current = startOfYear;
    while (current.isBefore(endOfYear) || current.isSame(endOfYear, "day")) {
      if (weekendDays.includes(current.day())) {
        weekendDates.push({
          date: current.format("DD-MM-YYYY"),
          title: "Weekend",
          className: "bg-purple-100 text-purple-500 border-2 border-purple-500",
          disabled: false,
        });
      }
      current = current.add(1, "day");
    }

    return weekendDates;
  };

  const specialDates = [
    ...(calendarData?.employeeCalendar?.data?.attendances?.map((att: any) => ({
      date: dayjs(att.date).format("DD-MM-YYYY"),
      title: `Attendance: ${att.status}`,
      className: "bg-green-100 text-green-500 border-2 border-green-500",
      disabled: true,
    })) || []),
    ...(calendarData?.employeeCalendar?.data?.holidays?.map((hol: any) => ({
      date: dayjs(hol.startDate).format("DD-MM-YYYY"),
      title: `Holiday: ${hol.name}`,
      className: "bg-purple-100 text-purple-500 border-2 border-purple-500",
      disabled: true,
    })) || []),
    ...(calendarData?.employeeCalendar?.data?.leaves?.flatMap((l: any) => {
      const dates = [];
      let current = dayjs(l.startDate);
      const end = l.endDate ? dayjs(l.endDate) : current;

      while (current.isSameOrBefore(end, "day")) {
        // ONLY DISABLE IF IT'S NOT THE CURRENT LEAVE BEING UPDATED
        if (leave?.id && Number(leave.id) === Number(l.id)) {
          // skip
        } else {
          dates.push({
            date: current.format("DD-MM-YYYY"),
            title: `Existing Leave: ${l.status}`,
            className:
              "bg-red-500/10 text-red-500 border-2 border-red-500 font-bold",
            disabled: true,
          });
        }
        current = current.add(1, "day");
      }
      return dates;
    }) || []),
    ...getWeekendDates(),
  ];

  // OPTIONS
  const durationOptions = [
    { label: "Single Day", value: LeaveDuration.SINGLE_DAY },
    { label: "Multi Day", value: LeaveDuration.MULTI_DAY },
    { label: "Half Day", value: LeaveDuration.HALF_DAY },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 3 }, (_, i) => ({
    label: (currentYear - 1 + i).toString(),
    value: currentYear - 1 + i,
  }));

  return (
    <div className="space-y-6">
      {/* BASIC INFO */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            dataAuto="leaveTypeId"
            name="leaveTypeId"
            label="Leave Type"
            placeholder="Select Leave Type"
            required={true}
            options={leaveTypeOptions}
            isLoading={false}
          />
          <CustomSelect
            dataAuto="leaveYear"
            name="leaveYear"
            label="Leave Year"
            placeholder="Select Year"
            required={true}
            options={yearOptions}
            isLoading={false}
          />
          <CustomSelect
            dataAuto="leaveDuration"
            name="leaveDuration"
            label="Duration Type"
            placeholder="Select Duration"
            required={true}
            options={durationOptions}
            isLoading={false}
          />
        </div>
      </div>

      {/* LEAVE BALANCE INDICATOR OR PROMPT */}
      {shouldFetchBalance ? (
        <LeaveBalanceDisplay
          shouldFetchBalance={shouldFetchBalance}
          balanceLoading={balanceLoading}
          leaveBalance={leaveBalance}
        />
      ) : (
        <SelectionPrompt />
      )}

      {/* SHOW REST OF FORM ONLY IF BALANCE LOADED */}
      {leaveBalance && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* DATE INFO */}
          <div className="border border-primary/20 rounded-lg p-4">
            <h4 className="text-base font-semibold mb-3 text-primary">
              Leave Period
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomDatePicker
                dataAuto="startDate"
                name="startDate"
                label="Start Date"
                placeholder="Select Start Date"
                required={true}
                specialDates={specialDates}
              />
              {leaveDuration === LeaveDuration.MULTI_DAY && (
                <CustomDatePicker
                  dataAuto="endDate"
                  name="endDate"
                  label="End Date"
                  placeholder="Select End Date"
                  required={true}
                  specialDates={specialDates}
                />
              )}
            </div>
          </div>

          {/* ATTACHMENTS */}
          <div className="border border-primary/20 rounded-lg p-4">
            <h4 className="text-base font-semibold mb-3 text-primary">
              Supporting Documents
            </h4>
            <CustomFileUploader
              name="attachments"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              dataAuto="attachments"
              multiple={true}
            />
          </div>

          {/* NOTES */}
          <div className="border border-primary/20 rounded-lg p-4">
            <h4 className="text-base font-semibold mb-3 text-primary">
              Additional Information
            </h4>
            <CustomTextareaField
              dataAuto="notes"
              name="notes"
              label="Notes"
              placeholder="Add any additional notes..."
              required={false}
              rows={3}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
