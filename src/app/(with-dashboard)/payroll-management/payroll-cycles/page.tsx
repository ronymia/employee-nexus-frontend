"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import CustomTable from "@/components/table/CustomTable";
import CustomLoading from "@/components/loader/CustomLoading";
import FormModal from "@/components/form/FormModal";
import {
  TableColumnType,
  IPayrollCycle,
  PayrollCycleStatus,
  PayrollFrequency,
} from "@/types";
import {
  PiPlusCircle,
  PiPencil,
  PiTrash,
  PiEye,
  PiCalendar,
  PiCurrencyDollar,
  PiUsers,
  PiCheckCircle,
  PiClock,
  PiFileText,
} from "react-icons/pi";
import {
  GET_PAYROLL_CYCLES,
  DELETE_PAYROLL_CYCLE,
} from "@/graphql/payroll-cycle.api";
import moment from "moment";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import PayrollCycleForm from "./PayrollCycleForm";
import { Permissions } from "@/constants/permissions.constant";

export default function PayrollCyclesPage() {
  const router = useRouter();
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

  const { popupOption, setPopupOption } = usePopupOption();
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

  const {
    data: cyclesData,
    loading,
    refetch,
  } = useQuery<{
    payrollCycles: {
      data: IPayrollCycle[];
    };
  }>(GET_PAYROLL_CYCLES, {
    variables: {
      query: {},
    },
  });

  const cycles = cyclesData?.payrollCycles?.data || [];

  const [deleteCycle, { loading: deleting }] = useMutation(
    DELETE_PAYROLL_CYCLE,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_PAYROLL_CYCLES, variables: { query: {} } }],
    }
  );

  const handleDelete = async () => {
    if (deleteModal.id) {
      try {
        await deleteCycle({
          variables: { id: deleteModal.id },
        });
        setDeleteModal({ open: false, id: null });
      } catch (error) {
        console.error("Error deleting cycle:", error);
      }
    }
  };

  const handleEdit = (cycle: IPayrollCycle) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "payrollCycle" as any,
      data: cycle,
      title: "Update Payroll Cycle",
    });
  };

  const handleView = (cycle: IPayrollCycle) => {
    router.push(`/payroll-management/payroll-cycles/${cycle.id}/view`);
  };

  const getStatusBadge = (status: PayrollCycleStatus) => {
    switch (status) {
      case PayrollCycleStatus.DRAFT:
        return (
          <span className="badge badge-ghost gap-1">
            <PiFileText size={14} />
            Draft
          </span>
        );
      case PayrollCycleStatus.PROCESSING:
        return (
          <span className="badge badge-warning gap-1">
            <PiClock size={14} />
            Processing
          </span>
        );
      case PayrollCycleStatus.APPROVED:
        return (
          <span className="badge badge-info gap-1">
            <PiCheckCircle size={14} />
            Approved
          </span>
        );
      case PayrollCycleStatus.PAID:
        return (
          <span className="badge badge-success gap-1">
            <PiCheckCircle size={14} />
            Paid
          </span>
        );
      case PayrollCycleStatus.CANCELLED:
        return (
          <span className="badge badge-error gap-1">
            <PiFileText size={14} />
            Cancelled
          </span>
        );
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
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

  const stats = {
    total: cycles.length,
    draft: cycles.filter((c) => c.status === PayrollCycleStatus.DRAFT).length,
    approved: cycles.filter((c) => c.status === PayrollCycleStatus.APPROVED)
      .length,
    paid: cycles.filter((c) => c.status === PayrollCycleStatus.PAID).length,
    totalNetPay: cycles.reduce((sum, c) => sum + c.totalNetPay, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Payroll Cycles
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Manage payroll processing cycles and runs
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Total Cycles</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <PiCalendar size={32} className="text-primary" />
          </div>
        </div>

        <div className="bg-base-300 border border-base-content/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Draft</p>
              <p className="text-2xl font-bold text-base-content">
                {stats.draft}
              </p>
            </div>
            <PiFileText size={32} className="text-base-content" />
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

        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Total Net Pay</p>
              <p className="text-2xl font-bold text-success">
                ${stats.totalNetPay.toFixed(0)}
              </p>
            </div>
            <PiCurrencyDollar size={32} className="text-success" />
          </div>
        </div>
      </div> */}

      {/* Cycles Table */}
      {loading ? (
        <CustomLoading />
      ) : (
        <CustomTable
          isLoading={loading}
          actions={[
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
              handler: (cycle: IPayrollCycle) =>
                setDeleteModal({ open: true, id: cycle.id }),
              Icon: PiTrash,
              permissions: [Permissions.DepartmentUpdate],
              disabledOn: [
                { accessorKey: "status", value: PayrollCycleStatus.PAID },
                { accessorKey: "status", value: PayrollCycleStatus.APPROVED },
              ],
            },
          ]}
          columns={columns}
          setColumns={setColumns}
          dataSource={cycles.map((row) => ({
            ...row,
            customFrequency: getFrequencyLabel(row.frequency),
            customPeriod: `${moment(row.periodStart).format(
              "MMM DD"
            )} - ${moment(row.periodEnd).format("MMM DD, YYYY")}`,
            customPaymentDate: moment(row.paymentDate).format("MMM DD, YYYY"),
            customNetPay: `$${row.totalNetPay.toFixed(2)}`,
            customStatus: getStatusBadge(row.status),
          }))}
          searchConfig={{
            searchable: true,
            debounceDelay: 500,
            defaultField: "name",
            searchableFields: [
              { label: "Cycle Name", value: "name" },
              { label: "Status", value: "status" },
            ],
          }}
        >
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
        </CustomTable>
      )}

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

      {/* Delete Confirmation Modal */}
      <FormModal
        popupOption={{
          open: deleteModal.open,
          closeOnDocumentClick: false,
          actionType: "delete",
          form: "payrollCycle" as any,
          data: null,
          title: "Delete Payroll Cycle",
          deleteHandler: handleDelete,
        }}
        setPopupOption={(value) => {
          if (typeof value === "function") {
            setDeleteModal((prev) => {
              const newPopup = value({
                open: prev.open,
                closeOnDocumentClick: false,
                actionType: "delete",
                form: "payrollCycle" as any,
                data: null,
                title: "Delete Payroll Cycle",
              });
              return { open: newPopup.open, id: prev.id };
            });
          } else {
            setDeleteModal({ open: value.open, id: deleteModal.id });
          }
        }}
      />
    </div>
  );
}
