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
import { ASSIGN_EMPLOYEE_DESIGNATION } from "@/graphql/employee-designation.api";

// ==================== TYPES ====================
import type { IDesignation, IEmployeeDesignation } from "@/types";
import { GET_DESIGNATIONS } from "@/graphql/designation.api";

// ==================== SCHEMA ====================
const changeDesignationSchema = z.object({
  designationId: z.string().min(1, "Please select a designation"),
  startDate: z.string().min(1, "Start date is required"),
  reason: z.string().optional(),
  remarks: z.string().optional(),
});

type IChangeDesignationForm = z.infer<typeof changeDesignationSchema>;

// ==================== INTERFACES ====================
interface IChangeDesignationFormProps {
  currentDesignation?: IEmployeeDesignation;
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

// ==================== COMPONENT ====================
export default function ChangeDesignationForm({
  currentDesignation,
  userId,
  onClose,
  onSuccess,
}: IChangeDesignationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==================== QUERIES ====================
  const { data: designationsData } = useQuery<{
    designations: { data: IDesignation[] };
  }>(GET_DESIGNATIONS);
  const designations = designationsData?.designations?.data || [];

  const [assignDesignation] = useMutation(ASSIGN_EMPLOYEE_DESIGNATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChangeDesignationForm>({
    resolver: zodResolver(changeDesignationSchema),
    defaultValues: {
      designationId: "",
      startDate: dayjs().format("DD-MM-YYYY"),
      reason: "",
      remarks: "",
    },
  });

  // ==================== HANDLERS ====================
  const onSubmit = async (data: IChangeDesignationForm) => {
    setIsSubmitting(true);
    try {
      const { data: response, error } = await assignDesignation({
        variables: {
          assignEmployeeDesignationInput: {
            userId,
            designationId: Number(data.designationId),
            startDate: dayjs.utc(data.startDate, "DD-MM-YYYY").toDate(),
            remarks: data.remarks,
          },
        },
      });

      if (response) {
        toast.success("Designation changed successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(error?.message || "Failed to change designation");
      }
    } catch (error: any) {
      console.error("Error changing designation:", error);
      toast.error(error.message || "Failed to change designation");
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
            Change Designation
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
          {/* CURRENT DESIGNATION */}
          {currentDesignation && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm font-medium text-orange-900 mb-1">
                Current Designation:
              </p>
              <p className="text-lg font-semibold text-orange-700">
                {currentDesignation.designation?.name || "N/A"}
              </p>
            </div>
          )}

          {/* NEW DESIGNATION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Designation <span className="text-red-500">*</span>
            </label>
            <select
              {...register("designationId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select designation</option>
              {designations
                .filter(
                  (desig: any) =>
                    desig.id !== currentDesignation?.designationId,
                )
                .map((desig: any) => (
                  <option key={desig.id} value={desig.id}>
                    {desig.name}
                  </option>
                ))}
            </select>
            {errors.designationId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.designationId.message}
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
              placeholder="e.g., Promotion, Internal Transfer"
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
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Changing..." : "Change Designation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
