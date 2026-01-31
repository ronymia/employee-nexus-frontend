"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import { IPayrollItem, IPayrollComponent, IUser } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CREATE_PAYROLL_ITEM,
  UPDATE_PAYROLL_ITEM,
} from "@/graphql/payroll-item.api";
import { GET_PAYROLL_COMPONENTS } from "@/graphql/payroll-component.api";
import { GET_EMPLOYEES } from "@/graphql/employee.api";
import { useState, useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface PayrollItemFormProps {
  item?: IPayrollItem & { payrollCycleId?: number };
  actionType: "create" | "update";
  onClose: () => void;
  refetch?: () => void;
}

export default function PayrollItemForm({
  item,
  actionType,
  onClose,
  refetch,
}: PayrollItemFormProps) {
  const [isPending, setIsPending] = useState(false);

  const [createItem] = useMutation(CREATE_PAYROLL_ITEM);
  const [updateItem] = useMutation(UPDATE_PAYROLL_ITEM);

  // Fetch employees
  const { data: employeesData } = useQuery<{
    employees: { data: any[] };
  }>(GET_EMPLOYEES, {
    variables: { query: {} },
  });

  // Fetch payroll components
  const { data: componentsData } = useQuery<{
    payrollComponents: { data: IPayrollComponent[] };
  }>(GET_PAYROLL_COMPONENTS, {
    variables: { query: {} },
  });

  const employees = employeesData?.employees?.data || [];
  const components = componentsData?.payrollComponents?.data || [];

  const handleSubmit = async (data: any) => {
    try {
      setIsPending(true);

      // Calculate totals
      const componentsData = data.components || [];
      const adjustmentsData = data.adjustments || [];

      const input = {
        payrollCycleId: item?.payrollCycleId || data.payrollCycleId,
        userId: Number(data.userId),
        basicSalary: Number(data.basicSalary),
        workingDays: Number(data.workingDays),
        presentDays: Number(data.presentDays),
        absentDays: Number(data.absentDays),
        leaveDays: Number(data.leaveDays),
        overtimeHours: data.overtimeHours
          ? Number(data.overtimeHours)
          : undefined,
        paymentMethod: data.paymentMethod || undefined,
        bankAccount: data.bankAccount || undefined,
        notes: data.notes || undefined,
        components: componentsData.map((c: any) => ({
          componentId: Number(c.componentId),
          amount: Number(c.amount),
          calculationBase: c.calculationBase
            ? Number(c.calculationBase)
            : undefined,
          notes: c.notes || undefined,
        })),
        adjustments: adjustmentsData.map((a: any) => ({
          type: a.type,
          description: a.description,
          amount: Number(a.amount),
          isRecurring: a.isRecurring || false,
          notes: a.notes || undefined,
        })),
      };

      if (actionType === "create") {
        await createItem({
          variables: {
            createPayrollItemInput: input,
          },
        });
      } else {
        const { payrollCycleId, userId, ...rest } = input;
        await updateItem({
          variables: {
            updatePayrollItemInput: {
              ...rest,
              id: Number(item?.id),
            },
          },
        });
      }

      refetch?.();
      onClose();
    } catch (error) {
      console.error("Error submitting payroll item:", error);
    } finally {
      setIsPending(false);
    }
  };

  const defaultValues = {
    payrollCycleId: item?.payrollCycleId || "",
    userId: String(item?.userId) || "",
    basicSalary: item?.basicSalary || "",
    workingDays: item?.workingDays || 30,
    presentDays: item?.presentDays || "",
    absentDays: item?.absentDays || "",
    leaveDays: item?.leaveDays || "",
    overtimeHours: item?.overtimeHours || "",
    paymentMethod: item?.paymentMethod || "bank_transfer",
    bankAccount: item?.bankAccount || "",
    notes: item?.notes || "",
    components:
      item?.components?.map((c) => ({
        componentId: String(c.componentId),
        component: c.component,
        amount: c.amount,
        calculationBase: c.calculationBase,
        notes: c.notes,
      })) || [],
    adjustments:
      item?.adjustments?.map((a) => ({
        type: a.type,
        description: a.description,
        amount: a.amount,
        isRecurring: a.isRecurring,
        notes: a.notes,
      })) || [],
  };

  console.log({ defaultValues });

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <PayrollItemFormFields
        employees={employees}
        components={components}
        actionType={actionType}
      />
      <FormActionButton isPending={isPending} cancelHandler={onClose} />
    </CustomForm>
  );
}

function PayrollItemFormFields({
  employees,
  components,
  actionType,
}: {
  employees: IUser[];
  components: IPayrollComponent[];
  actionType: "create" | "update";
}) {
  const { control, setValue, watch } = useFormContext();

  const employeeOptions = employees.map((emp) => ({
    label: emp.profile?.fullName || emp.email,
    value: emp.id.toString(),
  }));

  const paymentMethodOptions = [
    { label: "Bank Transfer", value: "bank_transfer" },
    { label: "Cash", value: "cash" },
    { label: "Cheque", value: "cheque" },
  ];

  // Watch for changes to auto-calculate
  // const basicSalary = useWatch({
  //   control,
  //   name: "basicSalary",
  //   defaultValue: 0,
  // });
  const workingDays = useWatch({
    control,
    name: "workingDays",
    defaultValue: 30,
  });
  const presentDays = useWatch({
    control,
    name: "presentDays",
    defaultValue: 0,
  });
  // const absentDays = useWatch({ control, name: "absentDays", defaultValue: 0 });
  const leaveDays = useWatch({ control, name: "leaveDays", defaultValue: 0 });

  // Auto-calculate absent and leave days
  useEffect(() => {
    const calculatedAbsent = workingDays - presentDays - leaveDays;
    if (calculatedAbsent >= 0) {
      setValue("absentDays", calculatedAbsent);
    }
  }, [workingDays, presentDays, leaveDays, setValue]);

  // Auto-calculate overtime hours
  // useEffect(() => {
  //   const calculatedOvertime = basicSalary * 0.5;
  //   if (calculatedOvertime >= 0) {
  //     setValue("overtimeHours", calculatedOvertime);
  //   }
  // }, [basicSalary, setValue]);

  // ADD BASIC SALARY
  useEffect(() => {
    const selectedEmployee = employees.find(
      (e) => e.id.toString() === watch("userId"),
    );

    if (selectedEmployee && selectedEmployee.employee) {
      setValue("basicSalary", 0);
    }
  }, [watch("userId")]);

  return (
    <div className="space-y-4">
      {/* Employee Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Employee Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            dataAuto="userId"
            name="userId"
            label="Employee"
            placeholder="Select Employee"
            required={true}
            options={employeeOptions}
            isLoading={false}
            disabled={actionType === "update"}
          />
          <CustomInputField
            dataAuto="basicSalary"
            name="basicSalary"
            label="Basic Salary"
            placeholder="Enter basic salary"
            required={true}
            type="number"
            // step="0.01"
            readOnly={true}
          />
        </div>
      </div>

      {/* Attendance Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Attendance Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomInputField
            dataAuto="workingDays"
            name="workingDays"
            label="Working Days"
            placeholder="30"
            required={true}
            type="number"
          />
          <CustomInputField
            dataAuto="presentDays"
            name="presentDays"
            label="Present Days"
            placeholder="28"
            required={true}
            type="number"
            // step="0.5"
          />
          <CustomInputField
            dataAuto="leaveDays"
            name="leaveDays"
            label="Leave Days"
            placeholder="2"
            required={true}
            type="number"
            // step="0.5"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <CustomInputField
            dataAuto="absentDays"
            name="absentDays"
            label="Absent Days (Auto-calculated)"
            placeholder="0"
            required={true}
            type="number"
            // step="0.5"
            disabled={true}
          />
          <CustomInputField
            dataAuto="overtimeHours"
            name="overtimeHours"
            label="Overtime Hours"
            placeholder="0"
            required={false}
            type="number"
            // step="0.5"
          />
        </div>
      </div>

      {/* Payment Information */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Payment Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            dataAuto="paymentMethod"
            name="paymentMethod"
            label="Payment Method"
            placeholder="Select payment method"
            required={false}
            options={paymentMethodOptions}
            isLoading={false}
          />
          <CustomInputField
            dataAuto="bankAccount"
            name="bankAccount"
            label="Bank Account"
            placeholder="Account number"
            required={false}
          />
        </div>
      </div>

      {/* Components Section */}
      <PayrollComponentsSection components={components} />

      {/* Adjustments Section */}
      <PayslipAdjustmentsSection />

      {/* Notes */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Additional Information
        </h4>
        <CustomTextareaField
          dataAuto="notes"
          name="notes"
          label="Notes"
          placeholder="Add any additional notes..."
          required={false}
          rows={3}
        />
      </div>
    </div>
  );
}

// Components Section Component
function PayrollComponentsSection({
  components,
}: {
  components: IPayrollComponent[];
}) {
  const { control, setValue } = useFormContext();
  const prevComponentIdsRef = useRef<string[]>([]);

  const basicSalary = useWatch({
    control,
    name: "basicSalary",
    defaultValue: 0,
  });

  // Watch the components array from react-hook-form
  const componentsFormValue = useWatch({
    control,
    name: "components",
    defaultValue: [],
  });

  // Initialize prevComponentIdsRef with existing componentIds on mount
  // useEffect(() => {
  //   if (prevComponentIdsRef.current.length === 0 && componentsFormValue && componentsFormValue.length > 0) {
  //     prevComponentIdsRef.current = componentsFormValue.map((comp: any) => comp.componentId || "");
  //   }
  // }, []);

  // Auto-calculate amounts when component is selected (detect componentId changes)
  useEffect(() => {
    if (!componentsFormValue || componentsFormValue.length === 0) {
      prevComponentIdsRef.current = [];
      return;
    }

    const currentComponentIds = componentsFormValue.map(
      (comp: any) => comp.componentId || "",
    );
    const prevComponentIds = prevComponentIdsRef.current;

    const updatedComponents = componentsFormValue.map(
      (comp: any, index: number) => {
        if (!comp.componentId) return comp;

        const component = components.find(
          (c) => c.id === Number(comp.componentId),
        );
        if (!component) return comp;

        // Check if this component was just selected (componentId changed)
        const isNewlySelected =
          currentComponentIds[index] !== prevComponentIds[index];

        // Only auto-calculate if component was just selected
        if (isNewlySelected) {
          let calculatedAmount = 0;

          // Auto-calculate based on component type
          if (component.calculationType === "PERCENTAGE_OF_BASIC") {
            calculatedAmount = (basicSalary * component.defaultValue!) / 100;
          } else if (component.calculationType === "FIXED_AMOUNT") {
            calculatedAmount = component.defaultValue || 0;
          }

          return {
            ...comp,
            amount: calculatedAmount,
            calculationBase: basicSalary,
            component: component,
          };
        }

        // Component already selected, don't recalculate (allow manual editing)
        // But update component reference if not set
        if (!comp.component) {
          return {
            ...comp,
            component: component,
          };
        }

        return comp;
      },
    );

    // Check if there are actual changes before updating
    const hasChanges = componentsFormValue.some((comp: any, index: number) => {
      return JSON.stringify(comp) !== JSON.stringify(updatedComponents[index]);
    });

    if (hasChanges) {
      setValue("components", updatedComponents, { shouldValidate: false });
    }

    // Update the ref with current componentIds
    prevComponentIdsRef.current = currentComponentIds;
  }, [componentsFormValue, basicSalary, components, setValue]);

  const addComponent = () => {
    const currentComponents = componentsFormValue || [];
    const newComponent = {
      componentId: "",
      amount: 0,
      calculationBase: basicSalary,
      notes: "",
    };
    setValue("components", [...currentComponents, newComponent]);
  };

  const removeComponent = (index: number) => {
    const currentComponents = componentsFormValue || [];
    const newComponents = currentComponents.filter(
      (_: any, i: number) => i !== index,
    );
    setValue("components", newComponents);
  };

  const componentOptions = components.map((c) => ({
    label: `${c.name} (${c.code})`,
    value: c.id.toString(),
  }));

  return (
    <div className="border border-primary/20 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-base font-semibold text-primary">
          Payroll Components
        </h4>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={addComponent}
        >
          Add Component
        </button>
      </div>

      <div className="space-y-3">
        {componentsFormValue && componentsFormValue.length > 0 ? (
          componentsFormValue.map((_: any, index: number) => (
            <div key={index} className="border rounded p-3 bg-base-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                <CustomSelect
                  dataAuto={`component-${index}`}
                  name={`components.${index}.componentId`}
                  label="Component"
                  placeholder="Select component"
                  required={true}
                  options={componentOptions}
                  isLoading={false}
                />
                <CustomInputField
                  dataAuto={`amount-${index}`}
                  name={`components.${index}.amount`}
                  label="Amount"
                  placeholder="0.00"
                  required={true}
                  type="number"
                />
                <CustomInputField
                  dataAuto={`base-${index}`}
                  name={`components.${index}.calculationBase`}
                  label="Base Amount"
                  placeholder="0.00"
                  required={false}
                  type="number"
                  readOnly={true}
                />
                <CustomInputField
                  dataAuto={`notes-${index}`}
                  name={`components.${index}.notes`}
                  label="Notes"
                  placeholder="Optional notes"
                  required={false}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-error self-center"
                  onClick={() => removeComponent(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-base-content/70 py-4">
            No components added yet. Click "Add Component" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

// Adjustments Section Component
function PayslipAdjustmentsSection() {
  const [adjustmentList, setAdjustmentList] = useState<any[]>([]);

  const addAdjustment = () => {
    setAdjustmentList([
      ...adjustmentList,
      {
        type: "bonus",
        description: "",
        amount: 0,
        isRecurring: false,
        notes: "",
      },
    ]);
  };

  const removeAdjustment = (index: number) => {
    const newList = adjustmentList.filter((_, i) => i !== index);
    setAdjustmentList(newList);
  };

  // const updateAdjustment = (index: number, field: string, value: any) => {
  //   const newList = [...adjustmentList];
  //   newList[index] = { ...newList[index], [field]: value };
  //   setAdjustmentList(newList);
  // };

  const adjustmentTypes = [
    { label: "Bonus", value: "bonus" },
    { label: "Penalty", value: "penalty" },
    { label: "Reimbursement", value: "reimbursement" },
    { label: "Advance Deduction", value: "advance_deduction" },
  ];

  return (
    <div className="border border-primary/20 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-base font-semibold text-primary">
          Payslip Adjustments
        </h4>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={addAdjustment}
        >
          Add Adjustment
        </button>
      </div>

      <div className="space-y-3">
        {adjustmentList.map((_, index) => (
          <div key={index} className="border rounded p-3 bg-base-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <CustomSelect
                dataAuto={`adj-type-${index}`}
                name={`adjustments.${index}.type`}
                label="Type"
                placeholder="Select type"
                required={true}
                options={adjustmentTypes}
                isLoading={false}
                // value={adj.type}
                // onChange={(value) => updateAdjustment(index, "type", value)}
              />
              <CustomInputField
                dataAuto={`adj-desc-${index}`}
                name={`adjustments.${index}.description`}
                label="Description"
                placeholder="Description"
                required={true}
                // value={adj.description}
                // onChange={(e) =>
                //   updateAdjustment(index, "description", e.target.value)
                // }
              />
              <CustomInputField
                dataAuto={`adj-amount-${index}`}
                name={`adjustments.${index}.amount`}
                label="Amount"
                placeholder="0.00"
                required={true}
                type="number"
                // step="0.01"
                // value={adj.amount}
                // onChange={(e) =>
                //   updateAdjustment(index, "amount", e.target.value)
                // }
              />
              {/* <div className="form-control">
                <label className="label">
                  <span className="label-text">Recurring</span>
                </label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={adj.isRecurring}
                  onChange={(e) =>
                    updateAdjustment(index, "isRecurring", e.target.checked)
                  }
                />
              </div> */}
              <CustomInputField
                dataAuto={`adj-notes-${index}`}
                name={`adjustments.${index}.notes`}
                label="Notes"
                placeholder="Optional notes"
                required={true}
                // value={adj.notes}
                // onChange={(e) =>
                //   updateAdjustment(index, "notes", e.target.value)
                // }
              />
              <button
                type="button"
                className="btn btn-sm btn-error self-center"
                onClick={() => removeAdjustment(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
