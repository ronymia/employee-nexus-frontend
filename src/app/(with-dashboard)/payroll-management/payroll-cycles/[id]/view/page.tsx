"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";
import CustomTable from "@/components/table/CustomTable";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  TableColumnType,
  IPayrollItem,
  PayrollItemStatus,
  IPayrollCycleResponse,
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
  APPROVE_ALL_PAYROLL_ITEMS,
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
import { motion } from "motion/react";
import OverviewCard from "@/components/card/OverviewCard";
import {
  PiListChecks,
  PiHandCoins,
  PiTrendUp,
  PiWallet
} from "react-icons/pi";

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
  } = useQuery<IPayrollCycleResponse>(GET_PAYROLL_CYCLE_BY_ID, {
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

  const memoizedItems = useMemo(() => {
    return items.map((row) => ({
      ...row,
      customEmployeeName: row.user?.profile?.fullName || "N/A",
      customBasicSalary: `$${row.basicSalary.toLocaleString()}`,
      customGrossPay: `$${row.grossPay.toLocaleString()}`,
      customEarnings: `$${row?.payrollItemComponents?.reduce((acc, item) => acc + item.value, 0).toLocaleString()}`,
      customDeductions: `$${row.totalDeductions.toLocaleString()}`,
      customNetPay: `$${row.netPay.toLocaleString()}`,
      customStatus: <PayrollItemStatusBadge status={row.status} />,
    }));
  }, [items]);

  // Mutations
  const [deleteItem] = useMutation(DELETE_PAYROLL_ITEM);
  const [approveCycle] = useMutation(APPROVE_PAYROLL_CYCLE);
  const [processCycle] = useMutation(PROCESS_PAYROLL_CYCLE);
  const [approveItem] = useMutation(APPROVE_PAYROLL_ITEM);
  const [markItemPaid] = useMutation(MARK_PAYROLL_ITEM_PAID);
  const [approveAllItems] = useMutation(APPROVE_ALL_PAYROLL_ITEMS);

  const handleDeleteItem = async (item: IPayrollItem) => {
    await confirm({
      title: "Delete Payroll Item",
      message: `Are you sure you want to delete the payroll record for <strong>${item.user?.profile?.fullName}</strong>?`,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      icon: "warning",
      onConfirm: async () => {
        await deleteItem({
          variables: { id: item.id },
        });
        refetchItems();
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
        await approveCycle({
          variables: { approvePayrollCycleInput: { id: Number(cycleId) } },
        });
        refetchCycle();
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
        await processCycle({
          variables: { processPayrollCycleInput: { id: Number(cycleId) } },
        });
        refetchCycle();
        refetchItems();
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
        await approveItem({
          variables: { id: item.id },
        });
        refetchItems();
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
        await markItemPaid({
          variables: {
            payrollItemAsPaidInput: {
              id: item.id,
              transactionRef: transactionRef,
              paymentMethod: "bank_transfer",
              payrollCycleId: Number(cycleId),
            },
          },
        });
        refetchItems();
      },
      successTitle: "Paid!",
      successMessage: "Payroll item has been marked as paid.",
    });
  };

  const handleApproveAll = async () => {
    const pendingCount = items.filter(
      (i) => i.status === PayrollItemStatus.PENDING,
    ).length;

    if (pendingCount === 0) {
      toast.error("No pending items to approve");
      return;
    }

    await confirm({
      title: "Approve All Payroll Items",
      message: `Are you sure you want to approve all <strong>${pendingCount} pending</strong> payroll items in this cycle?`,
      confirmButtonText: "Approve All",
      confirmButtonColor: "#22c55e",
      icon: "success",
      onConfirm: async () => {
        await approveAllItems({
          variables: {
            input: {
              payrollCycleId: Number(cycleId),
            },
          },
        });
        refetchItems();
        refetchCycle();
      },
      successTitle: "Approved!",
      successMessage: `All ${pendingCount} pending payroll items have been approved successfully.`,
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
      header: "Earnings",
      accessorKey: "customEarnings",
      show: true,
    },
    {
      key: "5",
      header: "Deductions",
      accessorKey: "customDeductions",
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

  const stats = useMemo(() => {
    const totalItems = items.length;
    const pending = items.filter(
      (i) => i.status === PayrollItemStatus.PENDING,
    ).length;
    const approved = items.filter(
      (i) => i.status === PayrollItemStatus.APPROVED,
    ).length;
    const paid = items.filter(
      (i) => i.status === PayrollItemStatus.PAID,
    ).length;
    const totalGross = items.reduce((sum, i) => sum + i.grossPay, 0);
    const totalNet = items.reduce((sum, i) => sum + i.netPay, 0);

    return [
      {
        title: "Total Items",
        value: totalItems.toString(),
        Icon: PiListChecks,
        bgColor: "bg-[#e0f2ff]",
        decorationColor: "bg-[#bae0ff]",
        iconColor: "text-[#1a7bc7]",
        subText: "Total payroll records",
        description: "The total number of payroll items in this cycle.",
      },
      {
        title: "Pending",
        value: pending.toString(),
        Icon: PiClock,
        bgColor: "bg-[#fff7d6]",
        decorationColor: "bg-[#ffeea3]",
        iconColor: "text-[#b08800]",
        subText: `out of ${totalItems}`,
        description: "Payroll items waiting for approval.",
      },
      {
        title: "Approved",
        value: approved.toString(),
        Icon: PiCheckCircle,
        bgColor: "bg-[#e3f9eb]",
        decorationColor: "bg-[#bcf0cf]",
        iconColor: "text-[#1f8c54]",
        subText: `out of ${totalItems}`,
        description: "Payroll items approved and ready for payment.",
      },
      {
        title: "Paid",
        value: paid.toString(),
        Icon: PiHandCoins,
        bgColor: "bg-[#edebff]",
        decorationColor: "bg-[#d0c9ff]",
        iconColor: "text-[#5b4eb1]",
        subText: `out of ${totalItems}`,
        description: "Payroll items that have been marked as paid.",
      },
      {
        title: "Total Gross",
        value: `$${totalGross.toLocaleString()}`,
        Icon: PiWallet,
        bgColor: "bg-[#e0f2ff]",
        decorationColor: "bg-[#bae0ff]",
        iconColor: "text-[#1a7bc7]",
        subText: "Total before deductions",
        description: "The sum of all gross pay for this cycle.",
      },
      {
        title: "Total Net",
        value: `$${totalNet.toLocaleString()}`,
        Icon: PiTrendUp,
        bgColor: "bg-[#e3f9eb]",
        decorationColor: "bg-[#bcf0cf]",
        iconColor: "text-[#1f8c54]",
        subText: "Total after deductions",
        description: "The total amount to be paid to employees.",
      },
    ];
  }, [items]);

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
            <>
              <button
                className="btn btn-outline btn-success"
                onClick={handleApproveAll}
                disabled={
                  items.filter((i) => i.status === PayrollItemStatus.PENDING)
                    .length === 0
                }
              >
                <PiCheckCircle size={18} />
                Approve All Items
              </button>
              <button className="btn btn-success" onClick={handleApproveCycle}>
                Approve Cycle
              </button>
            </>
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
      <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <OverviewCard
              stat={stat}
              handler={undefined}
              isLoading={itemsLoading}
              position={stats.length - 1 === index ? "right" : "left"}
            />
          </motion.div>
        ))}
      </div>

      {/* Payroll Items Table */}
      <CustomTable
        isLoading={itemsLoading}
        actions={actions}
        columns={columns}
        setColumns={setColumns}
        dataSource={memoizedItems}
        searchConfig={{
          searchable: true,
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
