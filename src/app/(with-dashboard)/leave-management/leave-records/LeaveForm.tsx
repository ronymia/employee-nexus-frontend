"use client";

// ==================== EXTERNAL IMPORTS ====================
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomFileUploader from "@/components/form/input/CustomFileUploader";
import EmployeeSelect from "@/components/input-fields/EmployeeSelect";
import LeaveTypeSelect from "@/components/input-fields/LeaveTypeSelect";
import { useFormContext, useWatch } from "react-hook-form";
import { ILeave, LeaveDuration } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { CREATE_LEAVE, UPDATE_LEAVE, LEAVE_BALANCE } from "@/graphql/leave.api";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useAppStore from "@/hooks/useAppStore";
import { motion, AnimatePresence } from "motion/react";
import { PiCheck, PiClock } from "react-icons/pi";
import { showToast } from "@/components/ui/CustomToast";
import dayjsUTC from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(dayjsUTC);

// ==================== TYPESCRIPT INTERFACES ====================
interface ILeaveFormProps {
  leave?: ILeave;
  actionType: "create" | "update";
  onClose: () => void;
  refetch?: () => void;
}

interface ILeaveBalanceData {
  leaveTypeId: number;
  leaveTypeName: string;
  year: number;
  allocatedHours: number;
  usedHours: number;
  remainingHours: number;
}

// ==================== SUB-COMPONENTS ====================

// BASIC INFO SECTION
interface IBasicInfoSectionProps {
  yearOptions: { label: string; value: number }[];
  durationOptions: { label: string; value: LeaveDuration }[];
  actionType: "create" | "update";
}

function BasicInfoSection({
  yearOptions,
  durationOptions,
  actionType,
}: IBasicInfoSectionProps) {
  return (
    <div className="border border-primary/20 rounded-lg p-4">
      <h4 className="text-base font-semibold mb-3 text-primary">
        Basic Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EmployeeSelect
          dataAuto="userId"
          name="userId"
          label="Employee"
          placeholder="Select Employee"
          required={true}
          disabled={actionType === "update"}
        />
        <LeaveTypeSelect
          dataAuto="leaveTypeId"
          name="leaveTypeId"
          label="Leave Type"
          placeholder="Select Leave Type"
          required={true}
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
    ? Math.round((leaveBalance.usedHours / leaveBalance.allocatedHours) * 100)
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        {balanceLoading ? (
          <div className="border border-info/20 rounded-xl p-6 bg-linear-to-br from-info/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="loading loading-spinner loading-md text-info"></div>
              <div>
                <p className="text-sm font-semibold text-base-content">
                  Fetching Leave Balance
                </p>
                <p className="text-xs text-base-content/60 mt-0.5">
                  Please wait...
                </p>
              </div>
            </div>
          </div>
        ) : leaveBalance ? (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="border border-success/30 rounded-xl p-6 bg-linear-to-br from-success/10 via-success/5 to-transparent shadow-lg shadow-success/10"
          >
            {/* HEADER */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <PiCheck size={24} className="text-success" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-success">
                    Leave Balance
                  </h4>
                  <p className="text-xs text-base-content/60">
                    {leaveBalance.leaveTypeName} - {leaveBalance.year}
                  </p>
                </div>
              </div>

              {/* USAGE BADGE */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  usagePercentage > 80
                    ? "bg-error/20 text-error border border-error/30"
                    : usagePercentage > 50
                      ? "bg-warning/20 text-warning border border-warning/30"
                      : "bg-success/20 text-success border border-success/30"
                }`}
              >
                {usagePercentage}% Used
              </motion.div>
            </motion.div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* ALLOCATED */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-base-100/70 backdrop-blur-sm rounded-lg p-4 border border-success/20"
              >
                <p className="text-xs text-base-content/60 mb-2 font-medium uppercase tracking-wide">
                  Allocated
                </p>
                <motion.p
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-3xl font-bold text-success mb-1"
                >
                  {leaveBalance.allocatedHours}h
                </motion.p>
                <p className="text-xs text-base-content/50">Total available</p>
              </motion.div>

              {/* USED */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-base-100/70 backdrop-blur-sm rounded-lg p-4 border border-warning/20"
              >
                <p className="text-xs text-base-content/60 mb-2 font-medium uppercase tracking-wide">
                  Used
                </p>
                <motion.p
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-3xl font-bold text-warning mb-1"
                >
                  {leaveBalance.usedHours}h
                </motion.p>
                <p className="text-xs text-base-content/50">Already taken</p>
              </motion.div>

              {/* REMAINING */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-base-100/70 backdrop-blur-sm rounded-lg p-4 border border-info/20"
              >
                <p className="text-xs text-base-content/60 mb-2 font-medium uppercase tracking-wide">
                  Remaining
                </p>
                <motion.p
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-3xl font-bold text-info mb-1"
                >
                  {leaveBalance.remainingHours}h
                </motion.p>
                <p className="text-xs text-base-content/50">Available to use</p>
              </motion.div>
            </div>

            {/* PROGRESS BAR */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-base-content/70">
                  Usage Progress
                </span>
                <span className="text-xs font-bold text-base-content">
                  {leaveBalance.usedHours} / {leaveBalance.allocatedHours} hours
                </span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercentage}%` }}
                  transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    usagePercentage > 80
                      ? "bg-linear-to-r from-error to-error/70"
                      : usagePercentage > 50
                        ? "bg-linear-to-r from-warning to-warning/70"
                        : "bg-linear-to-r from-success to-success/70"
                  }`}
                />
              </div>
            </motion.div>
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
      {/* ANIMATED ICON */}
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

      {/* TITLE */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-semibold text-base-content mb-3"
      >
        Complete Required Fields
      </motion.h3>

      {/* DESCRIPTION */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-base-content/60 mb-6"
      >
        Please fill in the following fields to view leave balance and continue
      </motion.p>

      {/* REQUIRED FIELDS CHECKLIST */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="inline-flex flex-col gap-2 text-left"
      >
        {["Employee", "Leave Type", "Year"].map((field, index) => (
          <motion.div
            key={field}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-base-100/50 border border-primary/10"
          >
            <div className="w-6 h-6 rounded-full border-2 border-primary/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary/50"></div>
            </div>
            <span className="text-sm font-medium text-base-content/70">
              {field}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* PULSING INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
        className="mt-6 text-xs text-primary font-medium"
      >
        ↑ Select fields above to continue
      </motion.div>
    </motion.div>
  );
}

// DATE SECTION
interface IDateSectionProps {
  leaveDuration: LeaveDuration;
}

function DateSection({ leaveDuration }: IDateSectionProps) {
  return (
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
        />
        {leaveDuration === LeaveDuration.MULTI_DAY && (
          <CustomDatePicker
            dataAuto="endDate"
            name="endDate"
            label="End Date"
            placeholder="Select End Date"
            required={true}
          />
        )}
      </div>
    </div>
  );
}

// ATTACHMENTS SECTION
function AttachmentsSection() {
  return (
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
  );
}

// NOTES SECTION
function NotesSection() {
  return (
    <div className="border border-primary/20 rounded-lg p-4">
      <h4 className="text-base font-semibold mb-3 text-primary">
        Additional Information
      </h4>
      <CustomTextareaField
        dataAuto="notes"
        name="notes"
        label="Notes"
        placeholder="Add any additional notes or reason for leave..."
        required={false}
        rows={3}
      />
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function LeaveForm({
  leave,
  actionType,
  onClose,
  refetch,
}: ILeaveFormProps) {
  // ==================== LOCAL STATE ====================
  const [isPending, setIsPending] = useState(false);
  const token = useAppStore((state) => state.token);
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ==================== GRAPHQL MUTATIONS ====================
  const [createLeave] = useMutation(CREATE_LEAVE);
  const [updateLeave] = useMutation(UPDATE_LEAVE);

  // ==================== HELPER FUNCTIONS ====================
  // UPLOAD ATTACHMENTS
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

  // CALCULATE TOTAL HOURS
  const calculateTotalHours = (
    startDate: string,
    endDate: string | undefined,
    duration: LeaveDuration,
  ): number => {
    if (duration === LeaveDuration.HALF_DAY) {
      return 4;
    }

    if (duration === LeaveDuration.SINGLE_DAY) {
      return 8;
    }

    // MULTI_DAY - calculate days between dates
    if (duration === LeaveDuration.MULTI_DAY && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const days = end.diff(start, "day") + 1; // Include both start and end date
      return days * 8;
    }

    return 8; // Default to single day
  };

  // ==================== FORM SUBMISSION ====================
  const handleSubmit = async (data: any) => {
    try {
      setIsPending(true);

      // HANDLE FILE UPLOAD
      let attachmentPaths: string[] = [];
      if (data.attachments && data.attachments instanceof File) {
        const newFiles: File[] = [data.attachments];
        if (newFiles.length > 0) {
          attachmentPaths = await uploadAttachments(newFiles);
        }
      }

      // FORMAT DATES TO ISO 8601
      const startDate = dayjs.utc(data.startDate, "DD-MM-YYYY").toISOString();
      const endDate =
        data.endDate && data.leaveDuration === LeaveDuration.MULTI_DAY
          ? dayjs.utc(data.endDate, "DD-MM-YYYY").toISOString()
          : undefined;

      // PREPARE INPUT
      const input = {
        userId: Number(data.userId),
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

      // CREATE OR UPDATE
      if (actionType === "create") {
        await createLeave({
          variables: {
            createLeaveInput: input,
          },
        });
        showToast.success(
          "Created!",
          "Leave request has been created successfully",
        );
      } else {
        await updateLeave({
          variables: {
            updateLeaveInput: { ...input, id: Number(leave?.id) },
          },
        });
        showToast.success(
          "Updated!",
          "Leave request has been updated successfully",
        );
      }

      refetch?.();
      onClose();
    } catch (error: any) {
      console.error("Error submitting leave:", error);
      showToast.error(
        "Error",
        error.message || `Failed to ${actionType} leave request`,
      );
    } finally {
      setIsPending(false);
    }
  };

  // ==================== DEFAULT VALUES ====================
  const defaultValues = {
    userId: leave?.userId || "",
    leaveTypeId: leave?.leaveTypeId ? Number(leave.leaveTypeId) : "",
    leaveYear: leave?.leaveYear || new Date().getFullYear(),
    leaveDuration: leave?.leaveDuration || LeaveDuration.SINGLE_DAY,
    startDate: leave?.startDate
      ? dayjs(leave.startDate).format("DD-MM-YYYY")
      : dayjs().format("DD-MM-YYYY"),
    endDate: leave?.endDate ? dayjs(leave.endDate).format("DD-MM-YYYY") : "",
    attachments: leave?.attachments ? JSON.parse(leave.attachments)?.at(0) : [],
    notes: leave?.notes || "",
  };

  // ==================== RENDER ====================
  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <LeaveFormFields actionType={actionType} />
      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
  );
}

// ==================== FORM FIELDS COMPONENT ====================
function LeaveFormFields({ actionType }: { actionType: "create" | "update" }) {
  // ==================== FORM CONTEXT ====================
  const { control, watch } = useFormContext();

  // WATCH REQUIRED FIELDS FOR BALANCE CHECK
  const userId = watch("userId");
  const leaveTypeId = watch("leaveTypeId");
  const leaveYear = watch("leaveYear");

  const leaveDuration = useWatch({
    control,
    name: "leaveDuration",
    defaultValue: LeaveDuration.SINGLE_DAY,
  });

  // ==================== LEAVE BALANCE QUERY ====================
  const shouldFetchBalance =
    userId && leaveTypeId && leaveYear && actionType === "create";

  const { data: balanceData, loading: balanceLoading } = useQuery<{
    leaveBalance: {
      data: ILeaveBalanceData;
    };
  }>(LEAVE_BALANCE, {
    variables: {
      leaveTypeId: Number(leaveTypeId),
      userId: Number(userId),
      year: Number(leaveYear),
    },
    skip: !shouldFetchBalance,
  });

  const leaveBalance = balanceData?.leaveBalance?.data;
  const showRestOfForm =
    actionType === "update" || (shouldFetchBalance && !balanceLoading);

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

  // ==================== RENDER ====================
  return (
    <div className="space-y-4">
      {/* BASIC INFO */}
      <BasicInfoSection
        yearOptions={yearOptions}
        durationOptions={durationOptions}
        actionType={actionType}
      />

      {/* LEAVE BALANCE */}
      <LeaveBalanceDisplay
        shouldFetchBalance={shouldFetchBalance}
        balanceLoading={balanceLoading}
        leaveBalance={leaveBalance}
      />

      {/* CONDITIONAL PROMPT */}
      {!showRestOfForm && actionType === "create" && <SelectionPrompt />}

      {/* REST OF FORM */}
      {showRestOfForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* DATE SECTION */}
          <DateSection leaveDuration={leaveDuration} />

          {/* ATTACHMENTS */}
          <AttachmentsSection />

          {/* NOTES */}
          <NotesSection />
        </motion.div>
      )}
    </div>
  );
}
