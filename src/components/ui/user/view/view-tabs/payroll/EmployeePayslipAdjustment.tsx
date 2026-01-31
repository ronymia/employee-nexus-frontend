"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_PAYSLIP_ADJUSTMENTS,
  APPROVE_PAYSLIP_ADJUSTMENT,
  REJECT_PAYSLIP_ADJUSTMENT,
} from "@/graphql/payslip-adjustment.api";
import {
  TableColumnType,
  IPayslipAdjustment,
  TableActionType,
  IPayslipAdjustmentsResponse,
} from "@/types";
import CustomTable from "@/components/table/CustomTable";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  PiCheckCircle,
  PiClock,
  PiInfo,
  PiPencil,
  PiPlusCircle,
  PiXCircle,
} from "react-icons/pi";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import PayslipAdjustmentForm from "./PayslipAdjustmentForm";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import useConfirmation from "@/hooks/useConfirmation";

interface IEmployeePayslipAdjustmentProps {
  userId: number;
}

export default function EmployeePayslipAdjustment({
  userId,
}: IEmployeePayslipAdjustmentProps) {
  const { hasPermission } = usePermissionGuard();
  const { popupOption, setPopupOption } = usePopupOption();
  const { confirm } = useConfirmation();

  // ==================== QUERIES ====================
  const { data, loading, refetch } = useQuery<IPayslipAdjustmentsResponse>(
    GET_PAYSLIP_ADJUSTMENTS,
    {
      variables: { query: { userId: Number(userId) } },
    },
  );

  // ==================== MUTATIONS ====================
  const [approveAdjustment] = useMutation(APPROVE_PAYSLIP_ADJUSTMENT, {
    onCompleted: (data: any) => {
      if (data.approveRejectPayslipAdjustment?.success) {
        toast.success("Adjustment approved");
        refetch();
      } else {
        toast.error(
          data.approveRejectPayslipAdjustment?.message || "Failed to approve",
        );
      }
    },
  });

  const [rejectAdjustment] = useMutation(REJECT_PAYSLIP_ADJUSTMENT, {
    onCompleted: (data: any) => {
      if (data.approveRejectPayslipAdjustment?.success) {
        toast.success("Adjustment rejected");
        refetch();
      } else {
        toast.error(
          data.approveRejectPayslipAdjustment?.message || "Failed to reject",
        );
      }
    },
  });

  // ==================== HANDLERS ====================
  const handleApprove = (row: IPayslipAdjustment) => {
    confirm({
      title: "Approve Adjustment",
      message: "Are you sure you want to approve this adjustment?",
      icon: "question",
      confirmButtonText: "Yes, Approve",
      onConfirm: async () => {
        await approveAdjustment({
          variables: {
            approveRejectPayslipAdjustmentInput: {
              id: row.id,
              status: "APPROVED",
            },
          },
        });
      },
    });
  };

  const handleReject = (row: IPayslipAdjustment) => {
    confirm({
      title: "Reject Adjustment",
      message: "Please provide a reason for rejection",
      icon: "warning",
      confirmButtonText: "Reject",
      showSuccessToast: true,
      inputRequired: true,
      onConfirm: async (notes: string) => {
        await rejectAdjustment({
          variables: {
            approveRejectPayslipAdjustmentInput: {
              id: row.id,
              status: "REJECTED",
              notes,
            },
          },
        });
      },
    });
  };

  // ==================== COLUMNS & ACTIONS ====================
  const columns: TableColumnType[] = [
    {
      key: "component",
      header: "Component",
      accessorKey: "customComponent",
      show: true,
    },
    { key: "value", header: "Value", accessorKey: "customValue", show: true },
    { key: "month", header: "Month", accessorKey: "customMonth", show: true },
    {
      key: "status",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
    },
    {
      key: "request",
      header: "Request Details",
      accessorKey: "customRequest",
      show: true,
    },
  ];

  const actions: TableActionType[] = [
    {
      name: "Edit",
      Icon: PiPencil,
      type: "button",
      handler: (row: IPayslipAdjustment) =>
        setPopupOption({
          open: true,
          actionType: "update",
          form: "payslipAdjustment" as any,
          data: row,
          title: "Update Adjustment",
          closeOnDocumentClick: true,
        }),
      permissions: [Permissions.PayrollAdjustmentUpdate],
      disabledOn: [
        { accessorKey: "status", value: "APPLIED" },
        { accessorKey: "status", value: "APPROVED" },
        { accessorKey: "status", value: "REJECTED" },
      ],
    },
    {
      name: "Approve",
      Icon: PiCheckCircle,
      type: "button",
      handler: handleApprove,
      permissions: [Permissions.PayrollAdjustmentApprove],
      disabledOn: [
        { accessorKey: "status", value: "APPLIED" },
        // { accessorKey: "status", value: "APPROVED" },
        { accessorKey: "status", value: "REJECTED" },
      ],
    },
    {
      name: "Reject",
      Icon: PiXCircle,
      type: "button",
      handler: handleReject,
      permissions: [Permissions.PayrollAdjustmentApprove],
      disabledOn: [
        { accessorKey: "status", value: "APPLIED" },
        { accessorKey: "status", value: "APPROVED" },
        // { accessorKey: "status", value: "REJECTED" },
      ],
    },
  ];

  const [activeCols, setActiveCols] = useState<TableColumnType[]>(columns);

  // ==================== DATA PREPARATION ====================
  const adjustments = data?.payslipAdjustments?.data || [];

  const dataSource = adjustments.map((item) => ({
    ...item,
    customComponent: (
      <div className="flex flex-col">
        <span className="font-semibold">
          {item.payrollComponent?.name || "Unknown"}
        </span>
        <span className="text-[10px] text-gray-500 font-mono uppercase bg-gray-100 px-1 inline-block w-fit rounded">
          {item.payrollComponent?.code || "N/A"}
        </span>
      </div>
    ),
    customValue: (
      <span className="font-bold text-primary">
        ${item.value.toLocaleString()}
      </span>
    ),
    customMonth: (
      <span className="text-secondary font-medium">
        {item.appliedMonth
          ? dayjs(item.appliedMonth).format("MMM YYYY")
          : "Next Payroll"}
      </span>
    ),
    customStatus: (
      <div className="flex items-center gap-1.5 min-w-[100px]">
        {item.status === "PENDING" && (
          <span className="badge badge-warning flex items-center gap-1">
            <PiClock /> Pending
          </span>
        )}
        {item.status === "APPROVED" && (
          <span className="badge badge-success flex items-center gap-1">
            <PiCheckCircle /> Approved
          </span>
        )}
        {item.status === "REJECTED" && (
          <span className="badge badge-danger flex items-center gap-1">
            <PiXCircle /> Rejected
          </span>
        )}
      </div>
    ),
    customRequest: (
      <div className="flex flex-col text-xs text-gray-500">
        <span>By: {item.requestedByUser?.profile?.fullName || "System"}</span>
        <span>On: {dayjs(item.createdAt).format("MMM DD, YYYY")}</span>
      </div>
    ),
  }));

  // ==================== RENDER ====================
  if (loading) return <CustomLoading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <PiPlusCircle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Payslip Adjustments
            </h3>
            <p className="text-xs text-gray-500">
              One-time adjustments for the next or specific payroll cycle.
            </p>
          </div>
        </div>

        {hasPermission(Permissions.AssetCreate) && (
          <button
            onClick={() =>
              setPopupOption({
                open: true,
                actionType: "create",
                form: "payslipAdjustment" as any,
                data: null,
                title: "Add Payslip Adjustment",
                closeOnDocumentClick: true,
              })
            }
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlusCircle size={16} />
            Add Adjustment
          </button>
        )}
      </div>

      {dataSource.length > 0 ? (
        <CustomTable
          columns={activeCols}
          setColumns={setActiveCols}
          dataSource={dataSource}
          isLoading={loading}
          actions={actions}
          searchConfig={{
            searchable: true,
            debounceDelay: 500,
            defaultField: "customComponent",
            searchableFields: [
              { label: "Remarks", value: "remarks" },
              { label: "Component", value: "payrollComponent.name" },
            ],
          }}
        />
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
          <PiInfo className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-500 font-medium">
            No payslip adjustments found.
          </p>
        </div>
      )}

      {/* Adjustment Form Modal */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="600px"
      >
        {popupOption.form === ("payslipAdjustment" as any) && (
          <PayslipAdjustmentForm
            userId={userId}
            initialData={popupOption.data}
            onClose={() => setPopupOption({ ...popupOption, open: false })}
          />
        )}
      </CustomPopup>
    </div>
  );
}
