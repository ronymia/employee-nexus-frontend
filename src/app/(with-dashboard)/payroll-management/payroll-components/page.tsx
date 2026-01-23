"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import CustomTable from "@/components/table/CustomTable";

import {
  TableColumnType,
  IPayrollComponent,
  ComponentType,
  CalculationType,
  IPayrollComponentOverviewResponse,
} from "@/types";
import {
  PiPlusCircle,
  PiPencil,
  PiTrash,
  PiCurrencyDollar,
  PiMinus,
  PiBuildings,
  PiToggleLeft,
  PiCheckCircle,
  PiPercent,
  PiPushPin,
} from "react-icons/pi";
import {
  GET_PAYROLL_COMPONENTS,
  DELETE_PAYROLL_COMPONENT,
  PAYROLL_COMPONENT_OVERVIEW,
} from "@/graphql/payroll-component.api";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import PayrollComponentForm from "./PayrollComponentForm";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import useConfirmation from "@/hooks/useConfirmation";
import PageHeader from "@/components/ui/PageHeader";
import OverviewCard from "@/components/card/OverviewCard";
import { motion } from "motion/react";

function PayrollComponentOverview() {
  const { data, loading, error } = useQuery<IPayrollComponentOverviewResponse>(
    PAYROLL_COMPONENT_OVERVIEW,
  );

  const summary = data?.payrollComponentOverview?.data;

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Failed to load overview data</span>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Components",
      value: summary?.total || 0,
      Icon: PiToggleLeft,
      bgColor: "bg-primary/10",
      decorationColor: "bg-primary/20",
      iconColor: "text-primary",
      subText: "Configured",
      description: "Total configured payroll components.",
    },
    {
      title: "Earnings",
      value: summary?.earning || 0,
      Icon: PiCurrencyDollar,
      bgColor: "bg-success/10",
      decorationColor: "bg-success/20",
      iconColor: "text-success",
      subText: `out of ${summary?.total}`,
      description: "Components classified as earnings.",
    },
    {
      title: "Deductions",
      value: summary?.deduction || 0,
      Icon: PiMinus,
      bgColor: "bg-error/10",
      decorationColor: "bg-error/20",
      iconColor: "text-error",
      subText: `out of ${summary?.total}`,
      description: "Components classified as deductions.",
    },
    {
      title: "Active",
      value: summary?.active || 0,
      Icon: PiCheckCircle,
      bgColor: "bg-info/10",
      decorationColor: "bg-info/20",
      iconColor: "text-info",
      subText: `out of ${summary?.total}`,
      description: "Currently active components.",
    },
    {
      title: "Fixed Amount",
      value: summary?.fixedAmount || 0,
      Icon: PiPushPin,
      bgColor: "bg-warning/10",
      decorationColor: "bg-warning/20",
      iconColor: "text-warning",
      subText: "Calculation",
      description: "Components with fixed amount calculation.",
    },
    {
      title: "Percentage of Basic Salary",
      value: summary?.percentageOfBasic || 0,
      Icon: PiPercent,
      bgColor: "bg-purple-100",
      decorationColor: "bg-purple-200",
      iconColor: "text-purple-600",
      subText: "Calculation",
      description: "Calculated as percentage of basic.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <OverviewCard
            stat={stat}
            isLoading={loading}
            handler={undefined}
            position={stats.length - 1 === index ? "right" : "left"}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function PayrollComponentsPage() {
  const { hasPermission } = usePermissionGuard();
  const { confirm } = useConfirmation();

  const { popupOption, setPopupOption } = usePopupOption();

  const {
    data: componentsData,
    loading,
    refetch,
  } = useQuery<{
    payrollComponents: {
      data: IPayrollComponent[];
    };
  }>(GET_PAYROLL_COMPONENTS, {
    variables: {
      query: {},
    },
  });

  const components = componentsData?.payrollComponents?.data || [];

  const [deleteComponent, { loading: deleting }] = useMutation(
    DELETE_PAYROLL_COMPONENT,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        { query: GET_PAYROLL_COMPONENTS, variables: { query: {} } },
      ],
    },
  );

  // ==================== HANDLERS ====================
  // DELETE HANDLER
  const handleDelete = async (component: IPayrollComponent) => {
    await confirm({
      title: "Delete Payroll Component",
      message: `Are you sure you want to delete <strong>${component.name}</strong>?`,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      icon: "warning",
      onConfirm: async () => {
        try {
          await deleteComponent({
            variables: { id: component.id },
          });
        } catch (error) {
          console.error("Error deleting component:", error);
        }
      },
      successTitle: "Deleted!",
      successMessage: "Payroll component deleted successfully",
    });
  };

  const handleEdit = (component: IPayrollComponent) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "payrollComponent" as any,
      data: component,
      title: "Update Payroll Component",
    });
  };

  const getComponentTypeBadge = (type: ComponentType) => {
    switch (type) {
      case ComponentType.EARNING:
        return (
          <span className="badge badge-success gap-1">
            <PiCurrencyDollar size={14} />
            Earning
          </span>
        );
      case ComponentType.DEDUCTION:
        return (
          <span className="badge badge-error gap-1">
            <PiMinus size={14} />
            Deduction
          </span>
        );
      case ComponentType.EMPLOYER_COST:
        return (
          <span className="badge badge-info gap-1">
            <PiBuildings size={14} />
            Employer Cost
          </span>
        );
      default:
        return <span className="badge badge-ghost">{type}</span>;
    }
  };

  const getCalculationTypeLabel = (type: CalculationType) => {
    switch (type) {
      case CalculationType.FIXED_AMOUNT:
        return "Fixed Amount";
      case CalculationType.PERCENTAGE_OF_BASIC:
        return "Percentage of Basic Salary";
      case CalculationType.PERCENTAGE_OF_GROSS:
        return "Percentage of Gross Salary";
      case CalculationType.HOURLY_RATE:
        return "Hourly Rate";
      default:
        return type;
    }
  };

  // ==================== STATE ====================
  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Component Name",
      accessorKey: "name",
      show: true,
    },
    {
      key: "2",
      header: "Code",
      accessorKey: "code",
      show: true,
    },
    {
      key: "3",
      header: "Type",
      accessorKey: "customComponentType",
      show: true,
    },
    {
      key: "4",
      header: "Calculation",
      accessorKey: "customCalculationType",
      show: true,
    },
    {
      key: "5",
      header: "Default Value",
      accessorKey: "customDefaultValue",
      show: true,
    },
    {
      key: "6",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
    },
    {
      key: "7",
      header: "Properties",
      accessorKey: "customProperties",
      show: true,
    },
  ]);

  const actions = [
    {
      name: "Edit",
      type: "button" as const,
      handler: handleEdit,
      Icon: PiPencil,
      permissions: [Permissions.PayrollComponentUpdate],
      disabledOn: [],
    },
    {
      name: "Delete",
      type: "button" as const,
      handler: handleDelete,
      Icon: PiTrash,
      permissions: [Permissions.PayrollComponentDelete],
      disabledOn: [],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Payroll Components"
        subtitle="Configure earnings, deductions, and employer costs"
      />

      {/* Stats Cards */}
      <PayrollComponentOverview />

      {/* Components Table */}
      <CustomTable
        isLoading={loading || deleting}
        actions={actions}
        columns={columns}
        setColumns={setColumns}
        dataSource={components.map((row) => ({
          ...row,
          customComponentType: getComponentTypeBadge(row.componentType),
          customCalculationType: getCalculationTypeLabel(row.calculationType),
          customDefaultValue: row.defaultValue
            ? row.calculationType === CalculationType.FIXED_AMOUNT
              ? `$${row.defaultValue.toFixed(2)}`
              : `${row.defaultValue}%`
            : "N/A",
          customStatus:
            row.status === "ACTIVE" ? (
              <span className="badge badge-success">Active</span>
            ) : (
              <span className="badge badge-ghost">Inactive</span>
            ),
          customProperties: (
            <div className="flex gap-1">
              {row.isTaxable && (
                <span className="badge badge-sm badge-warning">Taxable</span>
              )}
              {row.isStatutory && (
                <span className="badge badge-sm badge-info">Statutory</span>
              )}
            </div>
          ),
        }))}
        searchConfig={{
          searchable: false,
          debounceDelay: 500,
          defaultField: "name",
          searchableFields: [
            { label: "Component Name", value: "name" },
            { label: "Code", value: "code" },
          ],
        }}
      >
        {hasPermission(Permissions.PayrollComponentCreate) ? (
          <button
            className="btn btn-primary gap-2"
            onClick={() =>
              setPopupOption({
                open: true,
                closeOnDocumentClick: true,
                actionType: "create",
                form: "payrollComponent" as any,
                data: null,
                title: "Create Payroll Component",
              })
            }
          >
            <PiPlusCircle size={18} />
            Add Component
          </button>
        ) : null}
      </CustomTable>

      {/* Component Form Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        {popupOption.form === ("payrollComponent" as any) && (
          <PayrollComponentForm
            component={popupOption.data}
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
