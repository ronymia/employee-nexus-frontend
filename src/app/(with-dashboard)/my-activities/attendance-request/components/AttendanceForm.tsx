"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomDateTimeInput from "@/components/form/input/CustomDateTimeInput";
import { IAttendance } from "@/types/attendance.type";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_ATTENDANCE,
  UPDATE_ATTENDANCE,
  GET_ATTENDANCES,
} from "@/graphql/attendance.api";
import moment from "moment";
import { useState } from "react";
import dayjs from "dayjs";
import { WorkSiteSelect, ProjectSelect } from "@/components/input-fields";
import useAppStore from "@/hooks/useAppStore";

interface AttendanceFormProps {
  attendance?: IAttendance;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function AttendanceForm({
  attendance,
  actionType,
  onClose,
}: AttendanceFormProps) {
  const [isPending, setIsPending] = useState(false);
  const user = useAppStore((state) => state.user);

  // Create mutation
  const [createAttendance] = useMutation(CREATE_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ATTENDANCES,
        variables: { query: { userId: Number(user?.id) } },
      },
    ],
  });

  // Update mutation
  const [updateAttendance] = useMutation(UPDATE_ATTENDANCE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ATTENDANCES,
        variables: { query: { userId: Number(user?.id) } },
      },
    ],
  });

  const handleSubmit = async (formValues: any) => {
    console.log({ formValues });
    try {
      setIsPending(true);

      const punchInTime = moment(formValues.punchIn).toISOString();
      const punchOutTime = formValues.punchOut
        ? moment(formValues.punchOut).toISOString()
        : null;

      // Calculate work hours and break hours
      let workHours = 0;
      let breakHours = 0;
      if (punchOutTime) {
        const totalMinutes = moment(punchOutTime).diff(
          moment(punchInTime),
          "minutes"
        );
        workHours = totalMinutes / 60;
        breakHours = 0; // Can be adjusted based on break tracking
      }

      // Get default values for IP, device, and location
      const defaultPunchData = {
        punchInIp: "192.168.1.100",
        punchOutIp: "192.168.1.100",
        punchInLat: 23.8103,
        punchInLng: 90.4125,
        punchOutLat: 23.8103,
        punchOutLng: 90.4125,
        punchInDevice: "Windows 10 - Chrome",
        punchOutDevice: "Windows 10 - Chrome",
      };

      if (actionType === "create") {
        await createAttendance({
          variables: {
            createAttendanceInput: {
              userId: Number(user?.id),
              date: dayjs(formValues.date, "DD-MM-YYYY"),
              totalHours: workHours,
              breakHours: breakHours,
              status: "pending",
              punchRecords: [
                {
                  projectId: formValues.projectId
                    ? parseInt(formValues.projectId)
                    : null,
                  workSiteId: formValues.workSiteId
                    ? parseInt(formValues.workSiteId)
                    : null,
                  punchIn: punchInTime,
                  punchOut: punchOutTime,
                  workHours: workHours,
                  breakHours: breakHours,
                  notes: formValues.notes || null,
                  ...defaultPunchData,
                },
              ],
            },
          },
        });
      } else {
        await updateAttendance({
          variables: {
            updateAttendanceInput: {
              id: Number(attendance?.id),
              userId: Number(user?.id),
              totalHours: workHours,
              breakHours: breakHours,
              status: "pending",
              punchRecords: [
                {
                  projectId: formValues.projectId
                    ? parseInt(formValues.projectId)
                    : null,
                  workSiteId: formValues.workSiteId
                    ? parseInt(formValues.workSiteId)
                    : null,
                  punchIn: punchInTime,
                  punchOut: punchOutTime,
                  workHours: workHours,
                  breakHours: breakHours,
                  notes: formValues.notes || null,
                  ...defaultPunchData,
                },
              ],
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

  console.log({ attendance });

  const defaultValues = {
    date: attendance?.date
      ? dayjs(attendance.date).format("DD-MM-YYYY")
      : dayjs().format("DD-MM-YYYY"),
    projectId: attendance?.punchRecords?.[0]?.projectId || "",
    workSiteId: attendance?.punchRecords?.[0]?.workSiteId || "",
    punchIn: attendance?.punchRecords?.[0]?.punchIn
      ? dayjs(attendance.punchRecords[0].punchIn).format("YYYY-MM-DDTHH:mm")
      : "",
    punchOut: attendance?.punchRecords?.[0]?.punchOut
      ? dayjs(attendance.punchRecords[0].punchOut).format("YYYY-MM-DDTHH:mm")
      : "",
    notes: attendance?.punchRecords?.[0]?.notes || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <AttendanceFormFields actionType={actionType} />
      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
  );
}

function AttendanceFormFields({
  actionType,
}: {
  actionType: "create" | "update";
}) {
  return (
    <div className="space-y-4">
      {/* Date Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Basic Information
        </h4>
        <div className="grid grid-cols-1 gap-4">
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

      {/* Project & Work Site Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Assignment Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProjectSelect name="projectId" required={true} />
          <WorkSiteSelect name="workSiteId" required={true} />
        </div>
      </div>

      {/* Punch In/Out Times */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Punch Times
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomDateTimeInput
            dataAuto="punchIn"
            name="punchIn"
            label="Punch In"
            placeholder="Select punch in time"
            required={true}
          />
          <CustomDateTimeInput
            dataAuto="punchOut"
            name="punchOut"
            label="Punch Out"
            placeholder="Select punch out time"
            required={false}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Additional Notes
        </h4>
        <CustomTextareaField
          dataAuto="notes"
          name="notes"
          label="Notes"
          placeholder="Add any additional notes or remarks..."
          required={true}
          rows={3}
        />
      </div>
    </div>
  );
}
