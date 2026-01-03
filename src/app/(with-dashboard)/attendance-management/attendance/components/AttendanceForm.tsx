"use client";

// ==================== EXTERNAL IMPORTS ====================
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// ==================== COMPONENT IMPORTS ====================
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";

// ==================== SUB-COMPONENT IMPORTS ====================
import {
  BasicInfoFields,
  PunchRecordFields,
  LoadingScheduleState,
  SelectionPrompt,
} from "./";

// ==================== GRAPHQL IMPORTS ====================
import {
  CREATE_ATTENDANCE,
  UPDATE_ATTENDANCE,
  GET_ATTENDANCES,
} from "@/graphql/attendance.api";
import { GET_USER_WORK_SCHEDULE } from "@/graphql/work-schedules.api";

// ==================== TYPE IMPORTS ====================
import { IAttendance } from "@/types/attendance.type";

// ==================== ICONS ====================
import { PiPlus } from "react-icons/pi";
import { IWorkSchedule } from "@/types";

// Extend dayjs with custom parse format
dayjs.extend(customParseFormat);

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
    refetchQueries: [{ query: GET_ATTENDANCES, variables: { query: {} } }],
  });

  const [updateAttendance] = useMutation(UPDATE_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ATTENDANCES, variables: { query: {} } }],
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
        }
      );

      if (actionType === "create") {
        await createAttendance({
          variables: {
            createAttendanceInput: {
              userId: parseInt(formValues.userId),
              date: dayjs(formValues.date, "DD-MM-YYYY").toDate(),
              breakMinutes: 0,
              // status: "approved",
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
              // status: "approved",
              punchRecords: processedPunchRecords,
            },
          },
        });
      }

      onClose();
    } catch (error) {
      console.log("Error submitting attendance:", error);
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
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <div className="space-y-4">
        {/* Basic Information */}
        <BasicInfoFields actionType={actionType} />

        {/* Punch Records - Conditional Display */}
        <PunchRecordsSection actionType={actionType} />
      </div>

      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
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
    getUserWorkSchedule: {
      data: IWorkSchedule;
    };
  }>(GET_USER_WORK_SCHEDULE, {
    variables: { userId: Number(userId) },
    skip: !userId || !date || actionType === "update", // Skip if either missing OR update mode
  });

  const hasSchedule = scheduleData?.getUserWorkSchedule?.data;
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
        (s: any) => s.day === weekday && !s.isWeekend
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
          "YYYY-MM-DD HH:mm"
        ).format("YYYY-MM-DDTHH:mm");

        const punchOutDateTime = dayjs(
          `${selectedDate.format("YYYY-MM-DD")} ${firstSlot.endTime}`,
          "YYYY-MM-DD HH:mm"
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
        (_: any, i: number) => i !== index
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
