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
  PiCalendar,
} from "react-icons/pi";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { customFormatDate } from "@/utils/date-format.utils";
import CustomPopup from "@/components/modal/CustomPopup";
import HolidayForm from "./HolidayForm";
import usePopupOption from "@/hooks/usePopupOption";
import useDeleteConfirmation from "@/hooks/useDeleteConfirmation";
import {
  GET_HOLIDAYS,
  DELETE_HOLIDAY,
  HOLIDAY_OVERVIEW,
} from "@/graphql/holiday.api";
import {
  IHoliday,
  HolidayType,
  IHolidayOverviewResponse,
  IHolidayArrayResponse,
} from "@/types/holiday.type";
import CustomLoading from "@/components/loader/CustomLoading";
import { Permissions } from "@/constants/permissions.constant";
import usePermissionGuard from "@/guards/usePermissionGuard";
import PageHeader from "@/components/ui/PageHeader";
import OverviewCard from "@/components/card/OverviewCard";
import { motion } from "motion/react";

dayjs.extend(isSameOrAfter);

// ==================== SUB-COMPONENTS ====================

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

function HolidayOverview() {
  const { data, loading, error } =
    useQuery<IHolidayOverviewResponse>(HOLIDAY_OVERVIEW);

  const summary = data?.holidayOverview?.data;

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="alert alert-error mb-6"
      >
        <PiXCircle size={24} />
        <span>Failed to load holiday summary</span>
      </motion.div>
    );
  }

  const stats = [
    {
      title: "Total Holidays",
      value: summary?.total || 0,
      Icon: PiCalendarBlank,
      bgColor: "bg-primary/10",
      decorationColor: "bg-primary/20",
      iconColor: "text-primary",
      subText: "This Year",
      description: "Total holidays configured for the current year.",
    },
    {
      title: "Paid Holidays",
      value: summary?.paid || 0,
      Icon: PiCurrencyDollar,
      bgColor: "bg-success/10",
      decorationColor: "bg-success/20",
      iconColor: "text-success",
      subText: `out of ${summary?.total}`,
      description: "Holidays that are marked as paid leaves.",
    },
    {
      title: "Recurring",
      value: summary?.recurring || 0,
      Icon: PiCheckCircle,
      bgColor: "bg-info/10",
      decorationColor: "bg-info/20",
      iconColor: "text-info",
      subText: `out of ${summary?.total}`,
      description: "Holidays that repeat every year.",
    },
    {
      title: "Public Holidays",
      value: summary?.public || 0,
      Icon: PiGlobe,
      bgColor: "bg-warning/10",
      decorationColor: "bg-warning/20",
      iconColor: "text-warning",
      subText: `out of ${summary?.total}`,
      description: "National or public holidays.",
    },
    {
      title: "Religious",
      value: summary?.religious || 0,
      Icon: PiCalendar,
      bgColor: "bg-[#edebff]",
      decorationColor: "bg-[#d0c9ff]",
      iconColor: "text-[#5b4eb1]",
      subText: `out of ${summary?.total}`,
      description: "Religious observances.",
    },
    {
      title: "Company",
      value: summary?.companySpecific || 0,
      Icon: PiPlusCircle,
      bgColor: "bg-base-200",
      decorationColor: "bg-base-300",
      iconColor: "text-base-content/60",
      subText: `out of ${summary?.total}`,
      description: "Company specific holidays.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
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
            isLoading={loading}
            position={stats.length - 1 === index ? "right" : "left"}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function HolidaysPage() {
  // ==================== PERMISSIONS ====================
  const { hasPermission } = usePermissionGuard();

  // ==================== HOOKS ====================
  const deleteConfirmation = useDeleteConfirmation();

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
  const { data, loading, refetch } =
    useQuery<IHolidayArrayResponse>(GET_HOLIDAYS);

  const holidays = data?.holidays?.data || [];

  // ==================== GRAPHQL MUTATIONS ====================
  // DELETE HOLIDAY
  const [deleteHoliday] = useMutation(DELETE_HOLIDAY, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_HOLIDAYS }, { query: HOLIDAY_OVERVIEW }],
  });

  // ==================== HANDLERS ====================
  // DELETE HANDLER
  const handleDelete = async (holiday: IHoliday) => {
    await deleteConfirmation.confirm({
      title: "Are you sure?",
      itemName: holiday.name,
      itemDescription: `Holiday Period: ${
        holiday.startDate === holiday.endDate
          ? customFormatDate(holiday.startDate)
          : `${customFormatDate(holiday.startDate)} - ${customFormatDate(holiday.endDate)}`
      }`,
      confirmButtonText: "Yes, delete it!",
      successMessage: "Holiday deleted successfully",
      onDelete: async () => {
        await deleteHoliday({
          variables: { id: Number(holiday.id) },
        });
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

      {/* HOLIDAY OVERVIEW */}
      <HolidayOverview />

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
              ? customFormatDate(row.startDate)
              : `${customFormatDate(row.startDate)} - ${customFormatDate(row.endDate)}`,
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
    </div>
  );
}
