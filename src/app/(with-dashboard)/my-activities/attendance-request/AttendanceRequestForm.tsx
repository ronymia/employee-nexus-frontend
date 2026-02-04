"use client";

// ==================== EXTERNAL IMPORTS ====================
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useFormContext } from "react-hook-form";
import { motion } from "motion/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import {
  customFormatDate,
  formatDateForAPI,
  formatDateTimeForAPI,
  FORMAT_PRESETS,
} from "@/utils/date-format.utils";

// ==================== COMPONENT IMPORTS ====================
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomDateTimeInput from "@/components/form/input/CustomDateTimeInput";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import EmployeeProjectSelect from "@/components/input-fields/EmployeeProjectSelect";
import EmployeeWorkSiteSelect from "@/components/input-fields/EmployeeWorkSiteSelect";

// ==================== GRAPHQL IMPORTS ====================
import { ATTENDANCE_REQUEST, GET_ATTENDANCES } from "@/graphql/attendance.api";
import { GET_ACTIVE_EMPLOYEE_WORK_SCHEDULE } from "@/graphql/employee-work-schedule.api";
import { GET_EMPLOYEE_CALENDAR } from "@/graphql/employee-calendar.api";

// ==================== TYPES ====================
import { IEmployeeCalendarDataResponse, IWorkSchedule } from "@/types";

// ==================== HOOKS ====================
import useAppStore from "@/hooks/useAppStore";

// ==================== ICONS ====================
import { PiPlus, PiTrash } from "react-icons/pi";

// Extend dayjs with plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);

// ==================== TYPESCRIPT INTERFACES ====================
interface IAttendanceRequestFormProps {
  onClose: () => void;
}

interface IPunchRecordFieldsProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

// ==================== SUB-COMPONENT: PUNCH RECORD FIELDS ====================
function PunchRecordFields({
  index,
  onRemove,
  canRemove,
}: IPunchRecordFieldsProps) {
  const user = useAppStore((state) => state.user);

  return (
    <div className="border-2 border-primary/20 rounded-xl p-5 bg-linear-to-br from-base-100 to-base-200/50 shadow-lg">
      {/* HEADER */}
      <div className="flex flex-col gap-3 mb-4 pb-4 border-b-2 border-primary/10">
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
            query={{ userId: Number(user?.id) }}
          />
          <EmployeeWorkSiteSelect
            name={`punchRecords.${index}.workSiteId`}
            required={false}
            query={{ userId: Number(user?.id) }}
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
          placeholder="Reason for attendance request..."
          required={true}
          rows={2}
        />
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function AttendanceRequestForm({
  onClose,
}: IAttendanceRequestFormProps) {
  // ==================== LOCAL STATE ====================
  const [isPending, setIsPending] = useState(false);
  const [ipAddress, setIpAddress] = useState("192.168.1.1");
  const [deviceInfo, setDeviceInfo] = useState("Unknown Device");
  const user = useAppStore((state) => state.user);

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
  const [requestAttendance] = useMutation(ATTENDANCE_REQUEST, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ATTENDANCES,
        variables: { query: { userId: Number(user?.id) } },
      },
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
            ? formatDateTimeForAPI(record.punchIn)
            : null;
          const punchOutTime = record.punchOut
            ? formatDateTimeForAPI(record.punchOut)
            : null;

          const punchData: any = {
            projectId: record.projectId ? parseInt(record.projectId) : null,
            workSiteId: record.workSiteId ? parseInt(record.workSiteId) : null,
            punchIn: punchInTime,
            punchOut: punchOutTime,
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

          return punchData;
        },
      );

      // Convert date to UTC ISO string
      const utcDate = formatDateForAPI(formValues.date);

      await requestAttendance({
        variables: {
          requestAttendanceInput: {
            date: utcDate,
            punchRecords: processedPunchRecords,
          },
        },
      });

      onClose();
    } catch (error) {
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  // ==================== DEFAULT VALUES ====================
  const defaultValues = {
    date: customFormatDate(new Date(), FORMAT_PRESETS.INPUT_DATE),
    punchRecords: [
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
        <DateSection />

        {/* Punch Records */}
        <PunchRecordsSection />
      </div>

      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
  );
}

// ==================== DATE SECTION ====================
function DateSection() {
  const user = useAppStore((state) => state.user);
  const userId = user?.id;

  // ==================== QUERY EMPLOYEE CALENDAR ====================
  const { data: calendarData } = useQuery<IEmployeeCalendarDataResponse>(
    GET_EMPLOYEE_CALENDAR,
    {
      variables: {
        query: {
          userId: Number(userId),
        },
      },
      skip: !userId,
    },
  );

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

  // PROCESS CALENDAR DATA INTO SPECIAL DATES
  const getWeekendDates = () => {
    if (!workSchedule?.schedules) return [];

    const currentYear = new Date().getFullYear();
    const weekendDays = workSchedule.schedules
      .filter((schedule: any) => schedule.isWeekend)
      .map((schedule: any) => schedule.dayOfWeek);

    if (weekendDays.length === 0) return [];

    const startOfYear = dayjs().year(currentYear).startOf("year");
    const endOfYear = dayjs().year(currentYear).endOf("year");
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
    ...getWeekendDates(),
    ...(calendarData?.employeeCalendar?.data?.attendances?.map((att: any) => ({
      date: customFormatDate(att.date, FORMAT_PRESETS.INPUT_DATE),
      title: `Attendance: ${att.status}`,
      className: "bg-green-100 text-green-500 border-2 border-green-500",
      disabled: true,
    })) || []),
    ...(calendarData?.employeeCalendar?.data?.holidays?.map((hol: any) => ({
      date: customFormatDate(hol.startDate, FORMAT_PRESETS.INPUT_DATE),
      title: `Holiday: ${hol.name}`,
      className: "bg-blue-100 text-blue-500 border-2 border-blue-500",
      disabled: true,
    })) || []),
    ...(calendarData?.employeeCalendar?.data?.leaves?.map((leave: any) => ({
      date: customFormatDate(leave.startDate, FORMAT_PRESETS.INPUT_DATE),
      title: `Leave: ${leave.status}`,
      className: "bg-orange-100 text-orange-500 border-2 border-orange-500",
      disabled: true,
    })) || []),
  ];

  return (
    <div className="border border-primary/20 rounded-lg p-4">
      <h4 className="text-base font-semibold mb-3 text-primary">
        Request Date
      </h4>
      <CustomDatePicker
        dataAuto="date"
        name="date"
        label="Date"
        placeholder="Select Date"
        required={true}
        specialDates={specialDates}
      />
    </div>
  );
}

// ==================== PUNCH RECORDS SECTION ====================
function PunchRecordsSection() {
  const { watch, setValue } = useFormContext();
  const punchRecords = watch("punchRecords") || [];
  const date = watch("date"); // Format: DD-MM-YYYY
  const user = useAppStore((state) => state.user);
  const userId = user?.id;

  // ==================== QUERY WORK SCHEDULE ====================
  const { data: scheduleData } = useQuery<{
    getActiveWorkSchedule: {
      data: {
        workSchedule: IWorkSchedule;
      };
    };
  }>(GET_ACTIVE_EMPLOYEE_WORK_SCHEDULE, {
    variables: { userId: Number(userId) },
    skip: !userId || !date,
  });

  const hasSchedule = scheduleData?.getActiveWorkSchedule?.data?.workSchedule;

  // ==================== AUTO-POPULATE PUNCH TIMES ====================
  useEffect(() => {
    if (hasSchedule && date && punchRecords.length > 0) {
      // Convert selected date to weekday (0-6)
      const selectedDate = dayjs(date, "DD-MM-YYYY");
      const weekday = selectedDate.day();

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
          setValue("punchRecords", updatedRecords, { shouldValidate: false });
        }
      }
    }
  }, [hasSchedule, date, punchRecords.length, setValue]);

  // ==================== ADD PUNCH RECORD ====================
  const addPunchRecord = () => {
    setValue("punchRecords", [
      ...punchRecords,
      {
        _key: `new-${Date.now()}`,
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

  return (
    <div className="space-y-4">
      {/* OVERTIME ALERT - Show if no schedule */}
      {date && !hasSchedule && (
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
                You don't have a work schedule for this date. This attendance
                request will be counted as{" "}
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

        {/* RECORDS */}
        <div className="space-y-4">
          {punchRecords.map((record: any, index: number) => (
            <motion.div
              key={record._key || record.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PunchRecordFields
                index={index}
                onRemove={() => removePunchRecord(index)}
                canRemove={punchRecords.length > 1}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
