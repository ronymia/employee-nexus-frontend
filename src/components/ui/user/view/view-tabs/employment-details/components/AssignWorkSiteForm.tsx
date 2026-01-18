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
import { ASSIGN_EMPLOYEE_WORK_SITE } from "@/graphql/employee-work-site.api";
import { GET_WORK_SITES } from "@/graphql/work-sites.api";
import { IWorkSite } from "@/types";

// ==================== SCHEMA ====================
const assignWorkSiteSchema = z.object({
  workSiteId: z.string().min(1, "Please select a work site"),
  startDate: z.string().min(1, "Start date is required"),
});

type IAssignWorkSiteForm = z.infer<typeof assignWorkSiteSchema>;

// ==================== INTERFACES ====================
interface IAssignWorkSiteFormProps {
  userId: number;
  currentWorkSiteIds: number[];
  onClose: () => void;
  onSuccess: () => void;
}

// ==================== COMPONENT ====================
export default function AssignWorkSiteForm({
  userId,
  currentWorkSiteIds,
  onClose,
  onSuccess,
}: IAssignWorkSiteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==================== QUERIES ====================
  const { data: workSitesData } = useQuery<{
    workSites: { data: IWorkSite[] };
  }>(GET_WORK_SITES);
  const workSites = workSitesData?.workSites?.data || [];

  const [assignWorkSite] = useMutation(ASSIGN_EMPLOYEE_WORK_SITE);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAssignWorkSiteForm>({
    resolver: zodResolver(assignWorkSiteSchema),
    defaultValues: {
      workSiteId: "",
      startDate: dayjs().format("DD-MM-YYYY"),
    },
  });

  // ==================== HANDLERS ====================
  const onSubmit = async (data: IAssignWorkSiteForm) => {
    setIsSubmitting(true);
    try {
      const { data: response, error } = await assignWorkSite({
        variables: {
          assignEmployeeWorkSiteInput: {
            userId,
            workSiteId: Number(data.workSiteId),
            startDate: dayjs.utc(data.startDate, "DD-MM-YYYY").toDate(),
          },
        },
      });

      if (response) {
        toast.success("Work site assigned successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(error?.message || "Failed to assign work site");
      }
    } catch (error: any) {
      console.error("Error assigning work site:", error);
      toast.error(error.message || "Failed to assign work site");
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
            Assign Work Site
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
          {/* INFO ALERT */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              Assign employee to a work site location. Multiple work sites can
              be active simultaneously.
            </p>
          </div>

          {/* WORK SITE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Site <span className="text-red-500">*</span>
            </label>
            <select
              {...register("workSiteId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select work site</option>
              {workSites
                .filter((site: any) => !currentWorkSiteIds.includes(site.id))
                .map((site: any) => (
                  <option key={site.id} value={site.id}>
                    {site.name} - {site.address || "No address"}
                  </option>
                ))}
            </select>
            {errors.workSiteId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.workSiteId.message}
              </p>
            )}
          </div>

          {/* START DATE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
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
              {isSubmitting ? "Assigning..." : "Assign Work Site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
