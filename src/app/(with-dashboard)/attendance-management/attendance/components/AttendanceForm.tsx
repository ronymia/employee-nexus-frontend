"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomDateTimeInput from "@/components/form/input/CustomDateTimeInput";
import { IEmployee } from "@/types";
import { IAttendance } from "@/types/attendance.type";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_ATTENDANCE,
  UPDATE_ATTENDANCE,
  GET_ATTENDANCES,
} from "@/graphql/attendance.api";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  WorkSiteSelect,
  ProjectSelect,
  EmployeeSelect,
} from "@/components/input-fields";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { PiPlus, PiTrash, PiClock } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { useFormContext } from "react-hook-form";
import EmployeeProjectSelect from "@/components/input-fields/EmployeeProjectSelect";
import EmployeeWorkSiteSelect from "@/components/input-fields/EmployeeWorkSiteSelect";

dayjs.extend(customParseFormat);

// ==================== INTERFACES ====================
interface AttendanceFormProps {
  employees: IEmployee[];
  attendance?: IAttendance;
  actionType: "create" | "update";
  onClose: () => void;
}

// ==================== HELPER FUNCTIONS ====================

// Format work hours to "Xh Ym" format
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

// Calculate work hours from punch in/out (for display only)
function calculateWorkHours(punchIn: string, punchOut: string): number {
  if (!punchIn || !punchOut) return 0;

  const totalMinutes = dayjs(punchOut).diff(dayjs(punchIn), "minute");
  return totalMinutes / 60;
}

// ==================== MAIN COMPONENT ====================
export default function AttendanceForm({
  employees,
  attendance,
  actionType,
  onClose,
}: AttendanceFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [ipAddress, setIpAddress] = useState("192.168.1.1");
  const [deviceInfo, setDeviceInfo] = useState("Unknown Device");

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
            breakHours: 0,
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
              breakHours: 0,
              status: "approved",
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
              breakHours: 0,
              status: "approved",
              punchRecords: processedPunchRecords,
            },
          },
        });
      }

      onClose();
    } catch (error) {
      console.error("Error submitting attendance:", error);
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

        {/* Punch Records */}
        <PunchRecordsSection />
      </div>

      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
  );
}

// ==================== SUB-COMPONENTS ====================

// Basic Information Fields
function BasicInfoFields({ actionType }: { actionType: "create" | "update" }) {
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
        <CustomDatePicker
          dataAuto="date"
          name="date"
          label="Date"
          placeholder="Select Date"
          required={true}
          disabled={actionType === "update"}
          formatDate="DD-MM-YYYY"
        />
      </div>
    </div>
  );
}

// Punch Records Section with manual array management
function PunchRecordsSection() {
  const { watch, setValue } = useFormContext();
  const punchRecords = watch("punchRecords") || [];

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

  const removePunchRecord = (index: number) => {
    if (punchRecords.length > 1) {
      const newRecords = punchRecords.filter(
        (_: any, i: number) => i !== index
      );
      setValue("punchRecords", newRecords);
    }
  };

  // console.log({ punchRecords });

  return (
    <div className="border border-primary/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-semibold text-primary">Punch Records</h4>
        <button
          type="button"
          onClick={() => addPunchRecord()}
          className="btn btn-sm btn-primary gap-2"
        >
          <PiPlus size={16} />
          Add Record
        </button>
      </div>

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
  );
}

// Individual Punch Record Fields
function PunchRecordFields({
  index,
  onRemove,
  canRemove,
}: {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const { watch } = useFormContext();
  const punchIn = watch(`punchRecords.${index}.punchIn`);
  const punchOut = watch(`punchRecords.${index}.punchOut`);

  // Calculate work hours in real-time
  const workHours = calculateWorkHours(punchIn, punchOut);
  return (
    <div className="mb-4 p-4 bg-base-200 rounded-lg border border-base-300">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-sm font-semibold text-base-content">
          Record #{index + 1}
        </h5>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="btn btn-sm btn-ghost btn-circle text-error"
          >
            <PiTrash size={16} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Project & Work Site */}
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

        {/* Punch Times */}
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

        {/* Notes */}
        <CustomTextareaField
          dataAuto={`punchRecords.${index}.notes`}
          name={`punchRecords.${index}.notes`}
          label="Notes"
          placeholder="Add notes for this punch record..."
          required={false}
          rows={2}
        />

        {/* Work Hours Display */}
        {workHours > 0 && (
          <div className="bg-info/10 border border-info/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <PiClock size={16} className="text-info" />
              <div>
                <p className="text-xs text-base-content/60">
                  Calculated Work Hours
                </p>
                <p className="text-sm font-semibold text-info">
                  {formatWorkHours(workHours)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
