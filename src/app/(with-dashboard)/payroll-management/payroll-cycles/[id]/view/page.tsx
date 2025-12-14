"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";
import CustomTable from "@/components/table/CustomTable";
import CustomLoading from "@/components/loader/CustomLoading";
import FormModal from "@/components/form/FormModal";
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
  PiXCircle,
  PiWarning,
} from "react-icons/pi";
import {
  GET_PAYROLL_CYCLE_BY_ID,
  DELETE_PAYROLL_CYCLE,
  APPROVE_PAYROLL_CYCLE,
  PROCESS_PAYROLL_CYCLE,
} from "@/graphql/payroll-cycle.api";
import {
  GET_PAYROLL_ITEMS,
  DELETE_PAYROLL_ITEM,
  APPROVE_PAYROLL_ITEM,
  MARK_PAYROLL_ITEM_PAID,
} from "@/graphql/payroll-item.api";
import moment from "moment";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import PayrollItemForm from "./PayrollItemForm";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import PayslipWrapper from "@/components/payroll/PayslipWrapper";

export default function PayrollCycleDetailPage() {
  const { hasPermission } = usePermissionGuard();
  const params = useParams();
  const cycleId = params.id as string;

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

  const { popupOption, setPopupOption } = usePopupOption();
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number | null;
    type: "cycle" | "item";
  }>({ open: false, id: null, type: "item" });

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
  const [deleteCycle] = useMutation(DELETE_PAYROLL_CYCLE);
  const [deleteItem] = useMutation(DELETE_PAYROLL_ITEM);
  const [approveCycle] = useMutation(APPROVE_PAYROLL_CYCLE);
  const [processCycle] = useMutation(PROCESS_PAYROLL_CYCLE);
  const [approveItem] = useMutation(APPROVE_PAYROLL_ITEM);
  const [markItemPaid] = useMutation(MARK_PAYROLL_ITEM_PAID);

  const handleDelete = async () => {
    if (deleteModal.type === "cycle") {
      try {
        await deleteCycle({
          variables: { id: deleteModal.id },
        });
        // Navigate back or show success
      } catch (error) {
        console.error("Error deleting cycle:", error);
      }
    } else {
      try {
        await deleteItem({
          variables: { id: deleteModal.id },
        });
        refetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
    setDeleteModal({ open: false, id: null, type: "item" });
  };

  const handleApproveCycle = async () => {
    try {
      await approveCycle({
        variables: { approvePayrollCycleInput: { id: Number(cycleId) } },
      });
      refetchCycle();
    } catch (error) {
      console.error("Error approving cycle:", error);
    }
  };

  const handleProcessCycle = async () => {
    try {
      await processCycle({
        variables: { processPayrollCycleInput: { id: Number(cycleId) } },
      });
      refetchCycle();
      refetchItems();
    } catch (error) {
      console.error("Error processing cycle:", error);
    }
  };

  const handleApproveItem = async (item: IPayrollItem) => {
    try {
      await approveItem({
        variables: { id: item.id },
      });
      refetchItems();
    } catch (error) {
      console.error("Error approving item:", error);
    }
  };

  const handleMarkPaid = async (item: IPayrollItem) => {
    const transactionRef = prompt("Enter transaction reference:");
    if (transactionRef) {
      try {
        await markItemPaid({
          variables: {
            id: item.id,
            transactionRef: transactionRef,
            paymentMethod: "bank_transfer",
          },
        });
        refetchItems();
      } catch (error) {
        console.error("Error marking as paid:", error);
      }
    }
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

  const getStatusBadge = (status: PayrollItemStatus) => {
    switch (status) {
      case PayrollItemStatus.PENDING:
        return (
          <span className="badge badge-warning gap-1">
            <PiClock size={14} />
            Pending
          </span>
        );
      case PayrollItemStatus.APPROVED:
        return (
          <span className="badge badge-info gap-1">
            <PiCheckCircle size={14} />
            Approved
          </span>
        );
      case PayrollItemStatus.PAID:
        return (
          <span className="badge badge-success gap-1">
            <PiCheckCircle size={14} />
            Paid
          </span>
        );
      case PayrollItemStatus.ON_HOLD:
        return (
          <span className="badge badge-ghost gap-1">
            <PiWarning size={14} />
            On Hold
          </span>
        );
      case PayrollItemStatus.CANCELLED:
        return (
          <span className="badge badge-error gap-1">
            <PiXCircle size={14} />
            Cancelled
          </span>
        );
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

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
            {moment(cycle.periodStart).format("MMM DD, YYYY")} -{" "}
            {moment(cycle.periodEnd).format("MMM DD, YYYY")}
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
            <p className="font-semibold">{cycle.status}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/60">Frequency</p>
            <p className="font-semibold">{cycle.frequency}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/60">Payment Date</p>
            <p className="font-semibold">
              {moment(cycle.paymentDate).format("MMM DD, YYYY")}
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
      {itemsLoading ? (
        <CustomLoading />
      ) : (
        <CustomTable
          isLoading={itemsLoading}
          actions={[
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
              disabledOn: [
                { accessorKey: "status", value: PayrollItemStatus.PAID },
              ],
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
              disabledOn: [
                { accessorKey: "status", value: PayrollItemStatus.PAID },
              ],
            },
            {
              name: "Delete",
              type: "button" as const,
              handler: (item: IPayrollItem) =>
                setDeleteModal({ open: true, id: item.id, type: "item" }),
              Icon: PiTrash,
              permissions: [Permissions.PayrollItemUpdate],
              disabledOn: [
                { accessorKey: "status", value: PayrollItemStatus.PAID },
              ],
            },
          ]}
          columns={columns}
          setColumns={setColumns}
          dataSource={items.map((row) => ({
            ...row,
            customEmployeeName: row.user?.profile?.fullName || "N/A",
            customBasicSalary: `$${row.basicSalary.toFixed(2)}`,
            customGrossPay: `$${row.grossPay.toFixed(2)}`,
            customDeductions: `$${row.totalDeductions.toFixed(2)}`,
            customNetPay: `$${row.netPay.toFixed(2)}`,
            customStatus: getStatusBadge(row.status),
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
      )}

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

      {/* Delete Confirmation Modal */}
      <FormModal
        popupOption={{
          open: deleteModal.open,
          closeOnDocumentClick: false,
          actionType: "delete",
          form:
            deleteModal.type === "cycle"
              ? "payrollCycle"
              : ("payrollItem" as any),
          data: null,
          title: `Delete ${
            deleteModal.type === "cycle" ? "Payroll Cycle" : "Payroll Item"
          }`,
          deleteHandler: handleDelete,
        }}
        setPopupOption={(value) => {
          if (typeof value === "function") {
            setDeleteModal((prev) => {
              const newPopup = value({
                open: prev.open,
                closeOnDocumentClick: false,
                actionType: "delete",
                form:
                  deleteModal.type === "cycle"
                    ? "payrollCycle"
                    : ("payrollItem" as any),
                data: null,
                title: `Delete ${
                  prev.type === "cycle" ? "Payroll Cycle" : "Payroll Item"
                }`,
              });
              return { open: newPopup.open, id: prev.id, type: prev.type };
            });
          } else {
            setDeleteModal({
              open: value.open,
              id: deleteModal.id,
              type: deleteModal.type,
            });
          }
        }}
      />
    </div>
  );
}
