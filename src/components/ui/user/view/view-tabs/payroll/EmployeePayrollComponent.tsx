"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  GET_ACTIVE_EMPLOYEE_PAYROLL_COMPONENTS,
  EMPLOYEE_PAYROLL_COMPONENTS_HISTORY,
} from "@/graphql/employee-payroll-components.api";
import {
  IActiveEmployeePayrollComponentsResponse,
  IEmployeePayrollComponentHistoryResponse,
  CalculationType,
  TableColumnType,
  IEmployeePayrollComponent,
  TableActionType,
} from "@/types";
import CustomTable from "@/components/table/CustomTable";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  PiCheckCircle,
  PiClockCounterClockwise,
  PiInfo,
  PiPencil,
  PiPlusCircle,
} from "react-icons/pi";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import AssignPayrollComponentForm from "./AssignPayrollComponentForm";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

import PayrollComponentTypeBadge from "@/components/ui/payroll/PayrollComponentTypeBadge";
import CalculationTypeLabel from "@/components/ui/payroll/CalculationTypeLabel";
import PayrollComponentProperties from "@/components/ui/payroll/PayrollComponentProperties";

interface IEmployeePayrollComponentProps {
  userId: number;
}

export default function EmployeePayrollComponent({
  userId,
}: IEmployeePayrollComponentProps) {
  const { hasPermission } = usePermissionGuard();
  const { popupOption, setPopupOption } = usePopupOption();
  // ==================== QUERIES ====================
  const { data: activeData, loading: activeLoading } =
    useQuery<IActiveEmployeePayrollComponentsResponse>(
      GET_ACTIVE_EMPLOYEE_PAYROLL_COMPONENTS,
      {
        variables: { query: { userId: Number(userId) } },
      },
    );

  const { data: historyData, loading: historyLoading } =
    useQuery<IEmployeePayrollComponentHistoryResponse>(
      EMPLOYEE_PAYROLL_COMPONENTS_HISTORY,
      {
        variables: { query: { userId: Number(userId) } },
      },
    );

  // ==================== RENDER HELPERS ====================
  const formatComponentValue = (value: number, calcType: CalculationType) => {
    if (calcType === CalculationType.FIXED_AMOUNT) {
      return `$${value.toLocaleString()}`;
    }
    return `${value}%`;
  };

  // ==================== COLUMNS & ACTIONS ====================
  const activeColumns: TableColumnType[] = [
    {
      key: "name",
      header: "Component Name",
      accessorKey: "customName",
      show: true,
    },
    { key: "code", header: "Code", accessorKey: "customCode", show: true },
    { key: "type", header: "Type", accessorKey: "customType", show: true },
    {
      key: "value",
      header: "Assigned Value",
      accessorKey: "customValue",
      show: true,
    },
    {
      key: "validity",
      header: "Validity",
      accessorKey: "customValidity",
      show: true,
    },
    {
      key: "status",
      header: "Details",
      accessorKey: "customDetails",
      show: true,
    },
  ];

  const activeActions: TableActionType[] = [
    {
      name: "Edit",
      Icon: PiPencil,
      type: "button",
      handler: (row: IEmployeePayrollComponent) =>
        setPopupOption({
          open: true,
          actionType: "update",
          form: "assignPayroll" as any,
          data: row,
          title: "Update Payroll Component",
          closeOnDocumentClick: true,
        }),
      permissions: [Permissions.PayrollComponentUpdate],
      disabledOn: [],
    },
  ];

  const historyColumns: TableColumnType[] = [
    { key: "name", header: "Component", accessorKey: "customName", show: true },
    { key: "value", header: "Value", accessorKey: "customValue", show: true },
    {
      key: "period",
      header: "Period",
      accessorKey: "customPeriod",
      show: true,
    },
    {
      key: "assignedBy",
      header: "Assigned By",
      accessorKey: "customAssignedBy",
      show: true,
    },
    {
      key: "status",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
    },
  ];

  // ==================== STATE ====================
  const [activeCols, setActiveCols] =
    useState<TableColumnType[]>(activeColumns);
  const [historyCols, setHistoryCols] =
    useState<TableColumnType[]>(historyColumns);

  // ==================== DATA PREPARATION ====================
  const activeComponents =
    activeData?.activeEmployeePayrollComponents?.data || [];
  const history = historyData?.employeePayrollComponentHistory?.data || [];

  const activeDataSource = activeComponents.map((item) => ({
    ...item,
    customName: (
      <div className="flex flex-col">
        <span className="font-semibold">{item.component.name}</span>
        <span className="text-xs text-gray-500">
          <CalculationTypeLabel type={item.component.calculationType} />
        </span>
      </div>
    ),
    customCode: (
      <code className="text-xs bg-gray-100 px-1 rounded">
        {item.component.code}
      </code>
    ),
    customType: (
      <PayrollComponentTypeBadge
        type={item.component.componentType}
        size="sm"
      />
    ),
    customValue: (
      <div className="flex flex-col">
        <span className="font-bold text-primary">
          {formatComponentValue(item.value, item.component.calculationType)}
        </span>
        {item.isOverride && (
          <span className="text-[10px] text-warning font-semibold uppercase">
            Override
          </span>
        )}
      </div>
    ),
    customValidity: (
      <div className="text-xs">
        <p>From: {dayjs(item.effectiveFrom).format("MMM DD, YYYY")}</p>
        {item.effectiveTo && (
          <p>To: {dayjs(item.effectiveTo).format("MMM DD, YYYY")}</p>
        )}
      </div>
    ),
    customDetails: (
      <PayrollComponentProperties
        isTaxable={item.component.isTaxable}
        isStatutory={item.component.isStatutory}
        size="sm"
      />
    ),
  }));

  const historyDataSource = history.map((item) => ({
    ...item,
    customName: (
      <div className="flex flex-col">
        <span className="font-medium">{item.component.name}</span>
        <span className="text-[10px] text-gray-400">{item.component.code}</span>
      </div>
    ),
    customValue: formatComponentValue(
      item.value,
      item.component.calculationType,
    ),
    customPeriod: (
      <span className="text-xs">
        {dayjs(item.effectiveFrom).format("MM/YY")} -{" "}
        {item.effectiveTo ? dayjs(item.effectiveTo).format("MM/YY") : "Present"}
      </span>
    ),
    customAssignedBy: (
      <div className="flex flex-col text-xs">
        <span>{item.assignedByUser?.profile?.fullName || "System"}</span>
        <span className="text-[10px] text-gray-400">
          {dayjs(item.createdAt).format("MMM DD, YYYY")}
        </span>
      </div>
    ),
    customStatus: item.isActive ? (
      <span className="text-success flex items-center gap-1 text-xs">
        <PiCheckCircle /> Active
      </span>
    ) : (
      <span className="text-gray-400 text-xs">Inactive</span>
    ),
  }));

  // ==================== RENDER ====================
  if (activeLoading || historyLoading) return <CustomLoading />;

  return (
    <div className="space-y-10">
      {/* Active Components Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <PiCheckCircle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Active Payroll Components
              </h3>
              <p className="text-xs text-gray-500">
                Currently applicable earnings and deductions for this employee.
              </p>
            </div>
          </div>

          {hasPermission(Permissions.PayrollComponentUpdate) && (
            <button
              onClick={() =>
                setPopupOption({
                  open: true,
                  actionType: "create",
                  form: "assignPayroll" as any,
                  data: null,
                  title: "Assign Payroll Component",
                  closeOnDocumentClick: true,
                })
              }
              className="btn btn-primary btn-sm gap-2"
            >
              <PiPlusCircle size={16} />
              Assign Component
            </button>
          )}
        </div>

        {activeDataSource.length > 0 ? (
          <CustomTable
            columns={activeCols}
            setColumns={setActiveCols}
            dataSource={activeDataSource}
            isLoading={activeLoading}
            actions={activeActions}
            searchConfig={{
              searchable: false,
              debounceDelay: 500,
              defaultField: "name",
              searchableFields: [],
            }}
          />
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
            <PiInfo className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-500 font-medium">
              No active payroll components assigned.
            </p>
          </div>
        )}
      </section>

      {/* Assignment History Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
            <PiClockCounterClockwise size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Assignment History
            </h3>
            <p className="text-xs text-gray-500">
              Historical record of payroll component assignments and changes.
            </p>
          </div>
        </div>

        <CustomTable
          columns={historyCols}
          setColumns={setHistoryCols}
          dataSource={historyDataSource}
          isLoading={historyLoading}
          actions={[]}
          searchConfig={{
            searchable: false,
            debounceDelay: 500,
            defaultField: "name",
            searchableFields: [],
          }}
        />
      </section>

      {/* Assign Form Modal */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="500px"
      >
        {popupOption.form === "assignPayroll" && (
          <AssignPayrollComponentForm
            userId={userId}
            initialData={popupOption.data}
            onClose={() => setPopupOption({ ...popupOption, open: false })}
          />
        )}
      </CustomPopup>
    </div>
  );
}
