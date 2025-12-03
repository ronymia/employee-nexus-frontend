"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import CustomTable from "@/components/table/CustomTable";
import CustomLoading from "@/components/loader/CustomLoading";
import FormModal from "@/components/form/FormModal";
import {
  TableColumnType,
  IPayrollComponent,
  ComponentType,
  CalculationType,
} from "@/types";
import {
  PiPlusCircle,
  PiPencil,
  PiTrash,
  PiCurrencyDollar,
  PiMinus,
  PiBuildings,
  PiToggleLeft,
} from "react-icons/pi";
import {
  GET_PAYROLL_COMPONENTS,
  DELETE_PAYROLL_COMPONENT,
} from "@/graphql/payroll-component.api";
import CustomPopup from "@/components/modal/CustomPopup";
import usePopupOption from "@/hooks/usePopupOption";
import PayrollComponentForm from "./PayrollComponentForm";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";

export default function PayrollComponentsPage() {
  const { hasPermission } = usePermissionGuard();
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
    // {
    //   key: "5",
    //   header: "Default Value",
    //   accessorKey: "customDefaultValue",
    //   show: true,
    // },
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

  const { popupOption, setPopupOption } = usePopupOption();
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });

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
    }
  );

  const handleDelete = async () => {
    if (deleteModal.id) {
      try {
        await deleteComponent({
          variables: { id: deleteModal.id },
        });
        setDeleteModal({ open: false, id: null });
      } catch (error) {
        console.error("Error deleting component:", error);
      }
    }
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

  const getComponentTypeLabel = (type: ComponentType) => {
    switch (type) {
      case ComponentType.EARNING:
        return "Earning";
      case ComponentType.DEDUCTION:
        return "Deduction";
      case ComponentType.EMPLOYER_COST:
        return "Employer Cost";
      default:
        return type;
    }
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
        return "% of Basic";
      case CalculationType.PERCENTAGE_OF_GROSS:
        return "% of Gross";
      case CalculationType.HOURLY_RATE:
        return "Hourly Rate";
      default:
        return type;
    }
  };

  const stats = {
    total: components.length,
    earnings: components.filter(
      (c) => c.componentType === ComponentType.EARNING
    ).length,
    deductions: components.filter(
      (c) => c.componentType === ComponentType.DEDUCTION
    ).length,
    active: components.filter((c) => c.isActive).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Payroll Components
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Configure earnings, deductions, and employer costs
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Total Components</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <PiToggleLeft size={32} className="text-primary" />
          </div>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Earnings</p>
              <p className="text-2xl font-bold text-success">
                {stats.earnings}
              </p>
            </div>
            <PiCurrencyDollar size={32} className="text-success" />
          </div>
        </div>

        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Deductions</p>
              <p className="text-2xl font-bold text-error">
                {stats.deductions}
              </p>
            </div>
            <PiMinus size={32} className="text-error" />
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Active</p>
              <p className="text-2xl font-bold text-info">{stats.active}</p>
            </div>
            <PiToggleLeft size={32} className="text-info" />
          </div>
        </div>
      </div>

      {/* Components Table */}
      {loading ? (
        <CustomLoading />
      ) : (
        <CustomTable
          isLoading={loading}
          actions={[
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
              handler: (component: IPayrollComponent) =>
                setDeleteModal({ open: true, id: component.id }),
              Icon: PiTrash,
              permissions: [Permissions.PayrollComponentDelete],
              disabledOn: [],
            },
          ]}
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
            customStatus: row.isActive ? (
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
            searchable: true,
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
      )}

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

      {/* Delete Confirmation Modal */}
      <FormModal
        popupOption={{
          open: deleteModal.open,
          closeOnDocumentClick: false,
          actionType: "delete",
          form: "payrollComponent" as any,
          data: null,
          title: "Delete Payroll Component",
          deleteHandler: handleDelete,
        }}
        setPopupOption={(value) => {
          if (typeof value === "function") {
            setDeleteModal((prev) => {
              const newPopup = value({
                open: prev.open,
                closeOnDocumentClick: false,
                actionType: "delete",
                form: "payrollComponent" as any,
                data: null,
                title: "Delete Payroll Component",
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
