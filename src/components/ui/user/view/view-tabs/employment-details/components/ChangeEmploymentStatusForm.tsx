"use client";

// ==================== IMPORTS ====================
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
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
import { ASSIGN_EMPLOYEE_EMPLOYMENT_STATUS } from "@/graphql/employee-employment-status.api";

// ==================== TYPES ====================
import type { IEmployeeEmploymentStatus } from "@/types";
import { GET_EMPLOYMENT_STATUSES } from "@/graphql/employment-status.api";

// ==================== SCHEMA ====================
const changeStatusSchema = z.object({
  employmentStatusId: z.string().min(1, "Please select a status"),
  startDate: z.string().min(1, "Start date is required"),
  reason: z.string().optional(),
  remarks: z.string().optional(),
});

type IChangeStatusForm = z.infer<typeof changeStatusSchema>;

// ==================== INTERFACES ====================
interface IChangeEmploymentStatusFormProps {
  currentStatus?: IEmployeeEmploymentStatus;
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

// ==================== COMPONENT ====================
export default function ChangeEmploymentStatusForm({
  currentStatus,
  userId,
  onClose,
  onSuccess,
}: IChangeEmploymentStatusFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==================== QUERIES ====================
  const { data: statusesData } = useQuery<{
    employmentStatuses: { data: IEmployeeEmploymentStatus[] };
  }>(GET_EMPLOYMENT_STATUSES);
  const statuses = statusesData?.employmentStatuses?.data || [];

  const [assignStatus] = useMutation(ASSIGN_EMPLOYEE_EMPLOYMENT_STATUS);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChangeStatusForm>({
    resolver: zodResolver(changeStatusSchema),
    defaultValues: {
      employmentStatusId: "",
      startDate: dayjs().format("DD-MM-YYYY"),
      reason: "",
      remarks: "",
    },
  });

  // ==================== HANDLERS ====================
  const onSubmit = async (data: IChangeStatusForm) => {
    setIsSubmitting(true);
    try {
      const { data: response, error } = await assignStatus({
        variables: {
          assignEmployeeEmploymentStatusInput: {
            userId,
            employmentStatusId: Number(data.employmentStatusId),
            startDate: dayjs.utc(data.startDate, "DD-MM-YYYY").toDate(),
            reason: data.reason,
            remarks: data.remarks,
          },
        },
      });

      if (response) {
        toast.success("Employment status changed successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(error?.message || "Failed to change status");
      }
    } catch (error: any) {
      console.error("Error changing status:", error);
      toast.error(error.message || "Failed to change status");
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
            Change Employment Status
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
          {/* CURRENT STATUS */}
          {currentStatus && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Current Status:
              </p>
              <p className="text-lg font-semibold text-blue-700">
                {currentStatus.employmentStatus?.name || "N/A"}
              </p>
            </div>
          )}

          {/* NEW STATUS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register("employmentStatusId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select status</option>
              {statuses
                .filter(
                  (status: any) =>
                    status.id !== currentStatus?.employmentStatusId,
                )
                .map((status: any) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
            </select>
            {errors.employmentStatusId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.employmentStatusId.message}
              </p>
            )}
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
              placeholder="e.g., Contract Completion, Permanent Position"
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
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Changing..." : "Change Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
