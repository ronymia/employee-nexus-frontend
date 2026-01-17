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
import { IUser } from "@/types";
import dayjs from "dayjs";
import { UPDATE_EMPLOYMENT_DETAILS } from "@/graphql/profile.api";
import { useMutation } from "@apollo/client/react";
import { GET_EMPLOYEE_BY_ID } from "@/graphql/employee.api";
import { showToast } from "@/components/ui/CustomToast";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

interface IEmploymentDetailsFormProps {
  employee?: IUser;
  onClose: () => void;
}

export default function EmploymentDetailsForm({
  employee,
  onClose,
}: IEmploymentDetailsFormProps) {
  // ==================== GRAPHQL MUTATIONS ====================
  // UPDATE EMPLOYMENT DETAILS MUTATION
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

  // ==================== FORM SUBMISSION ====================
  const handleSubmit = async (data: any) => {
    try {
      // PREPARE EMPLOYMENT DETAILS DATA
      const employmentDetailsInput = {
        ...data,
        userId: Number(employee?.employee?.userId),
        joiningDate: dayjs.utc(data.joiningDate, "DD-MM-YYYY").toDate(),
      };

      // EXECUTE UPDATE MUTATION
      const result = await updateEmploymentDetails({
        variables: {
          updateEmploymentDetailsInput: employmentDetailsInput,
        },
        fetchPolicy: "no-cache",
      });

      // HANDLE SUCCESS
      if (result.data) {
        showToast.success(
          "Updated!",
          "Employment details have been updated successfully"
        );
        onClose();
      }
    } catch (error: any) {
      // HANDLE ERROR
      console.error("Error updating employment details:", error);
      showToast.error(
        "Error",
        error.message || "Failed to update employment details"
      );
      throw error;
    }
  };

  // ==================== DEFAULT VALUES ====================
  const defaultValues = {
    // BASIC EMPLOYMENT INFO
    employeeId: employee?.employee?.employeeId || "",
    joiningDate: employee?.employee?.joiningDate
      ? dayjs(employee.employee.joiningDate).format("DD-MM-YYYY")
      : "",
    nidNumber: employee?.employee?.nidNumber || "",

    // ORGANIZATIONAL STRUCTURE
    departmentId: employee?.employee?.department?.id || "",
    designationId: employee?.employee?.designation?.id || "",
    employmentStatusId: employee?.employee?.employmentStatus?.id || "",

    // WORK LOCATION AND SCHEDULE
    workSiteIds:
      employee?.employee?.workSites?.map((site) => Number(site.id)) || [],
    workScheduleId: employee?.employee?.workSchedule?.id || "",
  };

  // ==================== RENDER ====================
  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <div className="space-y-4">
        {/* EMPLOYMENT INFORMATION SECTION */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Employment Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EMPLOYEE ID */}
            <CustomInputField
              dataAuto="employeeId"
              name="employeeId"
              type="text"
              label="Employee ID"
              placeholder="Enter employee ID"
              required={false}
            />

            {/* JOINING DATE */}
            <CustomDatePicker
              dataAuto="joiningDate"
              name="joiningDate"
              label="Joining Date"
              required={false}
              formatDate="DD-MM-YYYY"
            />

            {/* DEPARTMENT */}
            <DepartmentSelect
              dataAuto="departmentId"
              name="departmentId"
              label="Department"
              placeholder="Select Department"
              required={false}
            />

            {/* DESIGNATION */}
            <DesignationSelect
              dataAuto="designationId"
              name="designationId"
              label="Designation"
              placeholder="Select Designation"
              required={false}
            />

            {/* EMPLOYMENT STATUS */}
            <EmploymentStatusSelect
              dataAuto="employmentStatusId"
              name="employmentStatusId"
              label="Employment Status"
              placeholder="Select Employment Status"
              required={false}
            />

            {/* WORK SITES */}
            <WorkSiteSelect
              dataAuto="workSiteId"
              name="workSiteIds"
              label="Work Sites"
              placeholder="Select Work Site"
              required={false}
              multipleSelect
            />

            {/* WORK SCHEDULE */}
            <WorkScheduleSelect
              dataAuto="workScheduleId"
              name="workScheduleId"
              label="Work Schedule"
              placeholder="Select Work Schedule"
              required={false}
            />

            {/* NID NUMBER */}
            <CustomInputField
              dataAuto="nidNumber"
              name="nidNumber"
              type="text"
              label="NID Number"
              placeholder="Enter NID number"
              required={false}
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <FormActionButton
          isPending={updateResult.loading}
          cancelHandler={onClose}
        />
      </div>
    </CustomForm>
  );
}
