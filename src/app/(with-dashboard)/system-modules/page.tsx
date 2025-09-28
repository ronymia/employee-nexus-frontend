"use client";

import CustomTable from "@/components/table/CustomTable";
import { GET_SYSTEM_MODULES } from "@/graphql/system-modules.api";
import { formatText } from "@/utils/format-text.utils";
import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";

export default function AllSystemModules() {
  // GET ALL SYSTEM MODULES
  const { data, loading } = useQuery(GET_SYSTEM_MODULES);
  // console.log({ data });

  // TABLE COLUMNS
  const [columnHelper, setColumnHelper] = useState([
    {
      key: "1",
      header: "Name",
      accessorKey: "customName",
      show: true,
    },
  ]);

  const columns = useMemo(() => columnHelper, [columnHelper]);

  return (
    <section className={``}>
      <div className={`mb-5`}>
        <h1 className={`text-2xl font-medium`}>All System Modules</h1>
      </div>
      {/* TABLE */}
      <CustomTable
        isLoading={loading}
        columns={columns}
        actions={[]}
        setColumns={setColumnHelper}
        searchConfig={{
          searchable: loading ? true : false,
          debounceDelay: 500,
          defaultField: "name",
          searchableFields: [{ label: "Name", value: "name" }],
        }}
        dataSource={
          data?.systemModules?.data?.map((row) => ({
            ...row,
            customName: formatText(row.name),
          })) || []
        }
      />
    </section>
  );
}
