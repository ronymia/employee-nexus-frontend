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
import { ASSIGN_EMPLOYEE_WORK_SCHEDULE } from "@/graphql/employee-work-schedule.api";
import { GET_WORK_SCHEDULES } from "@/graphql/work-schedules.api";

// ==================== TYPES ====================
import type { IEmployeeWorkSchedule, IWorkSchedule } from "@/types";

// ==================== SCHEMA ====================
const assignScheduleSchema = z.object({
  workScheduleId: z.string().min(1, "Please select a schedule"),
  startDate: z.string().min(1, "Start date is required"),
  notes: z.string().optional(),
});

type IAssignScheduleForm = z.infer<typeof assignScheduleSchema>;

// ==================== INTERFACES ====================
interface IAssignWorkScheduleFormProps {
  currentSchedule?: IEmployeeWorkSchedule;
  userId: number;
  assignedBy: number;
  onClose: () => void;
  onSuccess: () => void;
}

// ==================== COMPONENT ====================
export default function AssignWorkScheduleForm({
  currentSchedule,
  userId,
  assignedBy,
  onClose,
  onSuccess,
}: IAssignWorkScheduleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==================== QUERIES ====================
  const { data: schedulesData } = useQuery<{
    workSchedules: { data: IWorkSchedule[] };
  }>(GET_WORK_SCHEDULES);
  const schedules = schedulesData?.workSchedules?.data || [];

  const [assignSchedule] = useMutation(ASSIGN_EMPLOYEE_WORK_SCHEDULE);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAssignScheduleForm>({
    resolver: zodResolver(assignScheduleSchema),
    defaultValues: {
      workScheduleId: "",
      startDate: dayjs().format("DD-MM-YYYY"),
      notes: "",
    },
  });

  // ==================== HANDLERS ====================
  const onSubmit = async (data: IAssignScheduleForm) => {
    setIsSubmitting(true);
    try {
      const { data: response, error } = await assignSchedule({
        variables: {
          assignEmployeeWorkScheduleInput: {
            userId,
            workScheduleId: Number(data.workScheduleId),
            startDate: dayjs.utc(data.startDate, "DD-MM-YYYY").toDate(),
            assignedBy,
            notes: data.notes,
          },
        },
      });

      if (response) {
        toast.success("Work schedule assigned successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(error?.message || "Failed to assign schedule");
      }
    } catch (error: any) {
      console.error("Error assigning schedule:", error);
      toast.error(error.message || "Failed to assign schedule");
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
            Assign Work Schedule
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
          {/* CURRENT SCHEDULE */}
          {currentSchedule && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm font-medium text-purple-900 mb-1">
                Current Schedule:
              </p>
              <p className="text-lg font-semibold text-purple-700">
                {currentSchedule.workSchedule?.name || "N/A"}
              </p>
            </div>
          )}

          {/* WORK SCHEDULE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Schedule <span className="text-red-500">*</span>
            </label>
            <select
              {...register("workScheduleId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select schedule</option>
              {schedules
                .filter(
                  (schedule: any) =>
                    schedule.id !== currentSchedule?.workScheduleId,
                )
                .map((schedule: any) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.name} - {schedule.scheduleType}
                  </option>
                ))}
            </select>
            {errors.workScheduleId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.workScheduleId.message}
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

          {/* NOTES */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Optional notes about this schedule assignment..."
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
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Assigning..." : "Assign Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
