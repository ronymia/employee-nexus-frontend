"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import CustomTable from "@/components/table/CustomTable";
import {
  TableColumnType,
  IPayrollCycle,
  PayrollCycleStatus,
  PayrollFrequency,
  IPayrollCycleArrayResponse,
} from "@/types";
import { PiPlusCircle, PiTrash, PiEye } from "react-icons/pi";
import {
  GET_PAYROLL_CYCLES,
  DELETE_PAYROLL_CYCLE,
} from "@/graphql/payroll-cycle.api";
import { customFormatDate, FORMAT_PRESETS } from "@/utils/date-format.utils";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import PayrollCycleForm from "./PayrollCycleForm";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import useConfirmation from "@/hooks/useConfirmation";
import PageHeader from "@/components/ui/PageHeader";
import toast from "react-hot-toast";
import PayrollCycleStatusBadge from "@/components/ui/payroll/PayrollCycleStatusBadge";

export default function PayrollCyclesPage() {
  const { hasPermission } = usePermissionGuard();
  const { confirm } = useConfirmation();
  const router = useRouter();

  const { popupOption, setPopupOption } = usePopupOption();

  const {
    data: cyclesData,
    loading,
    refetch,
  } = useQuery<IPayrollCycleArrayResponse>(GET_PAYROLL_CYCLES, {
    variables: {
      query: {},
    },
  });

  const cycles = cyclesData?.payrollCycles?.data || [];

  const [deleteCycle] = useMutation(DELETE_PAYROLL_CYCLE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_PAYROLL_CYCLES, variables: { query: {} } }],
  });

  const handleDelete = async (cycle: IPayrollCycle) => {
    await confirm({
      title: "Delete Payroll Cycle",
      message: `Are you sure you want to delete <strong>${cycle.name}</strong>?`,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      icon: "warning",
      onConfirm: async () => {
        try {
          await deleteCycle({
            variables: { id: cycle.id },
          });
        } catch (error) {
          console.error("Error deleting cycle:", error);
          toast.error("Failed to delete payroll cycle");
        }
      },
      successTitle: "Deleted!",
      successMessage: "Payroll cycle deleted successfully",
    });
  };

  // const handleEdit = (cycle: IPayrollCycle) => {
  //   setPopupOption({
  //     open: true,
  //     closeOnDocumentClick: true,
  //     actionType: "update",
  //     form: "payrollCycle" as any,
  //     data: cycle,
  //     title: "Update Payroll Cycle",
  //   });
  // };

  const handleView = (cycle: IPayrollCycle) => {
    router.push(`/payroll-management/payroll-cycles/${cycle.id}/view`);
  };

  const getFrequencyLabel = (frequency: PayrollFrequency) => {
    switch (frequency) {
      case PayrollFrequency.WEEKLY:
        return "Weekly";
      case PayrollFrequency.BI_WEEKLY:
        return "Bi-Weekly";
      case PayrollFrequency.SEMI_MONTHLY:
        return "Semi-Monthly";
      case PayrollFrequency.MONTHLY:
        return "Monthly";
      default:
        return frequency;
    }
  };

  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Cycle Name",
      accessorKey: "name",
      show: true,
    },
    {
      key: "2",
      header: "Frequency",
      accessorKey: "customFrequency",
      show: true,
    },
    {
      key: "3",
      header: "Period",
      accessorKey: "customPeriod",
      show: true,
    },
    {
      key: "4",
      header: "Payment Date",
      accessorKey: "customPaymentDate",
      show: true,
    },
    {
      key: "5",
      header: "Employees",
      accessorKey: "totalEmployees",
      show: true,
    },
    {
      key: "6",
      header: "Net Pay",
      accessorKey: "customNetPay",
      show: true,
    },
    {
      key: "7",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
    },
  ]);

  const actions = [
    {
      name: "View",
      type: "button" as const,
      handler: handleView,
      Icon: PiEye,
      permissions: [Permissions.DepartmentUpdate],
      disabledOn: [],
    },
    // {
    //   name: "Edit",
    //   type: "button" as const,
    //   handler: handleEdit,
    //   Icon: PiPencil,
    //   permissions: [Permissions.DepartmentUpdate],
    //   disabledOn: [
    //     { accessorKey: "status", value: PayrollCycleStatus.PAID },
    //   ],
    // },
    {
      name: "Delete",
      type: "button" as const,
      handler: handleDelete,
      Icon: PiTrash,
      permissions: [Permissions.PayrollCycleDelete],
      disabledOn: [
        { accessorKey: "status", value: PayrollCycleStatus.PAID },
        { accessorKey: "status", value: PayrollCycleStatus.APPROVED },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Payroll Cycles"
        subtitle="Manage payroll processing cycles and runs"
      />

      {/* Cycles Table */}
      <CustomTable
        isLoading={loading}
        actions={actions}
        columns={columns}
        setColumns={setColumns}
        dataSource={cycles.map((row) => ({
          ...row,
          customFrequency: getFrequencyLabel(row.frequency),
          customPeriod: `${customFormatDate(row.periodStart, FORMAT_PRESETS.SHORT_DATE)} - ${customFormatDate(row.periodEnd)}`,
          customPaymentDate: customFormatDate(row.paymentDate),
          customNetPay: `$${row.totalNetPay.toFixed(2)}`,
          customStatus: <PayrollCycleStatusBadge status={row.status} />,
        }))}
        searchConfig={{
          searchable: false,
          debounceDelay: 500,
          defaultField: "name",
          searchableFields: [
            { label: "Cycle Name", value: "name" },
            { label: "Status", value: "status" },
          ],
        }}
      >
        {hasPermission(Permissions.PayrollCycleCreate) ? (
          <button
            className="btn btn-primary gap-2"
            onClick={() =>
              setPopupOption({
                open: true,
                closeOnDocumentClick: true,
                actionType: "create",
                form: "payrollCycle" as any,
                data: null,
                title: "Create Payroll Cycle",
              })
            }
          >
            <PiPlusCircle size={18} />
            Add Cycle
          </button>
        ) : null}
      </CustomTable>

      {/* Cycle Form Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        {popupOption.form === ("payrollCycle" as any) && (
          <PayrollCycleForm
            cycle={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={() =>
              setPopupOption({
                ...popupOption,
                open: false,
              })
            }
            refetch={refetch}
          />
        )}
      </CustomPopup>
    </div>
  );
}
