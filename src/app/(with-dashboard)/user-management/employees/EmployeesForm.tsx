"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import {
  CREATE_EMPLOYEE,
  GET_EMPLOYEES,
  UPDATE_EMPLOYEE,
} from "@/graphql/employee.api";
import { IEmployeeFormData, employeeSchema } from "@/schemas";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import {
  DepartmentSelect,
  DesignationSelect,
  EmploymentStatusSelect,
  WorkSiteSelect,
  WorkScheduleSelect,
  GenderRadio,
  MaritalStatusRadio,
  RoleSelect,
  RelationSelect,
} from "@/components/input-fields";

export default function EmployeesForm({ data }: { data?: IEmployeeFormData }) {
  const router = useRouter();

  const [createEmployee, createResult] = useMutation(CREATE_EMPLOYEE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });

  const [updateEmployee, updateResult] = useMutation(UPDATE_EMPLOYEE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });

  const handleOnSubmit = async (formValues: IEmployeeFormData) => {
    // Convert string values to numbers for GraphQL mutation
    formValues["user"]["roleId"] = Number(formValues["user"]["roleId"]);

    // Set default password for new employees
    if (!data?.id) {
      formValues["user"]["password"] = "12345678@We";
    }

    // Convert all ID fields to numbers
    if (formValues["departmentId"]) {
      formValues["departmentId"] = Number(formValues["departmentId"]);
    }
    if (formValues["designationId"]) {
      formValues["designationId"] = Number(formValues["designationId"]);
    }
    if (formValues["employmentStatusId"]) {
      formValues["employmentStatusId"] = Number(
        formValues["employmentStatusId"]
      );
    }
    if (formValues["workSiteId"]) {
      formValues["workSiteId"] = Number(formValues["workSiteId"]);
    }
    if (formValues["workScheduleId"]) {
      formValues["workScheduleId"] = Number(formValues["workScheduleId"]);
    }
    if (formValues["salaryPerMonth"]) {
      formValues["salaryPerMonth"] = Number(formValues["salaryPerMonth"]);
    }
    if (formValues["workingDaysPerWeek"]) {
      formValues["workingDaysPerWeek"] = Number(
        formValues["workingDaysPerWeek"]
      );
    }
    if (formValues["workingHoursPerWeek"]) {
      formValues["workingHoursPerWeek"] = Number(
        formValues["workingHoursPerWeek"]
      );
    }
    console.log({ formValues });
    try {
      if (data?.id) {
        await updateEmployee({
          variables: {
            updateEmployeeInput: formValues,
          },
        }).then(() => {
          router.push("/user-management/employees");
        });
      } else {
        await createEmployee({
          variables: {
            createEmployeeInput: formValues,
          },
        }).then(() => {
          router.push("/user-management/employees");
        });
      }
    } catch (error) {
      console.error("Error submitting employee:", error);
    }
  };

  console.log({ data });

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      resolver={employeeSchema}
      defaultValues={data || {}}
      className="flex flex-col gap-y-4 p-6"
    >
      {/* PERSONAL INFORMATION */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CustomInputField
            name="profile.fullName"
            label="Full Name"
            required
          />
          <CustomInputField name="user.email" label="Email" required />
          <CustomInputField name="profile.phone" label="Phone" required />
          <CustomDatePicker
            name="profile.dateOfBirth"
            label="Date of Birth"
            dataAuto="dateOfBirth"
            required={true}
          />
          <GenderRadio name="profile.gender" required={true} />
          <MaritalStatusRadio name="profile.maritalStatus" required={true} />
        </div>
      </div>

      {/* ADDRESS INFORMATION */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2 lg:col-span-3">
            <CustomInputField
              name="profile.address"
              label="Street Address"
              required
            />
          </div>
          <CustomInputField name="profile.city" label="City" required />
          <CustomInputField name="profile.country" label="Country" required />
          <CustomInputField name="profile.postcode" label="Postcode" required />
        </div>
      </div>

      {/* EMERGENCY CONTACT */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CustomInputField
            name="emergencyContact.name"
            label="Contact Name"
            required
          />
          <CustomInputField
            name="emergencyContact.phone"
            label="Contact Phone"
            required
          />
          <RelationSelect
            name="emergencyContact.relation"
            label="Relation"
            required
          />
        </div>
      </div>

      {/* EMPLOYMENT DETAILS */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RoleSelect name="user.roleId" label="Role" required />
          <DepartmentSelect name="departmentId" required={true} />
          <DesignationSelect name="designationId" required={true} />
          <EmploymentStatusSelect name="employmentStatusId" required={true} />
          <CustomInputField name="employeeId" label="Employee ID" />
          <CustomDatePicker
            name="joiningDate"
            label="Joining Date"
            dataAuto="joiningDate"
            required={true}
          />
          <WorkSiteSelect name="workSiteId" required={true} />
          <WorkScheduleSelect name="workScheduleId" required={true} />
          <CustomInputField name="nidNumber" label="NID Number" required />
        </div>
      </div>

      {/* COMPENSATION & WORK SCHEDULE */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Compensation & Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CustomInputField
            name="salaryPerMonth"
            label="Monthly Salary"
            type="number"
            required
          />
          <CustomInputField
            name="workingDaysPerWeek"
            label="Working Days per Week"
            type="number"
            required
          />
          <CustomInputField
            name="workingHoursPerWeek"
            label="Working Hours per Week"
            type="number"
            required
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <FormActionButton
        cancelHandler={() => router.push("/user-management/employees")}
        isPending={createResult.loading || updateResult.loading}
      />
    </CustomForm>
  );
}
