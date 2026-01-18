"use client";

// ==================== IMPORTS ====================
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";

// ==================== GRAPHQL ====================
import { UPDATE_EMPLOYEE_DEPARTMENT } from "@/graphql/employee-department.api";

// ==================== TYPES ====================
import type { IEmployeeDepartment } from "@/types";

// ==================== SCHEMA ====================
const editDepartmentSchema = z.object({
  roleInDept: z.string().min(1, "Role is required"),
  isPrimary: z.boolean(),
  remarks: z.string().optional(),
});

type IEditDepartmentForm = z.infer<typeof editDepartmentSchema>;

// ==================== INTERFACES ====================
interface IEditDepartmentFormProps {
  department: IEmployeeDepartment;
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

// ==================== COMPONENT ====================
export default function EditDepartmentForm({
  department,
  userId,
  onClose,
  onSuccess,
}: IEditDepartmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateDepartment] = useMutation(UPDATE_EMPLOYEE_DEPARTMENT);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IEditDepartmentForm>({
    resolver: zodResolver(editDepartmentSchema),
    defaultValues: {
      roleInDept: department.roleInDept || "",
      isPrimary: department.isPrimary || false,
      remarks: department.remarks || "",
    },
  });

  // ==================== HANDLERS ====================
  const onSubmit = async (data: IEditDepartmentForm) => {
    setIsSubmitting(true);
    try {
      const { data: response, error } = await updateDepartment({
        variables: {
          updateEmployeeDepartmentInput: {
            userId,
            departmentId: department.departmentId,
            roleInDept: data.roleInDept,
            isPrimary: data.isPrimary,
            remarks: data.remarks,
          },
        },
      });

      if (response) {
        toast.success("Department updated successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(error?.message || "Failed to update department");
      }
    } catch (error: any) {
      console.error("Error updating department:", error);
      toast.error(error.message || "Failed to update department");
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
            Edit Department
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
          {/* DEPARTMENT NAME (READ ONLY) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={department.department?.name || ""}
              disabled
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* ROLE IN DEPARTMENT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role in Department <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("roleInDept")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Team Lead, Manager, Member"
            />
            {errors.roleInDept && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roleInDept.message}
              </p>
            )}
          </div>

          {/* PRIMARY DEPARTMENT */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrimary"
              {...register("isPrimary")}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label
              htmlFor="isPrimary"
              className="text-sm font-medium text-gray-700"
            >
              Set as Primary Department
            </label>
          </div>

          {/* REMARKS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              {...register("remarks")}
              rows={3}
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
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
