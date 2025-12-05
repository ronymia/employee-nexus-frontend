"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import { IPayrollCycle, PayrollFrequency } from "@/types";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_PAYROLL_CYCLE,
  UPDATE_PAYROLL_CYCLE,
} from "@/graphql/payroll-cycle.api";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface PayrollCycleFormProps {
  cycle?: IPayrollCycle;
  actionType: "create" | "update";
  onClose: () => void;
  refetch?: () => void;
}

export default function PayrollCycleForm({
  cycle,
  actionType,
  onClose,
  refetch,
}: PayrollCycleFormProps) {
  const [isPending, setIsPending] = useState(false);

  const [createCycle] = useMutation(CREATE_PAYROLL_CYCLE);
  const [updateCycle] = useMutation(UPDATE_PAYROLL_CYCLE);

  const handleSubmit = async (data: any) => {
    try {
      setIsPending(true);

      const periodStart = dayjs(data.periodStart, "DD-MM-YYYY").toISOString();
      const periodEnd = dayjs(data.periodEnd, "DD-MM-YYYY").toISOString();
      const paymentDate = dayjs(data.paymentDate, "DD-MM-YYYY").toISOString();

      const input = {
        name: data.name,
        frequency: data.frequency,
        periodStart,
        periodEnd,
        paymentDate,
        notes: data.notes || undefined,
      };

      if (actionType === "create") {
        await createCycle({
          variables: {
            createPayrollCycleInput: input,
          },
        });
      } else {
        await updateCycle({
          variables: {
            id: Number(cycle?.id),
            updatePayrollCycleInput: input,
          },
        });
      }

      refetch?.();
      onClose();
    } catch (error) {
      console.error("Error submitting cycle:", error);
    } finally {
      setIsPending(false);
    }
  };

  const defaultValues = {
    name: cycle?.name || "",
    frequency: cycle?.frequency || PayrollFrequency.MONTHLY,
    periodStart: cycle?.periodStart
      ? dayjs(cycle.periodStart).format("DD-MM-YYYY")
      : dayjs().startOf("month").format("DD-MM-YYYY"),
    periodEnd: cycle?.periodEnd
      ? dayjs(cycle.periodEnd).format("DD-MM-YYYY")
      : dayjs().endOf("month").format("DD-MM-YYYY"),
    paymentDate: cycle?.paymentDate
      ? dayjs(cycle.paymentDate).format("DD-MM-YYYY")
      : dayjs().endOf("month").add(5, "days").format("DD-MM-YYYY"),
    notes: cycle?.notes || "",
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <PayrollCycleFormFields />
      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
  );
}

function PayrollCycleFormFields() {
  const frequencyOptions = [
    // { label: "Weekly", value: PayrollFrequency.WEEKLY },
    // { label: "Bi-Weekly", value: PayrollFrequency.BI_WEEKLY },
    // { label: "Semi-Monthly", value: PayrollFrequency.SEMI_MONTHLY },
    { label: "Monthly", value: PayrollFrequency.MONTHLY },
  ];

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Cycle Information
        </h4>
        <div className="grid grid-cols-1 gap-4">
          <CustomInputField
            dataAuto="name"
            name="name"
            label="Cycle Name"
            placeholder="e.g., January 2025 Payroll"
            required={true}
          />
          <CustomSelect
            dataAuto="frequency"
            name="frequency"
            label="Payment Frequency"
            placeholder="Select Frequency"
            required={true}
            options={frequencyOptions}
            isLoading={false}
          />
        </div>
      </div>

      {/* Period Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Period Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomDatePicker
            dataAuto="periodStart"
            name="periodStart"
            label="Period Start Date"
            placeholder="Select Start Date"
            required={true}
          />
          <CustomDatePicker
            dataAuto="periodEnd"
            name="periodEnd"
            label="Period End Date"
            placeholder="Select End Date"
            required={true}
            right
          />
          <CustomDatePicker
            dataAuto="paymentDate"
            name="paymentDate"
            label="Payment Date"
            placeholder="Select Payment Date"
            required={true}
            right
          />
        </div>
      </div>

      {/* Notes */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Additional Information
        </h4>
        <CustomTextareaField
          dataAuto="notes"
          name="notes"
          label="Notes"
          placeholder="Add any notes or instructions for this payroll cycle..."
          required={false}
          rows={3}
        />
      </div>
    </div>
  );
}
