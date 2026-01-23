"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import ToggleSwitch from "@/components/form/input/ToggleSwitch";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import {
  assignPayrollComponentSchema,
  IAssignPayrollComponentFormData,
} from "@/schemas/employee-payroll-component.schema";
import {
  ASSIGN_PAYROLL_COMPONENT,
  GET_ACTIVE_EMPLOYEE_PAYROLL_COMPONENTS,
  EMPLOYEE_PAYROLL_COMPONENTS_HISTORY,
} from "@/graphql/employee-payroll-components.api";
import { GET_PAYROLL_COMPONENTS } from "@/graphql/payroll-component.api";
import { IPayrollComponent } from "@/types";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

// ==================== INTERFACES ====================
interface IAssignPayrollComponentFormProps {
  userId: number;
  onClose: () => void;
}

// ==================== HELPER COMPONENT ====================
function FormFields({ components }: { components: IPayrollComponent[] }) {
  const { watch, setValue } = useFormContext<IAssignPayrollComponentFormData>();
  const selectedComponentId = watch("componentId");

  useEffect(() => {
    if (selectedComponentId) {
      const component = components.find(
        (c) => c.id === Number(selectedComponentId),
      );
      if (component) {
        setValue("value", component.defaultValue || 0);
      }
    }
  }, [selectedComponentId, components, setValue]);

  const componentOptions = components.map((c) => ({
    label: `${c.name} (${c.code})`,
    value: c.id,
  }));

  return (
    <div className="space-y-4">
      <CustomSelect
        name="componentId"
        label="Select Component"
        placeholder="Choose a payroll component"
        options={componentOptions}
        dataAuto="component-select"
        required={true}
        isLoading={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInputField
          name="value"
          label="Value"
          type="number"
          placeholder="Enter assignment value"
          dataAuto="component-value"
        />
        <div className="flex flex-col justify-center">
          <ToggleSwitch name="isOverride" label="Override Default" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomDatePicker
          name="effectiveFrom"
          label="Effective From"
          dataAuto="effective-from"
          required={true}
        />
        <CustomDatePicker
          name="effectiveTo"
          label="Effective To"
          dataAuto="effective-to"
          required={false}
        />
      </div>

      <CustomTextareaField
        name="notes"
        label="Notes"
        placeholder="Add any additional context or reasons for this assignment"
      />
    </div>
  );
}

// ==================== COMPONENT ====================
export default function AssignPayrollComponentForm({
  userId,
  onClose,
}: IAssignPayrollComponentFormProps) {
  // ==================== API Mutation ====================
  const [assignComponent, { loading: assigning }] = useMutation<{
    assignEmployeePayrollComponent: {
      success: boolean;
      message?: string;
    };
  }>(ASSIGN_PAYROLL_COMPONENT, {
    refetchQueries: [
      {
        query: GET_ACTIVE_EMPLOYEE_PAYROLL_COMPONENTS,
        variables: { query: { userId: Number(userId) } },
      },
      {
        query: EMPLOYEE_PAYROLL_COMPONENTS_HISTORY,
        variables: { query: { userId: Number(userId) } },
      },
    ],
    onCompleted: (data) => {
      if (data.assignEmployeePayrollComponent?.success) {
        toast.success("Payroll component assigned successfully");
        onClose();
      } else {
        toast.error(
          data.assignEmployeePayrollComponent?.message ||
            "Failed to assign component",
        );
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
  const handleSubmit = async (data: IAssignPayrollComponentFormData) => {
    try {
      await assignComponent({
        variables: {
          assignEmployeePayrollComponentInput: {
            userId: Number(userId),
            componentId: Number(data.componentId),
            value: Number(data.value),
            isOverride: data.isOverride,
            effectiveFrom: data.effectiveFrom
              ? dayjs.utc(data.effectiveFrom, "DD-MM-YYYY").toISOString()
              : null,
            effectiveTo: data.effectiveTo
              ? dayjs.utc(data.effectiveTo, "DD-MM-YYYY").toISOString()
              : null,
            notes: data.notes,
          },
        },
      });
    } catch (error) {
      console.error("Assignment error:", error);
    }
  };

  const defaultValues = {
    componentId: "",
    value: 0,
    isOverride: false,
    effectiveFrom: "",
    effectiveTo: "",
    notes: "",
  };

  // ==================== RENDER ====================
  if (componentsLoading)
    return <div className="p-4 text-center">Loading components...</div>;

  return (
    <CustomForm
      submitHandler={handleSubmit}
      defaultValues={defaultValues}
      resolver={assignPayrollComponentSchema}
      className="flex flex-col gap-6"
    >
      <FormFields components={activeComponents} />

      <FormActionButton cancelHandler={onClose} isPending={assigning} />
    </CustomForm>
  );
}
