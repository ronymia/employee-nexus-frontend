"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import { IEmployee } from "@/types";
import moment from "moment";

interface EmploymentDetailsFormProps {
  employee?: IEmployee;
  onClose: () => void;
}

export default function EmploymentDetailsForm({
  employee,
  onClose,
}: EmploymentDetailsFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Employment Details Update:", data);
    // TODO: Implement GraphQL mutation
    onClose();
  };

  const defaultValues = {
    employeeId: employee?.employeeId || "",
    departmentId: employee?.departmentId || "",
    designationId: employee?.designationId || "",
    employmentStatusId: employee?.employmentStatusId || "",
    joiningDate: employee?.joiningDate
      ? new Date(employee.joiningDate).toISOString().split("T")[0]
      : "",
    workSiteId: employee?.workSiteId || "",
    workScheduleId: employee?.workScheduleId || "",
    nidNumber: employee?.nidNumber || "",
    salaryPerMonth: employee?.salaryPerMonth || "",
    workingDaysPerWeek: employee?.workingDaysPerWeek || "",
    workingHoursPerWeek: employee?.workingHoursPerWeek || "",
    rotaType: employee?.rotaType || "",
    status: employee?.status || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <div className="space-y-4">
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Employment Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInputField
              dataAuto="employeeId"
              name="employeeId"
              type="text"
              label="Employee ID"
              placeholder="Enter employee ID"
              required={false}
            />
            <CustomDatePicker
              dataAuto="joiningDate"
              name="joiningDate"
              label="Joining Date"
              required={false}
              formatDate="DD-MM-YYYY"
            />
            <CustomInputField
              dataAuto="departmentId"
              name="departmentId"
              type="text"
              label="Department"
              placeholder="Department"
              required={false}
              disabled={true}
            />
            <CustomInputField
              dataAuto="designationId"
              name="designationId"
              type="text"
              label="Designation"
              placeholder="Designation"
              required={false}
              disabled={true}
            />
            <CustomInputField
              dataAuto="employmentStatusId"
              name="employmentStatusId"
              type="text"
              label="Employment Status"
              placeholder="Employment Status"
              required={false}
              disabled={true}
            />
            <CustomInputField
              dataAuto="workSiteId"
              name="workSiteId"
              type="text"
              label="Work Site"
              placeholder="Work Site"
              required={false}
              disabled={true}
            />
            <CustomInputField
              dataAuto="workScheduleId"
              name="workScheduleId"
              type="text"
              label="Work Schedule"
              placeholder="Work Schedule"
              required={false}
              disabled={true}
            />
            <CustomInputField
              dataAuto="nidNumber"
              name="nidNumber"
              type="text"
              label="NID Number"
              placeholder="Enter NID number"
              required={false}
            />
            <CustomInputField
              dataAuto="salaryPerMonth"
              name="salaryPerMonth"
              type="number"
              label="Salary (Monthly)"
              placeholder="Enter monthly salary"
              required={false}
            />
            <CustomInputField
              dataAuto="workingDaysPerWeek"
              name="workingDaysPerWeek"
              type="number"
              label="Working Days/Week"
              placeholder="Enter working days"
              required={false}
            />
            <CustomInputField
              dataAuto="workingHoursPerWeek"
              name="workingHoursPerWeek"
              type="number"
              label="Working Hours/Week"
              placeholder="Enter working hours"
              required={false}
            />
            <CustomInputField
              dataAuto="rotaType"
              name="rotaType"
              type="text"
              label="Rota Type"
              placeholder="Enter rota type"
              required={false}
            />
            <CustomSelect
              dataAuto="status"
              name="status"
              label="Status"
              placeholder="Select status"
              required={false}
              isLoading={false}
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
              ]}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <FormActionButton isPending={false} cancelHandler={onClose} />
      </div>
    </CustomForm>
  );
}
