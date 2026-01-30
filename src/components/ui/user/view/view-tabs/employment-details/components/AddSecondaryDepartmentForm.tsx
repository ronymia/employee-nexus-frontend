"use client";

// ==================== IMPORTS ====================
import { useMutation, useQuery } from "@apollo/client/react";
import { z } from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";

// ==================== CUSTOM FORM IMPORTS ====================
import CustomForm from "@/components/form/CustomForm";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";

// ==================== DAYJS CONFIG ====================
dayjs.extend(utc);

// ==================== GRAPHQL ====================
import { ASSIGN_EMPLOYEE_DEPARTMENT } from "@/graphql/employee-department.api";
import { GET_DEPARTMENTS } from "@/graphql/departments.api";
import { IDepartment } from "@/types";

// ==================== SCHEMA ====================
const addSecondaryDepartmentSchema = z.object({
  departmentId: z.string().min(1, "Please select a department"),
  roleInDept: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  remarks: z.string().optional(),
});

type IAddSecondaryDepartmentForm = z.infer<typeof addSecondaryDepartmentSchema>;

// ==================== INTERFACES ====================
interface IAddSecondaryDepartmentFormProps {
  userId: number;
  currentDepartmentIds: number[];
  onClose: () => void;
  onSuccess: () => void;
}

// ==================== COMPONENT ====================
export default function AddSecondaryDepartmentForm({
  userId,
  currentDepartmentIds,
  onClose,
  onSuccess,
}: IAddSecondaryDepartmentFormProps) {
  // ==================== QUERIES ====================
  const { data: departmentsData } = useQuery<{
    departments: { data: IDepartment[] };
  }>(GET_DEPARTMENTS);
  const departments = departmentsData?.departments?.data || [];

  const [assignDepartment, assignDepartmentState] = useMutation(
    ASSIGN_EMPLOYEE_DEPARTMENT,
  );

  const defaultValues = {
    departmentId: "",
    roleInDept: "",
    startDate: dayjs().format("DD-MM-YYYY"),
    remarks: "",
  };

  // ==================== HANDLERS ====================
  const onSubmit = async (data: IAddSecondaryDepartmentForm) => {
    try {
      const { data: response, error } = await assignDepartment({
        variables: {
          assignEmployeeDepartmentInput: {
            userId,
            departmentId: Number(data.departmentId),
            isPrimary: false, // Secondary department
            roleInDept: data.roleInDept,
            startDate: dayjs.utc(data.startDate, "DD-MM-YYYY").toDate(),
            remarks: data.remarks,
          },
        },
      });

      if (response) {
        toast.success("Secondary department assigned successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(error?.message || "Failed to assign department");
      }
    } catch (error: any) {
      console.error("Error assigning department:", error);
      toast.error(error.message || "Failed to assign department");
    }
  };

  const departmentOptions = departments
    .filter((dept: any) => !currentDepartmentIds.includes(dept.id))
    .map((dept: any) => ({
      label: dept.name,
      value: dept.id,
    }));

  // ==================== RENDER ====================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Secondary Department
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <CustomForm
          submitHandler={onSubmit}
          defaultValues={defaultValues}
          resolver={addSecondaryDepartmentSchema}
          className="p-6 space-y-4"
        >
          {/* INFO ALERT */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Assign employee to an additional department while keeping their
              existing departments active.
            </p>
          </div>

          {/* DEPARTMENT */}
          <div>
            <CustomSelect
              name="departmentId"
              label="Department"
              placeholder="Select department"
              required={true}
              dataAuto="department"
              options={departmentOptions}
              isLoading={false}
            />
          </div>

          {/* ROLE IN DEPARTMENT */}
          <div>
            <CustomInputField
              name="roleInDept"
              label="Role in Department"
              placeholder="e.g., Technical Advisor, Consultant, Member"
              required={true}
              type="text"
              dataAuto="role-in-dept"
            />
          </div>

          {/* START DATE */}
          <div>
            <CustomDatePicker
              name="startDate"
              label="Start Date"
              dataAuto="start-date"
              required={true}
              placeholder="DD-MM-YYYY"
            />
          </div>

          {/* REMARKS */}
          <div>
            <CustomTextareaField
              name="remarks"
              label="Remarks"
              placeholder="Optional notes..."
              rows={3}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={assignDepartmentState.loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assignDepartmentState.loading ? "Adding..." : "Add Department"}
            </button>
          </div>
        </CustomForm>
      </div>
    </div>
  );
}
