"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import { useFormContext, useWatch } from "react-hook-form";
import { IEmployee } from "@/types";
import { GET_PROJECTS } from "@/graphql/project.api";
import { GET_WORK_SITES } from "@/graphql/work-sites.api";
import { useQuery } from "@apollo/client/react";

interface IAttendancePunch {
  id?: number;
  attendanceId?: number;
  projectId?: number;
  workSiteId?: number;
  punchIn: string;
  punchOut?: string;
  breakStart?: string;
  breakEnd?: string;
  workHours?: number;
  breakHours?: number;
  punchInIp?: string;
  punchOutIp?: string;
  punchInLat?: number;
  punchInLng?: number;
  punchOutLat?: number;
  punchOutLng?: number;
  punchInDevice?: string;
  punchOutDevice?: string;
  notes?: string;
}

interface IAttendance {
  id?: number;
  userId: number;
  date: string;
  totalHours?: number;
  breakHours?: number;
  status: string;
  punchRecords?: IAttendancePunch[];
}

interface AttendanceFormProps {
  employees: IEmployee[];
  attendance?: IAttendance;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function AttendanceForm({
  employees,
  attendance,
  actionType,
  onClose,
}: AttendanceFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Attendance Form Submit:", {
      ...data,
      actionType,
    });
    // TODO: Implement GraphQL mutation
    onClose();
  };

  const defaultValues = {
    userId: attendance?.userId || "",
    date: attendance?.date || new Date().toISOString().split("T")[0],
    projectId: attendance?.punchRecords?.[0]?.projectId || "",
    workSiteId: attendance?.punchRecords?.[0]?.workSiteId || "",
    punchIn: attendance?.punchRecords?.[0]?.punchIn || "",
    punchOut: attendance?.punchRecords?.[0]?.punchOut || "",
    notes: attendance?.punchRecords?.[0]?.notes || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <AttendanceFormFields employees={employees} actionType={actionType} />
      <FormActionButton isPending={false} cancelHandler={onClose} />
    </CustomForm>
  );
}

function AttendanceFormFields({
  employees,
  actionType,
}: {
  employees: IEmployee[];
  actionType: "create" | "update";
}) {
  const { control } = useFormContext();
  const status = useWatch({
    control,
    name: "status",
    defaultValue: "present",
  });

  // Fetch projects
  const { data: projectsData } = useQuery<{
    projects: { data: any[] };
  }>(GET_PROJECTS);

  // Fetch work sites
  const { data: workSitesData } = useQuery<{
    workSites: { data: any[] };
  }>(GET_WORK_SITES);

  const employeeOptions = employees.map((emp) => ({
    label: emp.profile?.fullName || emp.email,
    value: emp.id.toString(),
  }));

  const projectOptions = (projectsData?.projects?.data || []).map(
    (project) => ({
      label: project.name,
      value: project.id.toString(),
    })
  );

  const workSiteOptions = (workSitesData?.workSites?.data || []).map(
    (site) => ({
      label: site.name,
      value: site.id.toString(),
    })
  );

  return (
    <div className="space-y-4">
      {/* Employee & Date Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            dataAuto="userId"
            name="userId"
            label="Employee"
            placeholder="Select Employee"
            required={true}
            options={employeeOptions}
            disabled={actionType === "update"}
            isLoading={false}
          />
          <CustomDatePicker
            dataAuto="date"
            name="date"
            label="Date"
            placeholder="Select Date"
            required={true}
            disabled={actionType === "update"}
          />
        </div>
      </div>

      {/* Project & Work Site Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Assignment Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            dataAuto="projectId"
            name="projectId"
            label="Project"
            placeholder="Select Project"
            required={false}
            options={projectOptions}
            isLoading={false}
          />
          <CustomSelect
            dataAuto="workSiteId"
            name="workSiteId"
            label="Work Site"
            placeholder="Select Work Site"
            required={false}
            options={workSiteOptions}
            isLoading={false}
          />
        </div>
      </div>

      {/* Punch In/Out Times */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Punch Times
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Punch In <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="datetime-local"
              name="punchIn"
              className="input input-bordered"
              data-auto="punchIn"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Punch Out</span>
            </label>
            <input
              type="datetime-local"
              name="punchOut"
              className="input input-bordered"
              data-auto="punchOut"
            />
          </div>
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
          required={false}
          rows={3}
        />
      </div>
    </div>
  );
}
