"use client";

import { PiPlusCircle } from "react-icons/pi";
import type { IWorkSchedule, TableActionType, TableColumnType } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { Fragment, useMemo, useState } from "react";
import CustomTable from "@/components/table/CustomTable";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  DELETE_WORK_SCHEDULE,
  GET_WORK_SCHEDULES,
} from "@/graphql/work-schedules.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Permissions } from "@/constants/permissions.constant";
import { showToast } from "@/components/ui/CustomToast";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import FormModal from "@/components/form/FormModal";

export default function WorkSchedules() {
  // ROUTER
  const router = useRouter();

  // GET PERMISSIONS
  const { hasPermission } = usePermissionGuard();

  // GET POPUP OPTIONS
  const { popupOption, setPopupOption } = usePopupOption();

  // GET WORK SCHEDULES
  const { data, loading } = useQuery<{
    workSchedules: {
      data: IWorkSchedule[];
    };
  }>(GET_WORK_SCHEDULES);

  // DELETE WORK SCHEDULE
  const [deleteWorkSchedule, deleteResult] = useMutation(DELETE_WORK_SCHEDULE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_WORK_SCHEDULES }],
  });

  // HANDLE EDIT
  const handleEdit = (row: IWorkSchedule) => {
    router.push(`/administration/work-schedules/${row?.id}/update`);
  };

  // HANDLE DELETE
  const handleDelete = async (row: IWorkSchedule) => {
    try {
      const res = await deleteWorkSchedule({
        variables: {
          id: Number(row?.id),
        },
      });
      if (res?.data) {
        showToast.success("Deleted!", "Work schedule deleted successfully");
      }
    } catch (error: any) {
      showToast.error(
        "Error",
        error.message || "Failed to delete work schedule"
      );
    }
  };

  // TABLE COLUMNS DEFINITION
  const [columnHelper, setColumnHelper] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Name",
      accessorKey: "name",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
      minWidth: 15,
    },
    {
      key: "2",
      header: "Description",
      accessorKey: "description",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
      minWidth: 20,
    },
    {
      key: "3",
      header: "Schedule Type",
      accessorKey: "customScheduleType",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
      minWidth: 15,
    },
    {
      key: "4",
      header: "Break Type",
      accessorKey: "customBreakType",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
      minWidth: 10,
    },
    {
      key: "5",
      header: "Break Hours",
      accessorKey: "customBreakMinutes",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
      minWidth: 10,
    },
    {
      key: "6",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
      minWidth: 10,
    },
  ]);

  // TABLE COLUMNS
  const columns = useMemo(() => columnHelper, [columnHelper]);

  // TABLE ACTIONS
  const actions: TableActionType[] = [
    // {
    //   name: "view",
    //   type: "link",
    //   handler: () => {},
    //   href: (row) => `/administration/work-schedules/${row?.id}/view`,
    //   permissions: [Permissions.WorkScheduleRead],
    //   disabledOn: [{ accessorKey: "status", value: "INACTIVE" }],
    // },
    {
      name: "edit",
      type: "button",
      handler: handleEdit,
      permissions: [Permissions.WorkScheduleUpdate],
      disabledOn: [{ accessorKey: "status", value: "INACTIVE" }],
    },
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.WorkScheduleDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "",
          deleteHandler: () => handleDelete(row),
          title: "Delete Work Schedule",
        });
      },
      disabledOn: [{ accessorKey: "isDefault", value: true }],
    },
  ];

  return (
    <Fragment key="work-schedules">
      {/* FORM MODAL */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* PAGE HEADER */}
      <PageHeader
        title="Work Schedules"
        subtitle="Define and manage work schedules for your organization"
      />
      {/* TABLE */}
      <CustomTable
        isLoading={loading || deleteResult.loading}
        actions={actions}
        columns={columns}
        setColumns={setColumnHelper}
        searchConfig={{
          searchable: loading ? true : false,
          debounceDelay: 500,
          defaultField: "name",
          searchableFields: [
            { label: "Name", value: "name" },
            { label: "Description", value: "description" },
          ],
        }}
        dataSource={
          data?.workSchedules?.data?.map((row) => ({
            ...row,
            customBreakMinutes: row.breakMinutes
              ? `${row.breakMinutes} mins`
              : "N/A",
            customScheduleType: (() => {
              const type = row.scheduleType?.replace(/_/g, " ") || "N/A";
              let badgeColor = "";

              switch (row.scheduleType) {
                case "REGULAR":
                  badgeColor =
                    "bg-blue-100 text-blue-800 border border-blue-200";
                  break;
                case "SCHEDULED":
                  badgeColor =
                    "bg-purple-100 text-purple-800 border border-purple-200";
                  break;
                case "FLEXIBLE":
                  badgeColor =
                    "bg-teal-100 text-teal-800 border border-teal-200";
                  break;
                default:
                  badgeColor =
                    "bg-gray-100 text-gray-800 border border-gray-200";
              }

              return (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${badgeColor}`}
                >
                  {type.toLowerCase()}
                </span>
              );
            })(),
            customBreakType: (() => {
              const type = row.breakType?.replace(/_/g, " ") || "N/A";
              let badgeColor = "";

              switch (row.breakType) {
                case "PAID":
                  badgeColor =
                    "bg-green-100 text-green-800 border border-green-200";
                  break;
                case "UNPAID":
                  badgeColor =
                    "bg-orange-100 text-orange-800 border border-orange-200";
                  break;
                default:
                  badgeColor =
                    "bg-gray-100 text-gray-800 border border-gray-200";
              }

              return (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${badgeColor}`}
                >
                  {type.toLowerCase()}
                </span>
              );
            })(),
            customStatus: (
              <StatusBadge status={row.status as string} onClick={() => {}} />
            ),
          })) || []
        }
      >
        {hasPermission(Permissions.WorkScheduleCreate) ? (
          <Link
            href={`/administration/work-schedules/create`}
            className={`btn btn-primary text-base-300`}
          >
            <PiPlusCircle className={`text-xl`} />
            Add Work Schedule
          </Link>
        ) : null}
      </CustomTable>
    </Fragment>
  );
}
