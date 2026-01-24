"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import { payslipAdjustmentSchema } from "@/schemas/payslip-adjustment.schema";
import {
  CREATE_PAYSLIP_ADJUSTMENT,
  UPDATE_PAYSLIP_ADJUSTMENT,
  GET_PAYSLIP_ADJUSTMENTS,
} from "@/graphql/payslip-adjustment.api";
import { GET_PAYROLL_COMPONENTS } from "@/graphql/payroll-component.api";
import { IPayrollComponent, IPayslipAdjustment } from "@/types";
import toast from "react-hot-toast";
import dayjs from "dayjs";

// ==================== INTERFACES ====================
interface IPayslipAdjustmentFormProps {
  userId: number;
  onClose: () => void;
  initialData?: IPayslipAdjustment;
}

// ==================== HELPER COMPONENT ====================
function FormFields({
  components,
  isEdit,
}: {
  components: IPayrollComponent[];
  isEdit: boolean;
}) {
  const componentOptions = components.map((c) => ({
    label: `${c.name} (${c.code})`,
    value: Number(c.id),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelect
          name="payrollComponentId"
          label="Payroll Component"
          placeholder="Select a component"
          options={componentOptions}
          required={true}
          disabled={isEdit}
          dataAuto="adjustment-component-select"
          isLoading={false}
        />
        <CustomInputField
          name="value"
          label="Adjustment Value"
          type="number"
          placeholder="Enter amount"
          required={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInputField
          name="remarks"
          label="Remarks / Description"
          placeholder="What is this adjustment for?"
        />
        <CustomDatePicker
          name="appliedMonth"
          label="Applied Month"
          dataAuto="adjustment-applied-month"
          placeholder="Select month"
          formatDate="MM-YYYY"
          pick="month"
          required={false}
        />
      </div>

      <CustomTextareaField
        name="notes"
        label="Internal Notes"
        placeholder="Any additional internal context"
      />
    </div>
  );
}

// ==================== COMPONENT ====================
export default function PayslipAdjustmentForm({
  userId,
  onClose,
  initialData,
}: IPayslipAdjustmentFormProps) {
  const isEdit = !!initialData;

  // ==================== API Mutation: Create ====================
  const [createAdjustment, { loading: creating }] = useMutation(
    CREATE_PAYSLIP_ADJUSTMENT,
    {
      refetchQueries: [
        {
          query: GET_PAYSLIP_ADJUSTMENTS,
          variables: { query: { userId: Number(userId) } },
        },
      ],
      onCompleted: (data: any) => {
        if (data.createPayslipAdjustment?.success) {
          toast.success("Adjustment created successfully");
          onClose();
        } else {
          toast.error(
            data.createPayslipAdjustment?.message ||
              "Failed to create adjustment",
          );
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  // ==================== API Mutation: Update ====================
  const [updateAdjustment, { loading: updating }] = useMutation(
    UPDATE_PAYSLIP_ADJUSTMENT,
    {
      refetchQueries: [
        {
          query: GET_PAYSLIP_ADJUSTMENTS,
          variables: { query: { userId: Number(userId) } },
        },
      ],
      onCompleted: (data: any) => {
        if (data.updatePayslipAdjustment?.success) {
          toast.success("Adjustment updated successfully");
          onClose();
        } else {
          toast.error(
            data.updatePayslipAdjustment?.message ||
              "Failed to update adjustment",
          );
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  // ==================== API Query: Components ====================
  const { data: componentsData, loading: componentsLoading } = useQuery<{
    payrollComponents: {
      data: IPayrollComponent[];
    };
  }>(GET_PAYROLL_COMPONENTS, {
    variables: { query: { status: "ACTIVE" } },
  });

  const activeComponents = componentsData?.payrollComponents?.data || [];

  // ==================== HANDLERS ====================
  const handleSubmit = async (formData: any) => {
    try {
      const formattedData = {
        ...formData,
        userId: Number(userId),
        payrollComponentId: Number(formData.payrollComponentId),
        value: Number(formData.value),
        appliedMonth: formData.appliedMonth
          ? dayjs(formData.appliedMonth, "DD-MM-YYYY").format("YYYY-MM-DD")
          : null,
      };

      if (isEdit) {
        await updateAdjustment({
          variables: {
            updatePayslipAdjustmentInput: {
              ...formattedData,
              id: initialData.id,
            },
          },
        });
      } else {
        await createAdjustment({
          variables: {
            createPayslipAdjustmentInput: formattedData,
          },
        });
      }
    } catch (error) {
      console.error("Adjustment error:", error);
    }
  };

  const defaultValues = {
    payrollComponentId: initialData?.payrollComponentId || "",
    value: initialData?.value || 0,
    remarks: initialData?.remarks || "",
    appliedMonth: initialData?.appliedMonth
      ? dayjs(initialData.appliedMonth).format("DD-MM-YYYY")
      : "",
    notes: initialData?.notes || "",
  };

  // ==================== RENDER ====================
  if (componentsLoading)
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Loading components...
      </div>
    );

  return (
    <CustomForm
      submitHandler={handleSubmit}
      defaultValues={defaultValues}
      resolver={payslipAdjustmentSchema}
      className="flex flex-col gap-6"
    >
      <FormFields components={activeComponents} isEdit={isEdit} />

      <FormActionButton
        cancelHandler={onClose}
        isPending={creating || updating}
      />
    </CustomForm>
  );
}
