"use client";

// ==================== IMPORTS ====================
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [assignSalary] = useMutation(ASSIGN_EMPLOYEE_SALARY);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddSalaryForm>({
    resolver: zodResolver(addSalarySchema),
    defaultValues: {
      salaryAmount: currentSalary?.salaryAmount?.toString() || "",
      salaryType: currentSalary?.salaryType || "MONTHLY",
      startDate: dayjs().format("DD-MM-YYYY"),
      reason: "",
      remarks: "",
    },
  });

  // ==================== HANDLERS ====================
  const onSubmit = async (data: IAddSalaryForm) => {
    setIsSubmitting(true);
    try {
      const { data: response, error } = await assignSalary({
        variables: {
          assignEmployeeSalaryInput: {
            userId,
            salaryAmount: Number(data.salaryAmount),
            salaryType: data.salaryType,
            startDate: dayjs.utc(data.startDate, "DD-MM-YYYY").toDate(),
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
    } finally {
      setIsSubmitting(false);
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("salaryAmount")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 50000"
            />
            {errors.salaryAmount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.salaryAmount.message}
              </p>
            )}
          </div>

          {/* SALARY TYPE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("salaryType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="HOURLY">Hourly</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          {/* START DATE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effective From <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("startDate")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="DD-MM-YYYY"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          {/* REASON */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              {...register("reason")}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Annual increment, Promotion, Performance bonus"
            />
          </div>

          {/* REMARKS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              {...register("remarks")}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Optional notes..."
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
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : currentSalary
                  ? "Update Salary"
                  : "Add Salary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
