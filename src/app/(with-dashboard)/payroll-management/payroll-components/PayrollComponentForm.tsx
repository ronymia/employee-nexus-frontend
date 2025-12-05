"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import { IPayrollComponent, ComponentType, CalculationType } from "@/types";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_PAYROLL_COMPONENT,
  UPDATE_PAYROLL_COMPONENT,
} from "@/graphql/payroll-component.api";
import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

interface PayrollComponentFormProps {
  component?: IPayrollComponent;
  actionType: "create" | "update";
  onClose: () => void;
  refetch?: () => void;
}

export default function PayrollComponentForm({
  component,
  actionType,
  onClose,
  refetch,
}: PayrollComponentFormProps) {
  const [isPending, setIsPending] = useState(false);

  const [createComponent] = useMutation(CREATE_PAYROLL_COMPONENT);
  const [updateComponent] = useMutation(UPDATE_PAYROLL_COMPONENT);

  const handleSubmit = async (data: any) => {
    try {
      setIsPending(true);

      const input = {
        name: data.name,
        code: data.code.toUpperCase().replace(/\s+/g, "_"),
        description: data.description || undefined,
        componentType: data.componentType,
        calculationType: data.calculationType,
        defaultValue: data.defaultValue ? Number(data.defaultValue) : undefined,
        isActive: data.isActive ?? true,
        isTaxable: data.isTaxable ?? true,
        isStatutory: data.isStatutory ?? false,
        displayOrder: data.displayOrder ? Number(data.displayOrder) : undefined,
      };

      if (actionType === "create") {
        await createComponent({
          variables: {
            createPayrollComponentInput: input,
          },
        });
      } else {
        await updateComponent({
          variables: {
            updatePayrollComponentInput: {
              ...input,
              id: Number(component?.id),
            },
          },
        });
      }

      refetch?.();
      onClose();
    } catch (error) {
      console.error("Error submitting component:", error);
    } finally {
      setIsPending(false);
    }
  };

  const defaultValues = {
    name: component?.name || "",
    code: component?.code || "",
    description: component?.description || "",
    componentType: component?.componentType || ComponentType.EARNING,
    calculationType: component?.calculationType || CalculationType.FIXED_AMOUNT,
    defaultValue: component?.defaultValue || "",
    displayOrder: component?.displayOrder || "",
    isActive: component?.isActive ?? true,
    isTaxable: component?.isTaxable ?? true,
    isStatutory: component?.isStatutory ?? false,
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <PayrollComponentFormFields actionType={actionType} />
      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
  );
}

function PayrollComponentFormFields({
  actionType,
}: {
  actionType: "create" | "update";
}) {
  const componentTypeOptions = [
    { label: "Earning", value: ComponentType.EARNING },
    { label: "Deduction", value: ComponentType.DEDUCTION },
    { label: "Employer Cost", value: ComponentType.EMPLOYER_COST },
  ];

  const calculationTypeOptions = [
    { label: "Fixed Amount", value: CalculationType.FIXED_AMOUNT },
    {
      label: "Percentage of Basic Salary",
      value: CalculationType.PERCENTAGE_OF_BASIC,
    },
    {
      label: "Percentage of Gross Pay",
      value: CalculationType.PERCENTAGE_OF_GROSS,
    },
    { label: "Hourly Rate", value: CalculationType.HOURLY_RATE },
  ];

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInputField
            dataAuto="name"
            name="name"
            label="Component Name"
            placeholder="e.g., Basic Salary, Income Tax"
            required={true}
          />
          <CustomInputField
            dataAuto="code"
            name="code"
            label="Component Code"
            placeholder="e.g., BASIC_SAL, TAX"
            required={true}
            disabled={actionType === "update"}
          />
        </div>
        <div className="mt-4">
          <CustomTextareaField
            dataAuto="description"
            name="description"
            label="Description"
            placeholder="Describe this payroll component..."
            required={false}
            rows={2}
          />
        </div>
      </div>

      {/* Component Configuration */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            dataAuto="componentType"
            name="componentType"
            label="Component Type"
            placeholder="Select Type"
            required={true}
            options={componentTypeOptions}
            isLoading={false}
          />
          <CustomSelect
            dataAuto="calculationType"
            name="calculationType"
            label="Calculation Type"
            placeholder="Select Calculation"
            required={true}
            options={calculationTypeOptions}
            isLoading={false}
          />
          <CustomInputField
            dataAuto="defaultValue"
            name="defaultValue"
            label="Default Value"
            placeholder="Enter amount or percentage"
            required={false}
            type="number"
            // step="0.01"
          />
          {/* <CustomInputField
            dataAuto="displayOrder"
            name="displayOrder"
            label="Display Order"
            placeholder="e.g., 1, 2, 3"
            required={false}
            type="number"
          /> */}
        </div>
      </div>

      {/* Properties */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Properties
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleField
            name="isTaxable"
            label="Taxable"
            description="Subject to income tax"
          />
          <ToggleField
            name="isStatutory"
            label="Statutory"
            description="Required by law"
          />
        </div>
      </div>
    </div>
  );
}

// Toggle Field Component
function ToggleField({
  name,
  label,
  description,
}: {
  name: string;
  label: string;
  description: string;
}) {
  const { control } = useFormContext();

  return (
    <div className="form-control">
      <label className="label cursor-pointer flex-col items-start gap-2 p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <span className="label-text font-semibold">{label}</span>
            <span className="label-text-alt text-base-content/60">
              {description}
            </span>
          </div>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>
      </label>
    </div>
  );
}
