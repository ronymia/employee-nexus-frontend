"use client";

import { PiPlusCircle } from "react-icons/pi";
import type { TableActionType, TableColumnType } from "@/types";
import useAppStore from "@/stores/useAppStore";
import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import CustomTable from "@/components/table/CustomTable";
import { GET_BUSINESSES } from "@/graphql/business.api";
import Link from "next/link";

export default function AllBusinesses() {
  const { user } = useAppStore((state) => state);
  const { data, loading } = useQuery(GET_BUSINESSES);

  const handleEdit = (row: any) => {};
  const handleDelete = (row: any) => {};

  const [columnHelper, setColumnHelper] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Name",
      accessorKey: "name",
      show: true,
      sortDirection: "ascending",
      sortable: true,
      filterable: true,
      minWidth: 15,
    },
    {
      key: "1",
      header: "Email",
      accessorKey: "email",
      show: true,
      sortDirection: "ascending",
      sortable: true,
      filterable: true,
      minWidth: 20,
    },
    {
      key: "1",
      header: "Number of Employees Allowed",
      accessorKey: "numberOfEmployeesAllowed",
      show: false,
      minWidth: 10,
    },

    {
      key: "1",
      header: "Address",
      accessorKey: "address",
      show: true,
      sortDirection: "ascending",
      sortable: true,
      filterable: true,
      minWidth: 15,
    },
    {
      key: "1",
      header: "Status",
      accessorKey: "status",
      show: true,
      sortDirection: "ascending",
      sortable: true,
      filterable: true,
      minWidth: 10,
    },
  ]);
  const columns = useMemo(() => columnHelper, [columnHelper]);

  const actions: TableActionType[] = [
    {
      name: "edit",
      type: "button",
      handler: (row) => console.log("Edit:", row),
      permissions: [],
      disabledOn: [{ accessorKey: "status", value: "inactive" }],
    },
    {
      name: "delete",
      type: "button",
      handler: (row) => console.log("Delete:", row),
      permissions: [],
      disabledOn: [],
    },
  ];

  console.log({ columns });

  return (
    <section className={``}>
      <header className={`mb-5 flex items-center justify-between`}>
        <div className="">
          <h1 className={`text-2xl font-medium`}>All Business</h1>
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
            { label: "Email", value: "email" },
            { label: "Address", value: "address" },
          ],
        }}
        dataSource={data?.businesses?.data || []}
      >
        <Link href={`/businesses/create`} className={`btn btn-primary`}>
          <PiPlusCircle className={`text-xl`} />
          Add Business
        </Link>
      </CustomTable>
    </section>
  );
}
