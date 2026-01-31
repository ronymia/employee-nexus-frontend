"use client";

// ==================== IMPORTS ====================
import { useMutation } from "@apollo/client/react";
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
import { ASSIGN_EMPLOYEE_SALARY } from "@/graphql/employee-salary.api";

// ==================== TYPES ====================
import type { IEmployeeSalary } from "@/types";

// ==================== SCHEMA ====================
const addSalarySchema = z.object({
  salaryAmount: z.string().min(1, "Salary amount is required"),
  salaryType: z.enum(["HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  startDate: z.string().min(1, "Start date is required"),
  reason: z.string().optional(),
  remarks: z.string().optional(),
});

type IAddSalaryForm = z.infer<typeof addSalarySchema>;

// ==================== INTERFACES ====================
interface IAddSalaryFormProps {
  currentSalary?: IEmployeeSalary;
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

// ==================== COMPONENT ====================
export default function AddSalaryForm({
  currentSalary,
  userId,
  onClose,
  onSuccess,
}: IAddSalaryFormProps) {
  const [assignSalary, assignSalaryState] = useMutation(ASSIGN_EMPLOYEE_SALARY);

  const defaultValues = {
    salaryAmount: currentSalary?.salaryAmount?.toString() || "",
    salaryType: currentSalary?.salaryType || "MONTHLY",
    startDate: dayjs().format("DD-MM-YYYY"),
    reason: "",
    remarks: "",
  };

  // ==================== HANDLERS ====================
  const onSubmit = async (data: IAddSalaryForm) => {
    try {
      const { data: response, error } = await assignSalary({
        variables: {
          createEmployeeSalaryInput: {
            userId,
            salaryAmount: Number(data.salaryAmount),
            salaryType: data.salaryType,
            startDate: dayjs.utc(data.startDate, "DD-MM-YYYY").toISOString(),
            reason: data.reason,
            remarks: data.remarks,
          },
        },
      });

      if (response) {
        toast.success(
          currentSalary
            ? "Salary updated successfully"
            : "Salary assigned successfully",
        );
        onSuccess();
        onClose();
      } else {
        toast.error(error?.message || "Failed to update salary");
      }
    } catch (error: any) {
      console.error("Error updating salary:", error);
      toast.error(error.message || "Failed to update salary");
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentSalary ? "Update Salary" : "Add Salary"}
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
          resolver={addSalarySchema}
          className="p-6 space-y-4"
        >
          {/* CURRENT SALARY INFO */}
          {currentSalary && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                Current: {currentSalary.salaryAmount.toLocaleString()} BDT (
                {currentSalary.salaryType})
              </p>
            </div>
          )}

          {/* SALARY AMOUNT */}
          <div>
            <CustomInputField
              name="salaryAmount"
              label="Salary Amount"
              placeholder="e.g., 50000"
              required={true}
              type="number"
              dataAuto="salary-amount"
            />
          </div>

          {/* SALARY TYPE */}
          <div>
            <CustomSelect
              name="salaryType"
              label="Salary Type"
              placeholder="Select Salary Type"
              required={true}
              dataAuto="salary-type"
              options={[
                { label: "Hourly", value: "HOURLY" },
                { label: "Daily", value: "DAILY" },
                { label: "Weekly", value: "WEEKLY" },
                { label: "Monthly", value: "MONTHLY" },
                { label: "Yearly", value: "YEARLY" },
              ]}
              isLoading={false}
            />
          </div>

          {/* START DATE */}
          <div>
            <CustomDatePicker
              name="startDate"
              label="Effective From"
              dataAuto="effective-from-date"
              required={true}
              placeholder="DD-MM-YYYY"
            />
          </div>

          {/* REASON */}
          <div>
            <CustomTextareaField
              name="reason"
              label="Reason"
              placeholder="e.g., Annual increment, Promotion, Performance bonus"
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
              disabled={assignSalaryState.loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assignSalaryState.loading
                ? "Saving..."
                : currentSalary
                  ? "Update Salary"
                  : "Add Salary"}
            </button>
          </div>
        </CustomForm>
      </div>
    </div>
  );
}
