"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";
import {
  assignPayrollComponentSchema,
  IAssignPayrollComponentFormData,
} from "@/schemas/employee-payroll-component.schema";
import {
  ASSIGN_PAYROLL_COMPONENT,
  UPDATE_EMPLOYEE_PAYROLL_COMPONENT,
  GET_ACTIVE_EMPLOYEE_PAYROLL_COMPONENTS,
  EMPLOYEE_PAYROLL_COMPONENTS_HISTORY,
} from "@/graphql/employee-payroll-components.api";
import { GET_PAYROLL_COMPONENTS } from "@/graphql/payroll-component.api";
import { IEmployeePayrollComponent, IPayrollComponent } from "@/types";
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
  initialData?: IEmployeePayrollComponent;
}

// ==================== HELPER COMPONENT ====================
function FormFields({
  components,
  isEdit,
}: {
  components: IPayrollComponent[];
  isEdit: boolean;
}) {
  const { watch, setValue } = useFormContext<IAssignPayrollComponentFormData>();
  const selectedComponentId = watch("payrollComponentId");

  useEffect(() => {
    if (selectedComponentId && !isEdit) {
      const component = components.find(
        (c) => c.id === Number(selectedComponentId),
      );
      if (component) {
        setValue("value", component.defaultValue || 0);
      }
    }
  }, [selectedComponentId, components, setValue, isEdit]);

  const componentOptions = components.map((c) => ({
    label: `${c.name} (${c.code})`,
    value: Number(c.id),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelect
          name="payrollComponentId"
          label="Select Payroll Component"
          placeholder="Choose a payroll component"
          options={componentOptions}
          dataAuto="payroll-component-select"
          required={true}
          isLoading={false}
          disabled={isEdit}
        />
        <CustomInputField
          name="value"
          label="Value"
          type="number"
          placeholder="Enter assignment value"
          dataAuto="component-value"
        />
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
          right
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
  initialData,
}: IAssignPayrollComponentFormProps) {
  const isEdit = !!initialData;

  // ==================== API Mutation: Assign ====================
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

  // ==================== API Mutation: Update ====================
  const [updateComponent, { loading: updating }] = useMutation<{
    updateEmployeePayrollComponent: {
      success: boolean;
      message?: string;
    };
  }>(UPDATE_EMPLOYEE_PAYROLL_COMPONENT, {
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
      if (data.updateEmployeePayrollComponent?.success) {
        toast.success("Payroll component updated successfully");
        onClose();
      } else {
        toast.error(
          data.updateEmployeePayrollComponent?.message ||
            "Failed to update component",
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
      if (isEdit) {
        await updateComponent({
          variables: {
            updateEmployeePayrollComponentInput: {
              ...data,
              id: initialData.id,
              payrollComponentId: Number(data.payrollComponentId),
              userId: Number(userId),
              effectiveFrom: data.effectiveFrom
                ? dayjs.utc(data.effectiveFrom, "DD-MM-YYYY").toISOString()
                : null,
              effectiveTo: data.effectiveTo
                ? dayjs.utc(data.effectiveTo, "DD-MM-YYYY").toISOString()
                : null,
            },
          },
        });
      } else {
        await assignComponent({
          variables: {
            assignEmployeePayrollComponentInput: {
              ...data,
              userId: Number(userId),
              payrollComponentId: Number(data.payrollComponentId),
              effectiveFrom: data.effectiveFrom
                ? dayjs.utc(data.effectiveFrom, "DD-MM-YYYY").toISOString()
                : null,
              effectiveTo: data.effectiveTo
                ? dayjs.utc(data.effectiveTo, "DD-MM-YYYY").toISOString()
                : null,
            },
          },
        });
      }
    } catch (error) {
      console.error("Assignment/Update error:", error);
    }
  };

  const defaultValues = {
    payrollComponentId: initialData?.payrollComponentId || "",
    value: initialData?.value || 0,
    effectiveFrom: initialData?.effectiveFrom
      ? dayjs(initialData.effectiveFrom).format("DD-MM-YYYY")
      : "",
    effectiveTo: initialData?.effectiveTo
      ? dayjs(initialData.effectiveTo).format("DD-MM-YYYY")
      : "",
    notes: initialData?.notes || "",
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
      <FormFields components={activeComponents} isEdit={isEdit} />

      <FormActionButton
        cancelHandler={onClose}
        isPending={assigning || updating}
      />
    </CustomForm>
  );
}
