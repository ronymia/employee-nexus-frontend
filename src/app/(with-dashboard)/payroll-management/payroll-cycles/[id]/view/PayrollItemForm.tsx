"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomSelect from "@/components/form/input/CustomSelect";
import { IPayrollItem, IPayrollComponent, IUser } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CREATE_PAYROLL_ITEM,
  PREVIEW_PAYROLL_ITEM,
} from "@/graphql/payroll-item.api";
import { GET_PAYROLL_COMPONENTS } from "@/graphql/payroll-component.api";
import { GET_EMPLOYEES } from "@/graphql/employee.api";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

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
  const [previewData, setPreviewData] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);

  const [createPayrollItem, { loading: createLoading }] = useMutation<any, any>(
    CREATE_PAYROLL_ITEM,
  );
  const [payrollItemPreview, { loading: previewLoading }] = useMutation<
    any,
    any
  >(PREVIEW_PAYROLL_ITEM);

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
      const res = await createPayrollItem({
        variables: {
          userId: Number(data.userId),
          payrollCycleId: Number(item?.payrollCycleId),
        },
      });

      if (res.data?.createPayrollItem?.success) {
        refetch?.();
        onClose();
      }
    } catch (error) {
      console.error("Error creating payroll item:", error);
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
    overtimeMinutes: item?.overtimeMinutes || "",
    paymentMethod: item?.paymentMethod || "bank_transfer",
    bankAccount: item?.bankAccount || "",
    notes: item?.notes || "",
    // components:
    //   item?.components?.map((c) => ({
    //     componentId: String(c.componentId),
    //     component: c.component,
    //     amount: c.amount,
    //     calculationBase: c.calculationBase,
    //     notes: c.notes,
    //   })) || [],
    // adjustments:
    //   item?.adjustments?.map((a) => ({
    //     type: a.type,
    //     description: a.description,
    //     amount: a.amount,
    //     isRecurring: a.isRecurring,
    //     notes: a.notes,
    //   })) || [],
  };

  console.log({ defaultValues });

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <PayrollItemFormFields
        employees={employees}
        components={components}
        actionType={actionType}
        payrollItemPreview={payrollItemPreview}
        previewData={previewData}
        setPreviewData={setPreviewData}
        previewLoading={previewLoading}
        payrollCycleId={Number(item?.payrollCycleId)}
        item={item}
      />
      <FormActionButton
        isPending={isPending || createLoading}
        cancelHandler={onClose}
      />
    </CustomForm>
  );
}

function PayrollItemFormFields({
  employees,
  actionType,
  payrollItemPreview,
  previewData,
  setPreviewData,
  previewLoading,
  payrollCycleId,
  item,
}: {
  employees: IUser[];
  components: IPayrollComponent[];
  actionType: "create" | "update";
  payrollItemPreview: any;
  previewData: any;
  setPreviewData: (data: any) => void;
  previewLoading: boolean;
  payrollCycleId: number;
  item?: IPayrollItem;
}) {
  const { watch } = useFormContext();

  const employeeOptions = employees.map((emp) => ({
    label: emp.profile?.fullName || emp.email,
    value: emp.id.toString(),
  }));

  const userId = watch("userId");
  const displayData = previewData || (actionType === "update" ? item : null);

  // Fetch preview when userId changes
  useEffect(() => {
    const fetchPreview = async () => {
      if (userId && actionType === "create") {
        try {
          const res = await payrollItemPreview({
            variables: {
              userId: Number(userId),
              payrollCycleId: payrollCycleId,
            },
          });
          if (res.data?.previewPayrollItem?.success) {
            setPreviewData(res.data.previewPayrollItem.data);
          }
        } catch (error) {
          console.error("Error fetching preview:", error);
        }
      } else {
        setPreviewData(null);
      }
    };

    fetchPreview();
  }, [userId, actionType, payrollCycleId, payrollItemPreview, setPreviewData]);

  return (
    <div className="space-y-4">
      {/* Employee Selection */}
      <div className="border border-primary/20 rounded-lg p-4">
        <h4 className="text-base font-semibold mb-3 text-primary">
          Select Employee
        </h4>
        <div className="grid grid-cols-1 gap-4">
          <CustomSelect
            dataAuto="userId"
            name="userId"
            label="Employee"
            placeholder="Select Employee to generate payroll preview"
            required={true}
            options={employeeOptions}
            isLoading={false}
            disabled={actionType === "update"}
          />
        </div>
      </div>

      {/* Preview Section */}
      <div className="border border-primary/20 rounded-lg p-4 min-h-[200px] flex flex-col">
        <h4 className="text-base font-semibold mb-4 text-primary flex items-center justify-between">
          Payroll Preview
          {previewLoading && (
            <span className="loading loading-spinner loading-sm text-primary"></span>
          )}
        </h4>

        {previewLoading ? (
          <div className="flex-1 flex flex-col gap-4 animate-pulse">
            <div className="h-20 bg-base-200 rounded-lg w-full"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-base-200 rounded-lg"></div>
              <div className="h-16 bg-base-200 rounded-lg"></div>
              <div className="h-16 bg-base-200 rounded-lg"></div>
            </div>
          </div>
        ) : displayData ? (
          <div className="space-y-6">
            {/* Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-base-200 rounded-lg">
                <p className="text-xs text-base-content/60 uppercase font-bold tracking-wider mb-1">
                  Basic Salary
                </p>
                <p className="text-lg font-black">
                  {displayData.basicSalary?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                <p className="text-xs text-success uppercase font-bold tracking-wider mb-1">
                  Gross Pay
                </p>
                <p className="text-lg font-black text-success">
                  {displayData.grossPay?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="p-3 bg-error/10 rounded-lg border border-error/20">
                <p className="text-xs text-error uppercase font-bold tracking-wider mb-1">
                  Deductions
                </p>
                <p className="text-lg font-black text-error">
                  {displayData.totalDeductions?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 shadow-md">
                <p className="text-xs text-primary uppercase font-bold tracking-wider mb-1">
                  Net Pay
                </p>
                <p className="text-xl font-black text-primary">
                  {displayData.netPay?.toLocaleString() || "0"}
                </p>
              </div>
            </div>

            {/* Attendance & Time */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-base-content/5">
              <div className="text-center">
                <p className="text-[10px] text-base-content/40 uppercase font-bold">
                  Working Days
                </p>
                <p className="font-bold">{displayData.workingDays || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-base-content/40 uppercase font-bold">
                  Present
                </p>
                <p className="font-bold text-success">
                  {displayData.presentDays || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-base-content/40 uppercase font-bold">
                  Absent
                </p>
                <p className="font-bold text-error">
                  {displayData.absentDays || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-base-content/40 uppercase font-bold">
                  Leave
                </p>
                <p className="font-bold text-warning">
                  {displayData.leaveDays || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-base-content/40 uppercase font-bold">
                  Overtime (Min)
                </p>
                <p className="font-bold">
                  {displayData.overtimeMinutes ||
                    displayData.overtimeHours ||
                    0}
                </p>
              </div>
            </div>

            {/* Components & Adjustments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-base-content/5">
              {/* Recurring Components */}
              <div className="space-y-3">
                <h5 className="text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Recurring Components
                </h5>
                <div className="bg-base-200/50 rounded-lg p-3 space-y-2 max-h-[200px] overflow-y-auto border border-base-content/5">
                  {(() => {
                    const comps =
                      displayData.payrollComponents ||
                      displayData.components ||
                      [];
                    return comps.length > 0 ? (
                      comps.map((pc: any, idx: number) => {
                        const component = pc.payrollComponent || pc.component;
                        const val = pc.value || pc.amount || 0;
                        return (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-sm border-b border-base-content/5 pb-1 last:border-0 hover:bg-base-300/30 transition-colors px-1"
                          >
                            <div className="flex flex-col">
                              <span className="text-base-content/70 font-medium">
                                {component?.name}
                              </span>
                              <span className="text-[10px] text-base-content/40 uppercase font-bold">
                                {component?.code}
                              </span>
                            </div>
                            <span
                              className={`font-mono font-bold ${component?.componentType === "EARNING" ? "text-success" : "text-error"}`}
                            >
                              {component?.componentType === "EARNING"
                                ? "+"
                                : "-"}
                              {val.toLocaleString()}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-base-content/40 italic py-4 text-center">
                        No recurring components
                      </p>
                    );
                  })()}
                </div>
              </div>

              {/* Variable Adjustments */}
              <div className="space-y-3">
                <h5 className="text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  Variable Adjustments (Selected Period)
                </h5>
                <div className="bg-base-200/50 rounded-lg p-3 space-y-2 max-h-[200px] overflow-y-auto border border-base-content/5">
                  {(() => {
                    const adjs =
                      displayData.payrollAdjustments ||
                      displayData.adjustments ||
                      [];
                    return adjs.length > 0 ? (
                      adjs.map((pa: any, idx: number) => {
                        const component = pa.payrollComponent || null;
                        const val = pa.value || pa.amount || 0;
                        const desc = pa.remarks || pa.description || "";
                        const name =
                          component?.name ||
                          pa.type?.replace("_", " ").toUpperCase() ||
                          "Adjustment";

                        return (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-sm border-b border-base-content/5 pb-1 last:border-0 hover:bg-base-300/30 transition-colors px-1"
                          >
                            <div className="flex flex-col">
                              <span className="text-base-content/70 font-medium">
                                {name}
                              </span>
                              {desc && (
                                <span className="text-[10px] text-base-content/40 truncate max-w-[140px] italic">
                                  {desc}
                                </span>
                              )}
                            </div>
                            <span
                              className={`font-mono font-bold ${component?.componentType === "EARNING" || !["penalty", "advance_deduction"].includes(pa.type) ? "text-success" : "text-error"}`}
                            >
                              {component?.componentType === "EARNING" ||
                              !["penalty", "advance_deduction"].includes(
                                pa.type,
                              )
                                ? "+"
                                : "-"}
                              {val.toLocaleString()}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-base-content/40 italic py-4 text-center">
                        No adjustments this period
                      </p>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-base-200/30 rounded-xl border-2 border-dashed border-base-content/10">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4 text-primary opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h5 className="font-bold text-base-content/70">
              No Employee Selected
            </h5>
            <p className="text-sm text-base-content/40 mt-1 max-w-[280px]">
              Select an employee from the list above to calculate and preview
              their payroll data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
