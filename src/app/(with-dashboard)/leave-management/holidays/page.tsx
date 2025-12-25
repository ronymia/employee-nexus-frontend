"use client";

// ==================== EXTERNAL IMPORTS ====================
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import CustomTable from "@/components/table/CustomTable";
import { TableColumnType } from "@/types";
import {
  PiCalendarBlank,
  PiCheckCircle,
  PiXCircle,
  PiPlusCircle,
  PiCurrencyDollar,
  PiGlobe,
  PiTrash,
  PiPencilSimple,
} from "react-icons/pi";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import CustomPopup from "@/components/modal/CustomPopup";
import FormModal from "@/components/form/FormModal";
import HolidayForm from "./HolidayForm";
import usePopupOption from "@/hooks/usePopupOption";
import { GET_HOLIDAYS, DELETE_HOLIDAY } from "@/graphql/holiday.api";
import { IHoliday, HolidayType } from "@/types/holiday.type";
import CustomLoading from "@/components/loader/CustomLoading";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import PageHeader from "@/components/ui/PageHeader";
import { showToast } from "@/components/ui/CustomToast";

dayjs.extend(isSameOrAfter);

// ==================== SUB-COMPONENTS ====================

// STATS CARD
interface IStatsCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: "primary" | "success" | "info" | "warning";
}

function StatsCard({ label, value, icon: Icon, color }: IStatsCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 border-primary/20 text-primary",
    success: "bg-success/10 border-success/20 text-success",
    info: "bg-info/10 border-info/20 text-info",
    warning: "bg-warning/10 border-warning/20 text-warning",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-base-content/60">{label}</p>
          <p
            className={`text-2xl font-bold ${
              colorClasses[color].split(" ")[2]
            }`}
          >
            {value}
          </p>
        </div>
        <Icon size={32} className={colorClasses[color].split(" ")[2]} />
      </div>
    </div>
  );
}

// HOLIDAY TYPE BADGE
function getHolidayTypeBadge(type: HolidayType) {
  switch (type) {
    case HolidayType.PUBLIC:
      return (
        <span className="badge badge-primary gap-1">
          <PiGlobe size={14} />
          Public
        </span>
      );
    case HolidayType.RELIGIOUS:
      return (
        <span className="badge badge-secondary gap-1">
          <PiCalendarBlank size={14} />
          Religious
        </span>
      );
    case HolidayType.COMPANY_SPECIFIC:
      return (
        <span className="badge badge-accent gap-1">
          <PiCurrencyDollar size={14} />
          Company
        </span>
      );
    case HolidayType.REGIONAL:
      return (
        <span className="badge badge-info gap-1">
          <PiGlobe size={14} />
          Regional
        </span>
      );
    default:
      return <span className="badge badge-ghost">{type}</span>;
  }
}

// PAID BADGE
function getPaidBadge(isPaid: boolean) {
  return isPaid ? (
    <span className="badge badge-success gap-1">
      <PiCheckCircle size={14} />
      Paid
    </span>
  ) : (
    <span className="badge badge-ghost gap-1">
      <PiXCircle size={14} />
      Unpaid
    </span>
  );
}

// RECURRING BADGE
function getRecurringBadge(isRecurring: boolean) {
  return isRecurring ? (
    <span className="badge badge-info gap-1">
      <PiCheckCircle size={14} />
      Yes
    </span>
  ) : (
    <span className="badge badge-ghost gap-1">
      <PiXCircle size={14} />
      No
    </span>
  );
}

// ==================== MAIN COMPONENT ====================
export default function HolidaysPage() {
  // ==================== PERMISSIONS ====================
  const { hasPermission } = usePermissionGuard();

  // ==================== LOCAL STATE ====================
  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Holiday Name",
      accessorKey: "customName",
      show: true,
    },
    {
      key: "2",
      header: "Holiday Period",
      accessorKey: "customHolidayPeriod",
      show: true,
    },
    {
      key: "3",
      header: "Type",
      accessorKey: "customType",
      show: true,
    },
    {
      key: "4",
      header: "Is Paid",
      accessorKey: "customIsPaid",
      show: true,
    },
    {
      key: "5",
      header: "Recurring",
      accessorKey: "customIsRecurring",
      show: true,
    },
  ]);

  // POPUP STATE MANAGEMENT
  const { popupOption, setPopupOption } = usePopupOption();

  // ==================== GRAPHQL QUERIES ====================
  // FETCH HOLIDAYS
  const { data, loading, refetch } = useQuery<{
    holidays: {
      data: IHoliday[];
    };
  }>(GET_HOLIDAYS);

  const holidays = data?.holidays?.data || [];

  // ==================== GRAPHQL MUTATIONS ====================
  // DELETE HOLIDAY
  const [deleteHoliday] = useMutation(DELETE_HOLIDAY, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_HOLIDAYS }],
    onCompleted: () => {
      setPopupOption({ ...popupOption, open: false });
      showToast.success("Deleted!", "Holiday deleted successfully");
    },
    onError: (error) => {
      showToast.error("Error", error.message || "Failed to delete holiday");
    },
  });

  // ==================== CALCULATE STATS ====================
  const stats = {
    total: holidays.length,
    paid: holidays.filter((h) => h.isPaid).length,
    recurring: holidays.filter((h) => h.isRecurring).length,
    upcoming: holidays.filter((h) => dayjs(h.startDate).isAfter(dayjs()))
      .length,
  };

  // ==================== HANDLERS ====================
  // DELETE HANDLER
  const handleDelete = (holiday: IHoliday) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: "delete",
      form: "holiday",
      data: { id: holiday.id },
      title: "Delete Holiday",
      deleteHandler: async () => {
        try {
          await deleteHoliday({
            variables: { id: Number(holiday.id) },
          });
        } catch (error: any) {
          showToast.error("Error", error.message || "Failed to delete holiday");
        }
      },
    });
  };

  // UPDATE HANDLER
  const handleEdit = (holiday: IHoliday) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: "update",
      form: "holiday",
      data: holiday,
      title: "Update Holiday",
    });
  };

  // ==================== TABLE CONFIGURATION ====================
  // TABLE ACTIONS
  const actions = [
    {
      name: "Edit",
      type: "button" as const,
      Icon: PiPencilSimple,
      handler: (row: any) => handleEdit(row),
      permissions: [Permissions.HolidayRead],
      disabledOn: [],
    },
    {
      name: "Delete",
      type: "button" as const,
      Icon: PiTrash,
      handler: (row: any) => handleDelete(row),
      permissions: [Permissions.HolidayDelete],
      disabledOn: [],
    },
  ];

  // ==================== LOADING STATE ====================
  if (loading) {
    return <CustomLoading />;
  }

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="Holidays"
        subtitle="Manage company holidays and observances"
      />

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          label="Total Holidays"
          value={stats.total}
          icon={PiCalendarBlank}
          color="primary"
        />
        <StatsCard
          label="Paid Holidays"
          value={stats.paid}
          icon={PiCurrencyDollar}
          color="success"
        />
        <StatsCard
          label="Recurring"
          value={stats.recurring}
          icon={PiCheckCircle}
          color="info"
        />
        <StatsCard
          label="Upcoming"
          value={stats.upcoming}
          icon={PiCalendarBlank}
          color="warning"
        />
      </div>

      {/* HOLIDAY TABLE */}
      <CustomTable
        isLoading={loading}
        actions={actions}
        columns={columns}
        setColumns={setColumns}
        dataSource={holidays.map((row) => ({
          ...row,
          customName: row.name,
          customHolidayPeriod:
            row.startDate === row.endDate
              ? dayjs(row.startDate).format("MMM DD, YYYY")
              : `${dayjs(row.startDate).format("MMM DD, YYYY")} - ${dayjs(
                  row.endDate
                ).format("MMM DD, YYYY")}`,
          customType: getHolidayTypeBadge(row.holidayType),
          customIsPaid: getPaidBadge(row.isPaid),
          customIsRecurring: getRecurringBadge(row.isRecurring),
        }))}
        searchConfig={{
          searchable: false,
          debounceDelay: 500,
          defaultField: "customName",
          searchableFields: [
            { label: "Holiday Name", value: "customName" },
            { label: "Type", value: "customType" },
          ],
        }}
      >
        {hasPermission(Permissions.AttendanceCreate) ? (
          <button
            className="btn btn-primary gap-2"
            onClick={() =>
              setPopupOption({
                open: true,
                closeOnDocumentClick: true,
                actionType: "create",
                form: "holiday",
                data: null,
                title: "Add Holiday",
              })
            }
          >
            <PiPlusCircle size={18} />
            Add Holiday
          </button>
        ) : null}
      </CustomTable>

      {/* HOLIDAY FORM MODAL */}
      {popupOption.actionType !== "delete" ? (
        <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
          {popupOption.form === "holiday" && (
            <HolidayForm
              holiday={popupOption.data}
              actionType={popupOption.actionType as "create" | "update"}
              onClose={() => {
                setPopupOption({
                  ...popupOption,
                  open: false,
                });
                refetch();
              }}
            />
          )}
        </CustomPopup>
      ) : (
        <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />
      )}
    </div>
  );
}
