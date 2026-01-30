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
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";

// ==================== DAYJS CONFIG ====================
dayjs.extend(utc);

// ==================== GRAPHQL ====================
import { ASSIGN_EMPLOYEE_DESIGNATION } from "@/graphql/employee-designation.api";
import { GET_DESIGNATIONS } from "@/graphql/designation.api";

// ==================== TYPES ====================
import type { IDesignation, IEmployeeDesignation } from "@/types";

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
  // ==================== QUERIES ====================
  const { data: designationsData } = useQuery<{
    designations: { data: IDesignation[] };
  }>(GET_DESIGNATIONS);
  const designations = designationsData?.designations?.data || [];

  const [assignDesignation, assignDesignationState] = useMutation(
    ASSIGN_EMPLOYEE_DESIGNATION,
  );

  const defaultValues = {
    designationId: "",
    startDate: dayjs().format("DD-MM-YYYY"),
    reason: "",
    remarks: "",
  };

  // ==================== HANDLERS ====================
  const onSubmit = async (data: IChangeDesignationForm) => {
    try {
      const { data: response, error } = await assignDesignation({
        variables: {
          assignEmployeeDesignationInput: {
            userId,
            designationId: Number(data.designationId),
            startDate: dayjs.utc(data.startDate, "DD-MM-YYYY").toISOString(),
            remarks: data.remarks,
            reason: data.reason,
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
    }
  };

  const designationOptions = designations
    .filter((desig: any) => desig.id !== currentDesignation?.designationId)
    .map((desig: any) => ({
      label: desig.name,
      value: desig.id,
    }));

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
        <CustomForm
          submitHandler={onSubmit}
          defaultValues={defaultValues}
          resolver={changeDesignationSchema}
          className="p-6 space-y-4"
        >
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
            <CustomSelect
              name="designationId"
              label="New Designation"
              placeholder="Select designation"
              required={true}
              dataAuto="new-designation"
              options={designationOptions}
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
              placeholder="e.g., Promotion, Internal Transfer"
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
              disabled={assignDesignationState.loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assignDesignationState.loading
                ? "Changing..."
                : "Change Designation"}
            </button>
          </div>
        </CustomForm>
      </div>
    </div>
  );
}
