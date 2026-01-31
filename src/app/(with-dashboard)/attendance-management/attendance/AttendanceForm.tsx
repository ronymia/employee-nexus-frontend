"use client";

// ==================== EXTERNAL IMPORTS ====================
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

// ==================== COMPONENT IMPORTS ====================
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomDateTimeInput from "@/components/form/input/CustomDateTimeInput";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import EmployeeProjectSelect from "@/components/input-fields/EmployeeProjectSelect";
import EmployeeWorkSiteSelect from "@/components/input-fields/EmployeeWorkSiteSelect";

// ==================== SUB-COMPONENT IMPORTS ====================
import { BasicInfoFields } from "./components";

// ==================== GRAPHQL IMPORTS ====================
import {
  CREATE_ATTENDANCE,
  UPDATE_ATTENDANCE,
  GET_ATTENDANCES,
  ATTENDANCE_OVERVIEW,
} from "@/graphql/attendance.api";
import { GET_ACTIVE_EMPLOYEE_WORK_SCHEDULE } from "@/graphql/employee-work-schedule.api";
import { GET_EMPLOYEE_CALENDAR } from "@/graphql/employee-calendar.api";

// ==================== TYPE IMPORTS ====================
import { IAttendance } from "@/types/attendance.type";

// ==================== ICONS ====================
import {
  PiPlus,
  PiUserCircle,
  PiCalendarCheck,
  PiClock,
  PiTrash,
} from "react-icons/pi";
import { IWorkSchedule } from "@/types";

// Extend dayjs with plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);

// ==================== HELPER FUNCTIONS ====================

/**
 * Format work hours to "Xh Ym" format
 */
function formatWorkHours(hours: number | undefined): string {
  if (!hours || hours === 0) return "0h 0m";

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h ${minutes}m`;
  }
}

/**
 * Calculate work hours from punch in/out (for display only)
 */
function calculateWorkHours(punchIn: string, punchOut: string): number {
  if (!punchIn || !punchOut) return 0;

  const totalMinutes = dayjs(punchOut).diff(dayjs(punchIn), "minute");
  return totalMinutes / 60;
}

// ==================== TYPESCRIPT INTERFACES ====================

/**
 * Props for AttendanceForm component
 * @param attendance - Optional existing attendance record for update mode
 * @param actionType - Form mode: create new or update existing
 * @param onClose - Callback function to close the form
 */

interface IAttendanceFormProps {
  attendance?: IAttendance;
  actionType: "create" | "update";
  onClose: () => void;
}

interface IPunchRecordFieldsProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

// ==================== SUB-COMPONENT: SELECTION PROMPT ====================
/**
 * Displays animated prompt message when employee and date are not selected
 * Guides user to select required fields before adding punch records
 */
function SelectionPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="border border-primary/20 rounded-lg p-6 bg-linear-to-br from-primary/5 to-transparent"
    >
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {/* ICONS */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <PiUserCircle size={24} className="text-primary" />
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-primary/40 text-2xl"
          >
            +
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <PiCalendarCheck size={24} className="text-primary" />
          </motion.div>
        </div>

        {/* MESSAGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <p className="text-sm text-base-content/70 font-medium">
            Select an employee and date to continue
          </p>
          <p className="text-xs text-base-content/50 mt-1">
            Choose from the fields above to add punch records
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==================== SUB-COMPONENT: LOADING SCHEDULE STATE ====================
/**
 * Displays animated skeleton loader while fetching work schedule
 * Features shimmer effects and pulsing dots for modern UX
 */
function LoadingScheduleState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="border border-primary/20 rounded-lg p-6 bg-linear-to-br from-primary/5 to-transparent"
    >
      <div className="space-y-4">
        {/* HEADER WITH ROTATING CLOCK ICON */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <PiClock className="text-primary text-xl" />
          </motion.div>

          {/* SKELETON SHIMMER BARS */}
          <div className="flex-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-5 bg-primary/20 rounded-md overflow-hidden relative"
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-primary/30 to-transparent"
              />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-4 bg-primary/10 rounded-md mt-2 overflow-hidden relative"
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
                className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-primary/20 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* STATUS TEXT WITH PULSING DOTS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-base-content/60"
        >
          <span>Fetching work schedule</span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            •
          </motion.span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          >
            •
          </motion.span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          >
            •
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==================== SUB-COMPONENT: PUNCH RECORD FIELDS ====================
/**
 * Individual punch record form fields
 * Displays project, work site, punch times, notes, and calculated work hours
 *
 * @param index - Record index in array
 * @param onRemove - Callback to remove this record
 * @param canRemove - Whether this record can be removed
 */
function PunchRecordFields({
  index,
  onRemove,
  canRemove,
}: IPunchRecordFieldsProps) {
  const { watch } = useFormContext();

  return (
    <div className="border-2 border-primary/20 rounded-xl p-5 bg-linear-to-br from-base-100 to-base-200/50 shadow-lg">
      {/* ENHANCED HEADER WITH HOURS METRICS */}
      <div className="flex flex-col gap-3 mb-4 pb-4 border-b-2 border-primary/10">
        {/* TOP ROW: Record Number & Delete Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                #{index + 1}
              </span>
            </div>
            <h5 className="text-base font-semibold text-base-content">
              Punch Record
            </h5>
          </div>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/10"
            >
              <PiTrash size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* PROJECT & WORK SITE SELECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmployeeProjectSelect
            name={`punchRecords.${index}.projectId`}
            required={false}
            query={{ userId: watch("userId") }}
          />
          <EmployeeWorkSiteSelect
            name={`punchRecords.${index}.workSiteId`}
            required={false}
            query={{ userId: watch("userId") }}
          />
        </div>

        {/* PUNCH IN/OUT TIMES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomDateTimeInput
            dataAuto={`punchRecords.${index}.punchIn`}
            name={`punchRecords.${index}.punchIn`}
            label="Punch In"
            placeholder="Select punch in time"
            required={true}
          />
          <CustomDateTimeInput
            dataAuto={`punchRecords.${index}.punchOut`}
            name={`punchRecords.${index}.punchOut`}
            label="Punch Out"
            placeholder="Select punch out time"
            required={false}
          />
        </div>

        {/* NOTES FIELD */}
        <CustomTextareaField
          dataAuto={`punchRecords.${index}.notes`}
          name={`punchRecords.${index}.notes`}
          label="Notes"
          placeholder="Add notes for this punch record..."
          required={false}
          rows={2}
        />
      </div>
    </div>
  );
}

// ==================== MAIN ATTENDANCE FORM COMPONENT ====================
/**
 * Main attendance form component for creating and updating attendance records
 * Handles automatic IP detection, device info capture, and work schedule integration
 * Auto-populates punch times based on employee's work schedule
 */
export default function AttendanceForm({
  attendance,
  actionType,
  onClose,
}: IAttendanceFormProps) {
  // ==================== LOCAL STATE ====================
  const [isPending, setIsPending] = useState(false);
  const [ipAddress, setIpAddress] = useState("192.168.1.1");
  const [deviceInfo, setDeviceInfo] = useState("Unknown Device");

  // ==================== GRAPHQL MUTATIONS ====================

  // ==================== DETECT IP ADDRESS ====================
  useEffect(() => {
    // Fetch public IP address
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip))
      .catch((error) => {
        console.error("Error fetching IP:", error);
        setIpAddress("Unknown IP");
      });

    // Get device and browser information
    const getDeviceInfo = () => {
      const ua = navigator.userAgent;
      let browser = "Unknown Browser";
      let os = "Unknown OS";

      // Detect browser
      if (ua.indexOf("Firefox") > -1) {
        browser = "Firefox";
      } else if (ua.indexOf("Chrome") > -1) {
        browser = "Chrome";
      } else if (ua.indexOf("Safari") > -1) {
        browser = "Safari";
      } else if (ua.indexOf("Edge") > -1) {
        browser = "Edge";
      } else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1) {
        browser = "IE";
      }

      // Detect OS
      if (ua.indexOf("Windows NT 10.0") > -1) os = "Windows 10";
      else if (ua.indexOf("Windows NT 6.3") > -1) os = "Windows 8.1";
      else if (ua.indexOf("Windows NT 6.2") > -1) os = "Windows 8";
      else if (ua.indexOf("Windows NT 6.1") > -1) os = "Windows 7";
      else if (ua.indexOf("Mac") > -1) os = "MacOS";
      else if (ua.indexOf("X11") > -1) os = "UNIX";
      else if (ua.indexOf("Linux") > -1) os = "Linux";
      else if (ua.indexOf("Android") > -1) os = "Android";
      else if (ua.indexOf("iOS") > -1) os = "iOS";

      return `${os} - ${browser}`;
    };

    setDeviceInfo(getDeviceInfo());
  }, []);

  // ==================== MUTATIONS ====================
  const [createAttendance] = useMutation(CREATE_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: ATTENDANCE_OVERVIEW },
      { query: GET_ATTENDANCES, variables: { query: {} } },
    ],
  });

  const [updateAttendance] = useMutation(UPDATE_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: ATTENDANCE_OVERVIEW },
      { query: GET_ATTENDANCES, variables: { query: {} } },
    ],
  });

  // ==================== FORM SUBMISSION ====================
  const handleSubmit = async (formValues: any) => {
    try {
      setIsPending(true);

      // Process all punch records
      const processedPunchRecords = formValues.punchRecords.map(
        (record: any) => {
          const punchInTime = record.punchIn
            ? dayjs(record.punchIn).toISOString()
            : null;
          const punchOutTime = record.punchOut
            ? dayjs(record.punchOut).toISOString()
            : null;

          const punchData: any = {
            projectId: record.projectId ? parseInt(record.projectId) : null,
            workSiteId: record.workSiteId ? parseInt(record.workSiteId) : null,
            punchIn: punchInTime,
            punchOut: punchOutTime,
            // breakStart: punchInTime,
            // breakEnd: punchInTime,
            breakMinutes: 0,
            notes: record.notes || null,
            punchInIp: ipAddress,
            punchOutIp: ipAddress,
            punchInLat: 23.8103,
            punchInLng: 90.4125,
            punchOutLat: 23.8103,
            punchOutLng: 90.4125,
            punchInDevice: deviceInfo,
            punchOutDevice: deviceInfo,
          };

          // Only include id and attendanceId for existing records (update scenario)
          if (record.id) {
            punchData.id = Number(record.id);
          }
          if (record.attendanceId) {
            punchData.attendanceId = Number(record.attendanceId);
          }

          return punchData;
        },
      );

      if (actionType === "create") {
        // Parse date in UTC to avoid timezone issues
        // DD-MM-YYYY → UTC date at midnight
        const utcDate = dayjs.utc(formValues.date, "DD-MM-YYYY").toDate();

        await createAttendance({
          variables: {
            createAttendanceInput: {
              userId: parseInt(formValues.userId),
              date: utcDate,
              breakMinutes: 0,
              punchRecords: processedPunchRecords,
            },
          },
        });
      } else {
        await updateAttendance({
          variables: {
            updateAttendanceInput: {
              id: Number(attendance?.id),
              userId: parseInt(formValues.userId),
              breakMinutes: 0,
              punchRecords: processedPunchRecords,
            },
          },
        });
      }

      onClose();
    } catch (error) {
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  // ==================== DEFAULT VALUES ====================
  const defaultValues = {
    userId: attendance?.userId ? Number(attendance?.userId) : "",
    date: attendance?.date
      ? dayjs(attendance.date).format("DD-MM-YYYY")
      : dayjs().format("DD-MM-YYYY"),
    punchRecords:
      attendance?.punchRecords && attendance.punchRecords.length > 0
        ? attendance.punchRecords.map((record) => ({
            id: record?.id,
            attendanceId: Number(record?.attendanceId),
            projectId: record.projectId ? Number(record.projectId) : "",
            workSiteId: record.workSiteId ? Number(record.workSiteId) : "",
            punchIn: record.punchIn
              ? dayjs(record.punchIn).format("YYYY-MM-DDTHH:mm")
              : "",
            punchOut: record.punchOut
              ? dayjs(record.punchOut).format("YYYY-MM-DDTHH:mm")
              : "",
            notes: record.notes || "",
          }))
        : [
            {
              _key: `new-${Date.now()}`,
              projectId: "",
              workSiteId: "",
              punchIn: "",
              punchOut: "",
              notes: "",
            },
          ],
  };

  return (
    <CustomForm
      submitHandler={handleSubmit}
      defaultValues={defaultValues}
      className={`flex flex-col gap-4`}
    >
      <div className="space-y-4">
        {/* Basic Information */}
        <BasicInfoFieldsWithCalendar actionType={actionType} />

        {/* Punch Records - Conditional Display */}
        <PunchRecordsSection actionType={actionType} />
      </div>

      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
  );
}

// ==================== BASIC INFO FIELDS WITH CALENDAR ====================
/**
 * Wrapper component that fetches calendar data and passes it to BasicInfoFields
 */
function BasicInfoFieldsWithCalendar({
  actionType,
}: {
  actionType: "create" | "update";
}) {
  const { watch } = useFormContext();
  const userId = watch("userId");

  // ==================== QUERY EMPLOYEE CALENDAR ====================
  const { data: calendarData } = useQuery(GET_EMPLOYEE_CALENDAR, {
    variables: {
      query: {
        userId: Number(userId),
      },
    },
    skip: !userId,
  });

  // ==================== QUERY WORK SCHEDULE ====================
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

  return (
    <BasicInfoFields
      actionType={actionType}
      calendarData={calendarData}
      workSchedule={workSchedule}
    />
  );
}

// ==================== PUNCH RECORDS SECTION COMPONENT ====================

/**
 * Manages dynamic punch records with auto-population from work schedule
 * Handles add/remove operations and conditional rendering based on schedule
 */
function PunchRecordsSection({
  actionType,
}: {
  actionType: "create" | "update";
}) {
  const { watch, setValue } = useFormContext();
  const punchRecords = watch("punchRecords") || [];
  const userId = watch("userId");
  const date = watch("date"); // Format: DD-MM-YYYY

  // ==================== QUERY WORK SCHEDULE ====================
  // Query user's work schedule - ONLY after BOTH userId AND date are selected
  const { data: scheduleData, loading: scheduleLoading } = useQuery<{
    getActiveWorkSchedule: {
      data: {
        workSchedule: IWorkSchedule;
      };
    };
  }>(GET_ACTIVE_EMPLOYEE_WORK_SCHEDULE, {
    variables: { userId: Number(userId) },
    skip: !userId || !date || actionType === "update", // Skip if either missing OR update mode
  });

  const hasSchedule = scheduleData?.getActiveWorkSchedule?.data?.workSchedule;
  console.log({ hasSchedule });

  // ==================== AUTO-POPULATE PUNCH TIMES ====================
  // Auto-populate punch times when schedule is loaded
  useEffect(() => {
    if (hasSchedule && date && actionType === "create") {
      // Convert selected date to weekday (0-6)
      const selectedDate = dayjs(date, "DD-MM-YYYY");
      const weekday = selectedDate.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Find schedule for this weekday
      const daySchedule = hasSchedule.schedules?.find(
        (s: any) => s.dayOfWeek === weekday && !s.isWeekend,
      );

      if (
        daySchedule &&
        daySchedule.timeSlots &&
        daySchedule.timeSlots.length > 0
      ) {
        // Get first time slot
        const firstSlot = daySchedule.timeSlots[0];

        // Combine selected date with start/end times
        const punchInDateTime = dayjs(
          `${selectedDate.format("YYYY-MM-DD")} ${firstSlot.startTime}`,
          "YYYY-MM-DD HH:mm",
        ).format("YYYY-MM-DDTHH:mm");

        const punchOutDateTime = dayjs(
          `${selectedDate.format("YYYY-MM-DD")} ${firstSlot.endTime}`,
          "YYYY-MM-DD HH:mm",
        ).format("YYYY-MM-DDTHH:mm");

        // Update first punch record with schedule times
        const updatedRecords = [...punchRecords];
        if (updatedRecords[0]) {
          updatedRecords[0] = {
            ...updatedRecords[0],
            punchIn: punchInDateTime,
            punchOut: punchOutDateTime,
          };
          setValue("punchRecords", updatedRecords);
        }
      }
    }
  }, [hasSchedule, date, actionType, setValue]);

  // ==================== ADD PUNCH RECORD ====================
  const addPunchRecord = () => {
    setValue("punchRecords", [
      ...punchRecords,
      {
        _key: `new-${Date.now()}`, // Unique key for React rendering
        projectId: "",
        workSiteId: "",
        punchIn: "",
        punchOut: "",
        notes: "",
      },
    ]);
  };

  // ==================== REMOVE PUNCH RECORD ====================
  const removePunchRecord = (index: number) => {
    if (punchRecords.length > 1) {
      const newRecords = punchRecords.filter(
        (_: any, i: number) => i !== index,
      );
      setValue("punchRecords", newRecords);
    }
  };

  // ==================== CONDITIONAL RENDERING ====================

  // Show prompt if employee/date not selected
  if (!userId || !date) {
    return <SelectionPrompt />;
  }

  // Show loading state while fetching schedule
  if (scheduleLoading && actionType === "create") {
    return <LoadingScheduleState />;
  }

  // ==================== RENDER PUNCH RECORDS ====================
  return (
    <div className="space-y-4">
      {/* OVERTIME ALERT - Show if no schedule in create mode */}
      {actionType === "create" && !scheduleLoading && !hasSchedule && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-warning shadow-md"
        >
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="font-bold">No Work Schedule Found</h3>
              <div className="text-sm">
                This employee doesn't have a work schedule for this date. This
                attendance will be counted as{" "}
                <span className="font-semibold">overtime</span>.
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="border border-primary/20 rounded-lg p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-semibold text-primary">
            Punch Records
          </h4>
          <button
            type="button"
            onClick={() => addPunchRecord()}
            className="btn btn-sm btn-primary gap-2"
          >
            <PiPlus size={16} />
            Add Record
          </button>
        </div>

        {/* HOURS SUMMARY - Show for all records combined */}
        {(() => {
          // Calculate scheduled hours for the day
          const getScheduledHours = () => {
            if (!hasSchedule || !date) return 0;
            const selectedDate = dayjs(date, "DD-MM-YYYY");
            const weekday = selectedDate.day();
            const daySchedule = hasSchedule.schedules?.find(
              (s: any) => s.dayOfWeek === weekday && !s.isWeekend,
            );
            if (!daySchedule?.timeSlots?.[0]) return 0;
            const slot = daySchedule.timeSlots[0];
            const start = dayjs(`2000-01-01 ${slot.startTime}`);
            const end = dayjs(`2000-01-01 ${slot.endTime}`);
            return end.diff(start, "minute") / 60;
          };

          // Calculate total work hours from all records
          const totalWorkHours = punchRecords.reduce(
            (sum: number, record: any) => {
              return sum + calculateWorkHours(record.punchIn, record.punchOut);
            },
            0,
          );

          const scheduledHours = getScheduledHours();
          const overtimeHours = Math.max(0, totalWorkHours - scheduledHours);

          return scheduledHours > 0 || totalWorkHours > 0 ? (
            <div className="mb-4 p-4 bg-linear-to-br from-primary/5 to-transparent border-2 border-primary/20 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-base-content/70">
                  Daily Hours Summary
                </h5>
                {/* Attendance Date with Day Name */}
                {date && (
                  <span className="text-xs font-medium text-base-content/60">
                    {dayjs(date, "DD-MM-YYYY").format("dddd, DD MMM YYYY")}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Scheduled Hours */}
                <div className="flex flex-col items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-xs text-blue-600 font-medium">
                    Scheduled
                  </span>
                  <span className="text-xl font-bold text-blue-700">
                    {formatWorkHours(scheduledHours)}
                  </span>
                </div>

                {/* Total Work Hours */}
                <div className="flex flex-col items-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <span className="text-xs text-green-600 font-medium">
                    Total Worked
                  </span>
                  <span className="text-xl font-bold text-green-700">
                    {formatWorkHours(totalWorkHours)}
                  </span>
                </div>

                {/* Overtime Hours */}
                <div className="flex flex-col items-center p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <span className="text-xs text-orange-600 font-medium">
                    Overtime
                  </span>
                  <span className="text-xl font-bold text-orange-700">
                    {formatWorkHours(overtimeHours)}
                  </span>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* PUNCH RECORDS LIST */}
        <AnimatePresence mode="popLayout">
          {punchRecords.map((record: any, index: number) => (
            <motion.div
              key={record._key || record.id || `record-${index}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              layout
              className={`mb-2.5`}
            >
              <PunchRecordFields
                index={index}
                onRemove={() => removePunchRecord(index)}
                canRemove={punchRecords.length > 1}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
