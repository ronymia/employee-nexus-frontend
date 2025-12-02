"use client";

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
import moment from "moment";
import CustomPopup from "@/components/modal/CustomPopup";
import FormModal from "@/components/form/FormModal";
import HolidayForm from "./components/HolidayForm";
import usePopupOption from "@/hooks/usePopupOption";
import { GET_HOLIDAYS, DELETE_HOLIDAY } from "@/graphql/holiday.api";
import { IHoliday, HolidayType } from "@/types/holiday.type";
import CustomLoading from "@/components/loader/CustomLoading";
const dummyHolidays: IHoliday[] = [
  {
    id: 1,
    name: "New Year's Day",
    description: "First day of the year",
    startDate: "2025-01-01",
    endDate: "2025-01-01",
    isRecurring: true,
    isPaid: true,
    holidayType: HolidayType.PUBLIC,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Independence Day",
    description: "National independence celebration",
    startDate: "2025-03-26",
    endDate: "2025-03-26",
    isRecurring: true,
    isPaid: true,
    holidayType: HolidayType.PUBLIC,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Eid-ul-Fitr",
    description: "End of Ramadan celebration",
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    isRecurring: true,
    isPaid: true,
    holidayType: HolidayType.RELIGIOUS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Victory Day",
    description: "National victory day",
    startDate: "2025-12-16",
    endDate: "2025-12-16",
    isRecurring: true,
    isPaid: true,
    holidayType: HolidayType.PUBLIC,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Company Anniversary",
    description: "Company founding anniversary celebration",
    startDate: "2025-06-15",
    endDate: "2025-06-15",
    isRecurring: true,
    isPaid: true,
    holidayType: HolidayType.COMPANY_SPECIFIC,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function HolidaysPage() {
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

  // Popup state management
  const { popupOption, setPopupOption } = usePopupOption();

  // Query to get all holidays
  const { data, loading, refetch } = useQuery<{
    holidays: {
      data: IHoliday[];
    };
  }>(GET_HOLIDAYS);

  // Delete holiday mutation
  const [deleteHoliday] = useMutation(DELETE_HOLIDAY, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_HOLIDAYS }],
    onCompleted: () => {
      setPopupOption({ ...popupOption, open: false });
    },
  });

  const holidays = data?.holidays?.data || [];

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
            variables: { id: holiday.id },
          });
        } catch (error) {
          console.error("Error deleting holiday:", error);
        }
      },
    });
  };

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

  // Old dummy data for reference
  const dummyHolidays: IHoliday[] = [
    {
      id: 1,
      name: "New Year's Day",
      description: "First day of the year",
      startDate: "2025-01-01",
      endDate: "2025-01-01",
      isRecurring: true,
      isPaid: true,
      holidayType: HolidayType.PUBLIC,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Independence Day",
      description: "National independence celebration",
      startDate: "2025-03-26",
      endDate: "2025-03-26",
      isRecurring: true,
      isPaid: true,
      holidayType: HolidayType.PUBLIC,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Eid-ul-Fitr",
      description: "End of Ramadan celebration",
      startDate: "2025-04-10",
      endDate: "2025-04-12",
      isRecurring: true,
      isPaid: true,
      holidayType: HolidayType.RELIGIOUS,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Victory Day",
      description: "National victory day",
      startDate: "2025-12-16",
      endDate: "2025-12-16",
      isRecurring: true,
      isPaid: true,
      holidayType: HolidayType.PUBLIC,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      name: "Company Anniversary",
      description: "Company founding anniversary celebration",
      startDate: "2025-06-15",
      endDate: "2025-06-15",
      isRecurring: true,
      isPaid: true,
      holidayType: HolidayType.COMPANY_SPECIFIC,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const getHolidayTypeBadge = (type: HolidayType) => {
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
  };

  const getPaidBadge = (isPaid: boolean) => {
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
  };

  const getRecurringBadge = (isRecurring: boolean) => {
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
  };

  // Calculate stats
  const totalHolidays = holidays.length;
  const paidHolidays = holidays.filter((h) => h.isPaid).length;
  const recurringHolidays = holidays.filter((h) => h.isRecurring).length;
  const upcomingHolidays = holidays.filter((h) =>
    moment(h.startDate).isAfter(moment())
  ).length;

  if (loading) {
    return <CustomLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Holidays</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Manage company holidays and observances
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Total Holidays</p>
              <p className="text-2xl font-bold text-primary">{totalHolidays}</p>
            </div>
            <PiCalendarBlank size={32} className="text-primary" />
          </div>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Paid Holidays</p>
              <p className="text-2xl font-bold text-success">{paidHolidays}</p>
            </div>
            <PiCurrencyDollar size={32} className="text-success" />
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Recurring</p>
              <p className="text-2xl font-bold text-info">
                {recurringHolidays}
              </p>
            </div>
            <PiCheckCircle size={32} className="text-info" />
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60">Upcoming</p>
              <p className="text-2xl font-bold text-warning">
                {upcomingHolidays}
              </p>
            </div>
            <PiCalendarBlank size={32} className="text-warning" />
          </div>
        </div>
      </div> */}

      {/* Holiday Table */}
      <CustomTable
        isLoading={loading}
        actions={[
          {
            name: "Edit",
            type: "button" as const,
            Icon: PiPencilSimple,
            handler: (row: any) => handleEdit(row),
            permissions: [],
            disabledOn: [],
          },
          {
            name: "Delete",
            type: "button" as const,
            Icon: PiTrash,
            handler: (row: any) => handleDelete(row),
            permissions: [],
            disabledOn: [],
          },
        ]}
        columns={columns}
        setColumns={setColumns}
        dataSource={holidays.map((row) => ({
          ...row,
          customName: row.name,
          customHolidayPeriod:
            row.startDate === row.endDate
              ? moment(row.startDate).format("MMM DD, YYYY")
              : `${moment(row.startDate).format("MMM DD, YYYY")} - ${moment(
                  row.endDate
                ).format("MMM DD, YYYY")}`,
          customType: row.holidayType,
          customIsPaid: row.isPaid ? "Paid" : "Unpaid",
          customIsRecurring: row.isRecurring ? "Yes" : "No",
        }))}
        searchConfig={{
          searchable: true,
          debounceDelay: 500,
          defaultField: "customName",
          searchableFields: [
            { label: "Holiday Name", value: "customName" },
            { label: "Type", value: "customType" },
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
              form: "holiday",
              data: null,
              title: "Add Holiday",
            })
          }
        >
          <PiPlusCircle size={18} />
          Add Holiday
        </button>
      </CustomTable>

      {/* Holiday Form Modal */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption}>
        {popupOption.form === "holiday" &&
          popupOption.actionType !== "delete" && (
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

      {/* Delete Confirmation Modal */}
      {/* <FormModal popupOption={popupOption} setPopupOption={setPopupOption} /> */}
    </div>
  );
}
