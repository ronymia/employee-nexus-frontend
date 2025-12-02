"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import DepartmentSelect from "@/components/input-fields/DepartmentSelect";
import DesignationSelect from "@/components/input-fields/DesignationSelect";
import EmploymentStatusSelect from "@/components/input-fields/EmploymentStatusSelect";
import WorkSiteSelect from "@/components/input-fields/WorkSiteSelect";
import WorkScheduleSelect from "@/components/input-fields/WorkScheduleSelect";
import { IEmployee } from "@/types";
import dayjs from "dayjs";
import { UPDATE_EMPLOYMENT_DETAILS } from "@/graphql/profile.api";
import { useMutation } from "@apollo/client/react";
import { GET_EMPLOYEE_BY_ID } from "@/graphql/employee.api";

interface EmploymentDetailsFormProps {
  employee?: IEmployee;
  onClose: () => void;
}

export default function EmploymentDetailsForm({
  employee,
  onClose,
}: EmploymentDetailsFormProps) {
  // MUTATION TO UPDATE PROFILE
  const [updateEmploymentDetails, updateResult] = useMutation(
    UPDATE_EMPLOYMENT_DETAILS,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: GET_EMPLOYEE_BY_ID,
          variables: { id: Number(employee?.id) },
        },
      ],
    }
  );
  const handleSubmit = async (data: any) => {
    try {
      const result = await updateEmploymentDetails({
        variables: {
          updateEmploymentDetailsInput: {
            ...data,
            id: Number(employee?.employee?.id),
            joiningDate: dayjs(data.joiningDate),
          },
        },
        fetchPolicy: "no-cache",
      });

      if (result.data) {
        console.log(result);
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const defaultValues = {
    employeeId: employee?.employee?.employeeId || "",
    departmentId: employee?.employee?.departmentId || "",
    designationId: employee?.employee?.designationId || "",
    employmentStatusId: employee?.employee?.employmentStatusId || "",
    joiningDate: employee?.employee?.joiningDate
      ? dayjs(employee.joiningDate).format("DD-MM-YYYY")
      : "",
    workSiteId: employee?.employee?.workSiteId || "",
    workScheduleId: employee?.employee?.workScheduleId || "",
    nidNumber: employee?.employee?.nidNumber || "",
    salaryPerMonth: employee?.employee?.salaryPerMonth || "",
    workingDaysPerWeek: employee?.employee?.workingDaysPerWeek || "",
    workingHoursPerWeek: employee?.employee?.workingHoursPerWeek || "",
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
            <DepartmentSelect
              dataAuto="departmentId"
              name="departmentId"
              label="Department"
              placeholder="Select Department"
              required={false}
            />
            <DesignationSelect
              dataAuto="designationId"
              name="designationId"
              label="Designation"
              placeholder="Select Designation"
              required={false}
            />
            <EmploymentStatusSelect
              dataAuto="employmentStatusId"
              name="employmentStatusId"
              label="Employment Status"
              placeholder="Select Employment Status"
              required={false}
            />
            <WorkSiteSelect
              dataAuto="workSiteId"
              name="workSiteId"
              label="Work Site"
              placeholder="Select Work Site"
              required={false}
            />
            <WorkScheduleSelect
              dataAuto="workScheduleId"
              name="workScheduleId"
              label="Work Schedule"
              placeholder="Select Work Schedule"
              required={false}
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
          </div>
        </div>

        {/* Action Buttons */}
        <FormActionButton
          isPending={updateResult.loading}
          cancelHandler={onClose}
        />
      </div>
    </CustomForm>
  );
}
