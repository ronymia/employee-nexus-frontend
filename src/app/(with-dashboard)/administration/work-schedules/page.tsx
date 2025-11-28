"use client";

import { PiPlusCircle } from "react-icons/pi";
import type { IWorkSchedule, TableActionType, TableColumnType } from "@/types";
import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import CustomTable from "@/components/table/CustomTable";
import { GET_WORK_SCHEDULES } from "@/graphql/work-schedules.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Permissions } from "@/constants/permissions.constant";

export default function WorkSchedules() {
  const router = useRouter();
  const { data, loading } = useQuery<{
    workSchedules: {
      data: IWorkSchedule[];
    };
  }>(GET_WORK_SCHEDULES);

  const handleEdit = (row: IWorkSchedule) => {
    router.push(`/administration/work-schedules/${row?.id}/update`);
  };

  const handleDelete = (row: IWorkSchedule) => {};

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
      accessorKey: "scheduleType",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
      minWidth: 15,
    },
    {
      key: "4",
      header: "Break Type",
      accessorKey: "breakType",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
      minWidth: 10,
    },
    {
      key: "5",
      header: "Break Hours",
      accessorKey: "breakHours",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
      minWidth: 10,
    },
    {
      key: "6",
      header: "Status",
      accessorKey: "status",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
      minWidth: 10,
    },
  ]);

  const columns = useMemo(() => columnHelper, [columnHelper]);

  const actions: TableActionType[] = [
    {
      name: "view",
      type: "link",
      handler: () => {},
      href: (row) => `/administration/work-schedules/${row?.id}/view`,
      permissions: [Permissions.WorkScheduleRead],
      disabledOn: [{ accessorKey: "status", value: "INACTIVE" }],
    },
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
      handler: (row) => console.log("Delete:", row),
      permissions: [Permissions.WorkScheduleDelete],
      disabledOn: [],
    },
  ];

  return (
    <section className={``}>
      <header className={`mb-5 flex items-center justify-between`}>
        <div className="">
          <h1 className={`text-2xl font-medium`}>Work Schedules</h1>
        </div>
      </header>
      {/* TABLE */}
      <CustomTable
        isLoading={loading}
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
        dataSource={data?.workSchedules?.data || []}
      >
        <Link
          href={`/administration/work-schedules/create`}
          className={`btn btn-primary text-base-300`}
        >
          <PiPlusCircle className={`text-xl`} />
          Add Work Schedule
        </Link>
      </CustomTable>
    </section>
  );
}
