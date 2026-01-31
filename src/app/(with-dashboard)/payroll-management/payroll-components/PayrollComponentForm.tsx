"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";

import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import { IPayrollComponent, ComponentType, CalculationType } from "@/types";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_PAYROLL_COMPONENT,
  UPDATE_PAYROLL_COMPONENT,
  PAYROLL_COMPONENT_OVERVIEW,
} from "@/graphql/payroll-component.api";
import {
  payrollComponentSchema,
  IPayrollComponentFormData,
} from "@/schemas/payroll-component.schema";

interface IPayrollComponentFormProps {
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
}: IPayrollComponentFormProps) {
  const [createComponent, createResult] = useMutation(
    CREATE_PAYROLL_COMPONENT,
    {
      refetchQueries: [{ query: PAYROLL_COMPONENT_OVERVIEW }],
    },
  );
  const [updateComponent, updateResult] = useMutation(
    UPDATE_PAYROLL_COMPONENT,
    {
      refetchQueries: [{ query: PAYROLL_COMPONENT_OVERVIEW }],
    },
  );

  const handleSubmit = async (data: IPayrollComponentFormData) => {
    try {
      const input = {
        name: data.name,
        code: data.code,
        description: data.description || undefined,
        componentType: data.componentType,
        calculationType: data.calculationType,
        defaultValue: data.defaultValue,
        isTaxable: data.isTaxable,
        isStatutory: data.isStatutory,
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
    }
  };

  const defaultValues: IPayrollComponentFormData = {
    name: component?.name || "",
    code: component?.code || "",
    description: component?.description || "",
    componentType: component?.componentType || ComponentType.EARNING,
    calculationType: component?.calculationType || CalculationType.FIXED_AMOUNT,
    defaultValue: component?.defaultValue || 0,
    isTaxable: component?.isTaxable ?? false,
    isStatutory: component?.isStatutory ?? false,
  };

  return (
    <CustomForm
      submitHandler={handleSubmit}
      defaultValues={defaultValues}
      resolver={payrollComponentSchema}
      className={`flex flex-col gap-4`}
    >
      <PayrollComponentFormFields actionType={actionType} />
      <FormActionButton
        isPending={createResult.loading || updateResult.loading}
        cancelHandler={onClose}
      />
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
    // { label: "Employer Cost", value: ComponentType.EMPLOYER_COST },
  ];

  const calculationTypeOptions = [
    {
      label: "Fixed Amount",
      value: CalculationType.FIXED_AMOUNT,
    },
    {
      label: "Percentage of Basic Salary",
      value: CalculationType.PERCENTAGE_OF_BASIC,
    },
    // {
    //   label: "Percentage of Gross Pay",
    //   value: CalculationType.PERCENTAGE_OF_GROSS,
    // },
    // { label: "Hourly Rate", value: CalculationType.HOURLY_RATE },
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
          />
        </div>
      </div>

      {/* Properties */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Properties
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-base-content">Taxable</span>
              <span className="text-sm text-base-content/60">
                Subject to income tax
              </span>
            </div>
            <ToggleSwitch name="isTaxable" />
          </div>

          <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-base-content">Statutory</span>
              <span className="text-sm text-base-content/60">
                Required by law
              </span>
            </div>
            <ToggleSwitch name="isStatutory" />
          </div>
        </div>
      </div>
    </div>
  );
}
