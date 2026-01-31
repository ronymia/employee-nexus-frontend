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
import {
  ASSIGN_EMPLOYEE_DEPARTMENT,
  UPDATE_EMPLOYEE_DEPARTMENT,
} from "@/graphql/employee-department.api";

// ==================== TYPES ====================
import type { IDepartment, IEmployeeDepartment } from "@/types";
import { GET_DEPARTMENTS } from "@/graphql/departments.api";

// ==================== SCHEMA ====================
const transferDepartmentSchema = z.object({
  newDepartmentId: z.string().min(1, "Please select a department"),
  roleInDept: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  reason: z.string().optional(),
  remarks: z.string().optional(),
});

type ITransferDepartmentForm = z.infer<typeof transferDepartmentSchema>;

// ==================== INTERFACES ====================
interface ITransferDepartmentFormProps {
  currentDepartment: IEmployeeDepartment;
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

// ==================== COMPONENT ====================
export default function TransferDepartmentForm({
  currentDepartment,
  userId,
  onClose,
  onSuccess,
}: ITransferDepartmentFormProps) {
  // ==================== QUERIES ====================
  const { data: departmentsData } = useQuery<{
    departments: { data: IDepartment[] };
  }>(GET_DEPARTMENTS);
  const departments = departmentsData?.departments?.data || [];

  const [updateDepartment, updateDepartmentState] = useMutation(
    UPDATE_EMPLOYEE_DEPARTMENT,
  );
  const [assignDepartment, assignDepartmentState] = useMutation(
    ASSIGN_EMPLOYEE_DEPARTMENT,
  );

  const defaultValues = {
    newDepartmentId: "",
    roleInDept: currentDepartment.roleInDept || "",
    startDate: dayjs().format("DD-MM-YYYY"),
    reason: "",
    remarks: "",
  };

  // ==================== HANDLERS ====================
  const onSubmit = async (data: ITransferDepartmentForm) => {
    try {
      // Step 1: End-date current department
      const endDate = dayjs
        .utc(data.startDate, "DD-MM-YYYY")
        .subtract(1, "day")
        .toDate();

      await updateDepartment({
        variables: {
          updateEmployeeDepartmentInput: {
            userId,
            departmentId: currentDepartment.departmentId,
            endDate,
            isActive: false,
            remarks: `Transferred to new department. Reason: ${data.reason || "N/A"}`,
          },
        },
      });

      // Step 2: Assign new department as primary
      const { data: response, error } = await assignDepartment({
        variables: {
          assignEmployeeDepartmentInput: {
            userId,
            departmentId: Number(data.newDepartmentId),
            isPrimary: true,
            roleInDept: data.roleInDept,
            startDate: dayjs.utc(data.startDate, "DD-MM-YYYY").toDate(),
            remarks: data.remarks,
          },
        },
      });

      if (response) {
        toast.success("Department transfer completed successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(error?.message || "Failed to transfer department");
      }
    } catch (error: any) {
      console.error("Error transferring department:", error);
      toast.error(error.message || "Failed to transfer department");
    }
  };

  const departmentOptions = departments
    .filter((dept: any) => dept.id !== currentDepartment.departmentId)
    .map((dept: any) => ({
      label: dept.name,
      value: dept.id,
    }));

  const isSubmitting =
    updateDepartmentState.loading || assignDepartmentState.loading;

  // ==================== RENDER ====================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            Transfer Department
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
          resolver={transferDepartmentSchema}
          className="p-6 space-y-4"
        >
          {/* CURRENT DEPARTMENT (READ ONLY) */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm font-medium text-orange-900 mb-1">
              Transferring From:
            </p>
            <p className="text-lg font-semibold text-orange-700">
              {currentDepartment.department?.name || "N/A"}
            </p>
            <p className="text-sm text-orange-600 mt-1">
              Role: {currentDepartment.roleInDept || "N/A"}
            </p>
          </div>

          {/* NEW DEPARTMENT */}
          <div>
            <CustomSelect
              name="newDepartmentId"
              label="Transfer To Department"
              placeholder="Select department"
              required={true}
              dataAuto="new-department"
              options={departmentOptions}
              isLoading={false}
            />
          </div>

          {/* ROLE IN NEW DEPARTMENT */}
          <div>
            <CustomInputField
              name="roleInDept"
              label="Role in New Department"
              placeholder="e.g., Team Lead, Manager, Member"
              required={true}
              type="text"
              dataAuto="role-in-dept"
            />
          </div>

          {/* START DATE */}
          <div>
            <CustomDatePicker
              name="startDate"
              label="Transfer Date"
              dataAuto="transfer-date"
              required={true}
              placeholder="DD-MM-YYYY"
            />
          </div>

          {/* REASON */}
          <div>
            <CustomTextareaField
              name="reason"
              label="Reason for Transfer"
              placeholder="e.g., Promotion, Restructuring, Employee Request"
              rows={2}
            />
          </div>

          {/* REMARKS */}
          <div>
            <CustomTextareaField
              name="remarks"
              label="Remarks"
              placeholder="Optional notes..."
              rows={2}
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
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Transferring..." : "Transfer Department"}
            </button>
          </div>
        </CustomForm>
      </div>
    </div>
  );
}
