"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomRadioButton from "@/components/form/input/CustomRadioButton";
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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function EmployeesForm({ data }: { data?: IEmployeeFormData }) {
  // ==================== INITIALIZE ROUTER ====================
  const router = useRouter();

  // ==================== GRAPHQL MUTATION: CREATE EMPLOYEE ====================
  const [createEmployee, createResult] = useMutation(CREATE_EMPLOYEE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_EMPLOYEES, variables: { query: {} } }],
  });

  // ==================== GRAPHQL MUTATION: UPDATE EMPLOYEE ====================
  const [updateEmployee, updateResult] = useMutation(UPDATE_EMPLOYEE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_EMPLOYEES, variables: { query: {} } }],
  });

  console.log({ data });

  // ==================== FORM SUBMISSION HANDLER ====================
  const handleOnSubmit = async (formValues: IEmployeeFormData) => {
    // CONVERT USER ROLE ID TO NUMBER
    formValues["user"]["roleId"] = Number(formValues["user"]["roleId"]);

    // SET DEFAULT PASSWORD FOR NEW EMPLOYEES
    if (!data?.id) {
      formValues["user"]["password"] = "12345678@We";
    }

    // CONVERT SALARY TO NUMBER
    if (formValues["salaryAmount"]) {
      formValues["salaryAmount"] = Number(formValues["salaryAmount"]);
    }

    // TRY TO SUBMIT EMPLOYEE DATA
    try {
      // UPDATE EXISTING EMPLOYEE
      if (data?.id) {
        await updateEmployee({
          variables: {
            updateEmployeeInput: {
              ...formValues,
              // CONVERT JOINING DATE FROM DD-MM-YYYY TO DATETIME
              joiningDate: dayjs(
                formValues["joiningDate"],
                "DD-MM-YYYY"
              ).toDate(),
              // CONVERT SALARY START DATE FROM DD-MM-YYYY TO DATETIME
              salaryStartDate: formValues["salaryStartDate"]
                ? dayjs(formValues["salaryStartDate"], "DD-MM-YYYY").toDate()
                : null,
              profile: {
                ...formValues["profile"],
                // CONVERT DATE OF BIRTH FROM DD-MM-YYYY TO DATETIME
                dateOfBirth: dayjs(
                  formValues["profile"]["dateOfBirth"],
                  "DD-MM-YYYY"
                ).toDate(),
              },
            },
          },
        }).then(() => {
          // REDIRECT TO EMPLOYEE LIST AFTER SUCCESSFUL UPDATE
          router.push("/user-management/employees");
        });
      } else {
        // CREATE NEW EMPLOYEE
        console.log({
          joiningDate: formValues["joiningDate"],
        });

        const createdEmployee = await createEmployee({
          variables: {
            createEmployeeInput: {
              ...formValues,
              // CONVERT JOINING DATE FROM DD-MM-YYYY TO DATETIME
              joiningDate: dayjs(
                formValues["joiningDate"],
                "DD-MM-YYYY"
              ).toDate(),
              // CONVERT SALARY START DATE FROM DD-MM-YYYY TO DATETIME
              salaryStartDate: formValues["salaryStartDate"]
                ? dayjs(formValues["salaryStartDate"], "DD-MM-YYYY").toDate()
                : null,
              profile: {
                ...formValues["profile"],
                // CONVERT DATE OF BIRTH FROM DD-MM-YYYY TO DATETIME
                dateOfBirth: dayjs(
                  formValues["profile"]["dateOfBirth"],
                  "DD-MM-YYYY"
                ).toDate(),
              },
            },
          },
        });

        // REDIRECT TO EMPLOYEE LIST AFTER SUCCESSFUL CREATION
        if (createdEmployee.data) {
          router.push("/user-management/employees");
        }
      }
    } catch (error) {
      // LOG AND RE-THROW ERROR FOR FORM HANDLING
      console.error("Error submitting employee:", error);
      throw error;
    }
  };

  // console.log({ data });

  return (
    <CustomForm
      submitHandler={handleOnSubmit}
      resolver={employeeSchema}
      defaultValues={data || {}}
      className="flex flex-col gap-y-5 md:gap-y-6 md:p-6 p-3 max-w-7xl mx-auto"
    >
      {/* ==================== SECTION: PERSONAL INFORMATION ==================== */}
      <div className="bg-linear-to-br from-white to-gray-50 border-2 border-primary/20 rounded-xl md:p-6 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-5 text-primary border-b-2 border-primary/30 pb-3 flex items-center gap-2">
          <span className="hidden sm:inline">👤</span>
          <span>Personal Information</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {/* FULL NAME INPUT */}
          <CustomInputField
            name="profile.fullName"
            label="Full Name"
            required
          />

          {/* EMAIL INPUT */}
          <CustomInputField name="user.email" label="Email" required />

          {/* PHONE INPUT */}
          <CustomInputField name="profile.phone" label="Phone" required />

          {/* DATE OF BIRTH PICKER */}
          <CustomDatePicker
            name="profile.dateOfBirth"
            label="Date of Birth"
            dataAuto="dateOfBirth"
            required={true}
          />

          {/* GENDER RADIO SELECTION */}
          <GenderRadio name="profile.gender" required={true} />

          {/* MARITAL STATUS RADIO SELECTION */}
          <MaritalStatusRadio name="profile.maritalStatus" required={true} />
        </div>
      </div>

      {/* ==================== SECTION: ADDRESS INFORMATION ==================== */}
      <div className="bg-linear-to-br from-white to-blue-50/30 border-2 border-blue-200/50 rounded-xl md:p-6 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-5 text-blue-700 border-b-2 border-blue-300/50 pb-3 flex items-center gap-2">
          <span className="hidden sm:inline">📍</span>
          <span>Address Information</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {/* STREET ADDRESS - FULL WIDTH */}
          <div className="sm:col-span-2 lg:col-span-3">
            <CustomInputField
              name="profile.address"
              label="Street Address"
              required
            />
          </div>

          {/* CITY INPUT */}
          <CustomInputField name="profile.city" label="City" required />

          {/* COUNTRY INPUT */}
          <CustomInputField name="profile.country" label="Country" required />

          {/* POSTCODE INPUT */}
          <CustomInputField name="profile.postcode" label="Postcode" required />
        </div>
      </div>

      {/* ==================== SECTION: EMERGENCY CONTACT ==================== */}
      <div className="bg-linear-to-br from-white to-red-50/30 border-2 border-red-200/50 rounded-xl md:p-6 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-5 text-red-700 border-b-2 border-red-300/50 pb-3 flex items-center gap-2">
          <span className="hidden sm:inline">🚨</span>
          <span>Emergency Contact</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {/* EMERGENCY CONTACT NAME */}
          <CustomInputField
            name="emergencyContact.name"
            label="Contact Name"
            required
          />

          {/* EMERGENCY CONTACT PHONE */}
          <CustomInputField
            name="emergencyContact.phone"
            label="Contact Phone"
            required
          />

          {/* EMERGENCY CONTACT RELATION */}
          <RelationSelect
            name="emergencyContact.relation"
            label="Relation"
            required
          />
        </div>
      </div>

      {/* ==================== SECTION: EMPLOYMENT DETAILS ==================== */}
      <div className="bg-linear-to-br from-white to-green-50/30 border-2 border-green-200/50 rounded-xl md:p-6 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-5 text-green-700 border-b-2 border-green-300/50 pb-3 flex items-center gap-2">
          <span className="hidden sm:inline">💼</span>
          <span>Employment Details</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {/* USER ROLE SELECTION */}
          <RoleSelect name="user.roleId" label="Role" required />

          {/* DEPARTMENT SELECTION */}
          <DepartmentSelect name="departmentId" required={true} />

          {/* DESIGNATION SELECTION */}
          <DesignationSelect name="designationId" required={true} />

          {/* EMPLOYMENT STATUS SELECTION */}
          <EmploymentStatusSelect name="employmentStatusId" required={true} />

          {/* EMPLOYEE ID INPUT */}
          <CustomInputField name="employeeId" label="Employee ID" />

          {/* JOINING DATE PICKER */}
          <CustomDatePicker
            name="joiningDate"
            label="Joining Date"
            dataAuto="joiningDate"
            required={true}
          />

          {/* WORK SITE SELECTION */}
          <WorkSiteSelect name="workSiteIds" required={true} multipleSelect />

          {/* WORK SCHEDULE SELECTION */}
          <WorkScheduleSelect name="workScheduleId" required={true} />

          {/* NATIONAL ID NUMBER INPUT */}
          <CustomInputField name="nidNumber" label="NID Number" required />
        </div>
      </div>

      {/* ==================== SECTION: COMPENSATION & SCHEDULE ==================== */}
      <div className="bg-linear-to-br from-white to-purple-50/30 border-2 border-purple-200/50 rounded-xl md:p-6 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-5 text-purple-700 border-b-2 border-purple-300/50 pb-3 flex items-center gap-2">
          <span className="hidden sm:inline">💰</span>
          <span>Compensation & Schedule</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {/* SALARY TYPE RADIO */}
          <div className="sm:col-span-2 lg:col-span-3">
            <CustomRadioButton
              name="salaryType"
              label="Salary Type"
              required
              dataAuto="salary-type-radio"
              radioGroupClassName="grid-cols-3"
              options={[
                { title: "Hourly", value: "HOURLY" },
                { title: "Daily", value: "DAILY" },
                { title: "Monthly", value: "MONTHLY" },
              ]}
            />
          </div>

          {/* SALARY AMOUNT INPUT */}
          <CustomInputField
            name="salaryAmount"
            label="Salary Amount"
            type="number"
            required
          />

          {/* SALARY START DATE */}
          <CustomDatePicker
            name="salaryStartDate"
            label="Salary Start Date"
            dataAuto="salaryStartDate"
            required={false}
          />
        </div>
      </div>

      {/* ==================== ACTION BUTTONS ==================== */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t-2 border-gray-200 pt-4 -mx-3 px-3 md:mx-0 md:px-0 md:border-0 md:bg-transparent md:backdrop-blur-none">
        <FormActionButton
          cancelHandler={() => router.push("/user-management/employees")}
          isPending={createResult.loading || updateResult.loading}
        />
      </div>
    </CustomForm>
  );
}
