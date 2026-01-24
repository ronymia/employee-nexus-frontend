"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";
import CustomTable from "@/components/table/CustomTable";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  TableColumnType,
  IPayrollItem,
  IPayrollCycle,
  PayrollItemStatus,
} from "@/types";
import {
  PiPlusCircle,
  PiPencil,
  PiTrash,
  PiEye,
  PiCheckCircle,
  PiCurrencyDollar,
  PiClock,
} from "react-icons/pi";
import {
  GET_PAYROLL_CYCLE_BY_ID,
  APPROVE_PAYROLL_CYCLE,
  PROCESS_PAYROLL_CYCLE,
} from "@/graphql/payroll-cycle.api";
import {
  GET_PAYROLL_ITEMS,
  DELETE_PAYROLL_ITEM,
  APPROVE_PAYROLL_ITEM,
  MARK_PAYROLL_ITEM_PAID,
} from "@/graphql/payroll-item.api";
import dayjs from "dayjs";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import PayrollItemForm from "./PayrollItemForm";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import PayslipWrapper from "@/components/payroll/PayslipWrapper";
import useConfirmation from "@/hooks/useConfirmation";
import toast from "react-hot-toast";
import PayrollCycleStatusBadge from "@/components/ui/payroll/PayrollCycleStatusBadge";
import PayrollItemStatusBadge from "@/components/ui/payroll/PayrollItemStatusBadge";

export default function PayrollCycleDetailPage() {
  const { hasPermission } = usePermissionGuard();
  const { confirm } = useConfirmation();
  const params = useParams();
  const cycleId = params.id as string;

  const { popupOption, setPopupOption } = usePopupOption();

  // Fetch cycle details
  const {
    data: cycleData,
    loading: cycleLoading,
    refetch: refetchCycle,
  } = useQuery<{
    payrollCycleById: {
      data: IPayrollCycle;
    };
  }>(GET_PAYROLL_CYCLE_BY_ID, {
    variables: { id: Number(cycleId) },
  });

  // Fetch payroll items
  const {
    data: itemsData,
    loading: itemsLoading,
    refetch: refetchItems,
  } = useQuery<{
    payrollItems: {
      data: IPayrollItem[];
    };
  }>(GET_PAYROLL_ITEMS, {
    variables: {
      query: {
        payrollCycleId: Number(cycleId),
      },
    },
  });

  const cycle = cycleData?.payrollCycleById?.data;
  const items = itemsData?.payrollItems?.data || [];

  // Mutations
  const [deleteItem] = useMutation(DELETE_PAYROLL_ITEM);
  const [approveCycle] = useMutation(APPROVE_PAYROLL_CYCLE);
  const [processCycle] = useMutation(PROCESS_PAYROLL_CYCLE);
  const [approveItem] = useMutation(APPROVE_PAYROLL_ITEM);
  const [markItemPaid] = useMutation(MARK_PAYROLL_ITEM_PAID);

  const handleDeleteItem = async (item: IPayrollItem) => {
    await confirm({
      title: "Delete Payroll Item",
      message: `Are you sure you want to delete the payroll record for <strong>${item.user?.profile?.fullName}</strong>?`,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      icon: "warning",
      onConfirm: async () => {
        try {
          await deleteItem({
            variables: { id: item.id },
          });
          refetchItems();
        } catch (error) {
          console.error("Error deleting item:", error);
          toast.error("Failed to delete payroll item");
        }
      },
      successTitle: "Deleted!",
      successMessage: "Payroll item deleted successfully",
    });
  };

  const handleApproveCycle = async () => {
    await confirm({
      title: "Approve Payroll Cycle",
      message:
        "Are you sure you want to approve this payroll cycle? This will allow payments to be processed.",
      confirmButtonText: "Approve",
      confirmButtonColor: "#22c55e",
      icon: "success",
      onConfirm: async () => {
        try {
          await approveCycle({
            variables: { approvePayrollCycleInput: { id: Number(cycleId) } },
          });
          refetchCycle();
        } catch (error: any) {
          console.error("Error approving cycle:", error);
          throw error;
        }
      },
      successTitle: "Approved!",
      successMessage: "Payroll cycle has been approved successfully.",
    });
  };

  const handleProcessCycle = async () => {
    await confirm({
      title: "Process Payroll Cycle",
      message:
        "Are you sure you want to process this payroll cycle? This will generate payroll items for all eligible employees.",
      confirmButtonText: "Process",
      confirmButtonColor: "#3b82f6",
      icon: "info",
      onConfirm: async () => {
        try {
          await processCycle({
            variables: { processPayrollCycleInput: { id: Number(cycleId) } },
          });
          refetchCycle();
          refetchItems();
        } catch (error: any) {
          console.error("Error processing cycle:", error);
          throw error;
        }
      },
      successTitle: "Processed!",
      successMessage: "Payroll cycle has been processed successfully.",
    });
  };

  const handleApproveItem = async (item: IPayrollItem) => {
    await confirm({
      title: "Approve Payroll Item",
      message: `Are you sure you want to approve the payroll item for <strong>${item.user?.profile?.fullName}</strong>?`,
      confirmButtonText: "Approve",
      confirmButtonColor: "#22c55e",
      icon: "success",
      onConfirm: async () => {
        try {
          await approveItem({
            variables: { id: item.id },
          });
          refetchItems();
        } catch (error: any) {
          console.error("Error approving item:", error);
          throw error;
        }
      },
      successTitle: "Approved!",
      successMessage: "Payroll item has been approved successfully.",
    });
  };

  const handleMarkPaid = async (item: IPayrollItem) => {
    await confirm({
      title: "Mark as Paid",
      message: `Enter the transaction reference for <strong>${item.user?.profile?.fullName}</strong>.`,
      confirmButtonText: "Confirm Payment",
      confirmButtonColor: "#22c55e",
      icon: "question",
      input: "text",
      inputPlaceholder: "Transaction Reference (e.g. TXN123456)",
      inputRequired: true,
      onConfirm: async (transactionRef) => {
        try {
          await markItemPaid({
            variables: {
              id: item.id,
              transactionRef: transactionRef,
              paymentMethod: "bank_transfer",
            },
          });
          refetchItems();
        } catch (error: any) {
          console.error("Error marking as paid:", error);
          throw error;
        }
      },
      successTitle: "Paid!",
      successMessage: "Payroll item has been marked as paid.",
    });
  };

  const handleEdit = (item: IPayrollItem) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "payrollItem" as any,
      data: item,
      title: "Update Payroll Item",
    });
  };

  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Employee",
      accessorKey: "customEmployeeName",
      show: true,
    },
    {
      key: "2",
      header: "Basic Salary",
      accessorKey: "customBasicSalary",
      show: true,
    },
    {
      key: "3",
      header: "Gross Pay",
      accessorKey: "customGrossPay",
      show: true,
    },
    {
      key: "4",
      header: "Deductions",
      accessorKey: "customDeductions",
      show: true,
    },
    {
      key: "5",
      header: "Net Pay",
      accessorKey: "customNetPay",
      show: true,
    },
    {
      key: "6",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
    },
  ]);

  const actions = [
    {
      name: "View Payslip",
      type: "button" as const,
      handler: (item: IPayrollItem) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: false,
          actionType: "view",
          form: "payslip" as any,
          data: item,
          title: "Employee Payslip",
        });
      },
      Icon: PiEye,
      permissions: [Permissions.PayrollItemRead],
      disabledOn: [],
    },
    {
      name: "Edit",
      type: "button" as const,
      handler: handleEdit,
      Icon: PiPencil,
      permissions: [Permissions.PayrollItemUpdate],
      disabledOn: [{ accessorKey: "status", value: PayrollItemStatus.PAID }],
    },
    {
      name: "Approve",
      type: "button" as const,
      handler: handleApproveItem,
      Icon: PiCheckCircle,
      permissions: [Permissions.PayrollItemUpdate],
      disabledOn: [
        { accessorKey: "status", value: PayrollItemStatus.APPROVED },
        { accessorKey: "status", value: PayrollItemStatus.PAID },
      ],
    },
    {
      name: "Mark Paid",
      type: "button" as const,
      handler: handleMarkPaid,
      Icon: PiCurrencyDollar,
      permissions: [Permissions.PayrollItemUpdate],
      disabledOn: [{ accessorKey: "status", value: PayrollItemStatus.PAID }],
    },
    {
      name: "Delete",
      type: "button" as const,
      handler: handleDeleteItem,
      Icon: PiTrash,
      permissions: [Permissions.PayrollItemUpdate],
      disabledOn: [{ accessorKey: "status", value: PayrollItemStatus.PAID }],
    },
  ];

  const stats = {
    totalItems: items.length,
    pending: items.filter((i) => i.status === PayrollItemStatus.PENDING).length,
    approved: items.filter((i) => i.status === PayrollItemStatus.APPROVED)
      .length,
    paid: items.filter((i) => i.status === PayrollItemStatus.PAID).length,
    totalGross: items.reduce((sum, i) => sum + i.grossPay, 0),
    totalDeductions: items.reduce((sum, i) => sum + i.totalDeductions, 0),
    totalNet: items.reduce((sum, i) => sum + i.netPay, 0),
  };

  if (cycleLoading) {
    return <CustomLoading />;
  }

  if (!cycle) {
    return <div>Cycle not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">{cycle.name}</h1>
          <p className="text-sm text-base-content/60 mt-1">
            {dayjs(cycle.periodStart).format("MMM DD, YYYY")} -{" "}
            {dayjs(cycle.periodEnd).format("MMM DD, YYYY")}
          </p>
        </div>
        <div className="flex gap-2">
          {cycle.status === "DRAFT" && (
            <button className="btn btn-primary" onClick={handleProcessCycle}>
              Process Payroll
            </button>
          )}
          {cycle.status === "PROCESSING" && (
            <button className="btn btn-success" onClick={handleApproveCycle}>
              Approve Cycle
            </button>
          )}
        </div>
      </div>

      {/* Cycle Info */}
      <div className="bg-base-200 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-base-content/60">Status</p>
            <PayrollCycleStatusBadge status={cycle.status} />
          </div>
          <div>
            <p className="text-sm text-base-content/60">Frequency</p>
            <p className="font-semibold">{cycle.frequency}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/60">Payment Date</p>
            <p className="font-semibold">
              {dayjs(cycle.paymentDate).format("MMM DD, YYYY")}
            </p>
          </div>
          <div>
            <p className="text-sm text-base-content/60">Total Employees</p>
            <p className="font-semibold">{cycle.totalEmployees}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Total Items</p>
              <p className="text-2xl font-bold text-primary">
                {stats.totalItems}
              </p>
            </div>
            <PiCurrencyDollar size={32} className="text-primary" />
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Pending</p>
              <p className="text-2xl font-bold text-warning">{stats.pending}</p>
            </div>
            <PiClock size={32} className="text-warning" />
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Approved</p>
              <p className="text-2xl font-bold text-info">{stats.approved}</p>
            </div>
            <PiCheckCircle size={32} className="text-info" />
          </div>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Paid</p>
              <p className="text-2xl font-bold text-success">{stats.paid}</p>
            </div>
            <PiCheckCircle size={32} className="text-success" />
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Total Gross</p>
              <p className="text-2xl font-bold text-blue-500">
                ${stats.totalGross.toFixed(0)}
              </p>
            </div>
            <PiCurrencyDollar size={32} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Total Net</p>
              <p className="text-2xl font-bold text-green-500">
                ${stats.totalNet.toFixed(0)}
              </p>
            </div>
            <PiCurrencyDollar size={32} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Payroll Items Table */}
      <CustomTable
        isLoading={itemsLoading}
        actions={actions}
        columns={columns}
        setColumns={setColumns}
        dataSource={items.map((row) => ({
          ...row,
          customEmployeeName: row.user?.profile?.fullName || "N/A",
          customBasicSalary: `$${row.basicSalary.toFixed(2)}`,
          customGrossPay: `$${row.grossPay.toFixed(2)}`,
          customDeductions: `$${row.totalDeductions.toFixed(2)}`,
          customNetPay: `$${row.netPay.toFixed(2)}`,
          customStatus: <PayrollItemStatusBadge status={row.status} />,
        }))}
        searchConfig={{
          searchable: false,
          debounceDelay: 500,
          defaultField: "customEmployeeName",
          searchableFields: [
            { label: "Employee Name", value: "customEmployeeName" },
            { label: "Status", value: "status" },
          ],
        }}
      >
        {hasPermission(Permissions.PayrollItemCreate) ? (
          <button
            className="btn btn-primary gap-2"
            onClick={() =>
              setPopupOption({
                open: true,
                closeOnDocumentClick: true,
                actionType: "create",
                form: "payrollItem" as any,
                data: { payrollCycleId: Number(cycleId) },
                title: "Add Payroll Item",
              })
            }
          >
            <PiPlusCircle size={18} />
            Add Employee
          </button>
        ) : null}
      </CustomTable>

      {/* Item Form Modal */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth={popupOption.form === ("payslip" as any) ? "50%" : "95%"}
      >
        {popupOption.form === ("payrollItem" as any) && (
          <PayrollItemForm
            item={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={() =>
              setPopupOption({
                ...popupOption,
                open: false,
              })
            }
            refetch={refetchItems}
          />
        )}
        {popupOption.form === ("payslip" as any) && (
          <PayslipWrapper
            item={popupOption.data}
            onClose={() =>
              setPopupOption({
                ...popupOption,
                open: false,
              })
            }
          />
        )}
      </CustomPopup>
    </div>
  );
}
