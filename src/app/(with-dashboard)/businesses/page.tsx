"use client";

import { PiPlusCircle } from "react-icons/pi";
import type { IBusiness, TableActionType, TableColumnType } from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import CustomTable from "@/components/table/CustomTable";
import { DELETE_BUSINESS, GET_BUSINESSES } from "@/graphql/business.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Permissions } from "@/constants/permissions.constant";
import StatusBadge from "@/components/ui/StatusBadge";
import usePopupOption from "@/hooks/usePopupOption";
import FormModal from "@/components/form/FormModal";

export default function AllBusinesses() {
  // ROUTER
  const router = useRouter();
  // MODAL OPTION
  const { popupOption, setPopupOption } = usePopupOption();

  // GET ALL BUSINESS
  const { data, loading } = useQuery<{
    businesses: {
      data: IBusiness[];
    };
  }>(GET_BUSINESSES);

  // DELETE BUSINESS
  const [deleteBusiness, deleteResult] = useMutation(DELETE_BUSINESS, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_BUSINESSES }],
  });

  // EDIT HANDLER
  const handleEdit = (row: IBusiness) => {
    router.push(`/businesses/${row?.id}/update`);
  };

  // DELETE HANDLER
  const handleDelete = async (row: IBusiness) => {
    await deleteBusiness({
      variables: {
        id: Number(row?.id),
      },
    });
  };

  // TABLE COLUMNS DEF
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
      key: "1",
      header: "Email",
      accessorKey: "email",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
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
      sortable: false,
      filterable: false,
      minWidth: 15,
    },
    {
      key: "1",
      header: "Status",
      accessorKey: "customStatus",
      show: true,
      sortDirection: "ascending",
      sortable: false,
      filterable: false,
      minWidth: 10,
    },
  ]);
  const columns = useMemo(() => columnHelper, [columnHelper]);

  // TABLE ACTIONS
  const actions: TableActionType[] = [
    {
      name: "view",
      type: "link",
      handler: () => {},
      href: (row) => `/businesses/${row?.id}/view`,
      permissions: [Permissions.BusinessRead],
      disabledOn: [{ accessorKey: "status", value: "inactive" }],
    },
    {
      name: "edit",
      type: "button",
      handler: handleEdit,
      permissions: [Permissions.BusinessUpdate],
      disabledOn: [{ accessorKey: "status", value: "inactive" }],
    },
    {
      name: "delete",
      type: "button",
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "business",
          deleteHandler: () => handleDelete(row),
          title: "Delete Business",
        });
      },
      permissions: [Permissions.BusinessDelete],
      disabledOn: [],
    },
  ];

  return (
    <section className={``}>
      {/* DELETE MODAL */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* PAGE HEADER */}
      <header className={`mb-5 flex items-center justify-between`}>
        <div className="">
          <h1 className={`text-2xl font-medium`}>All Business</h1>
          <p className={`text-sm text-gray-500`}>
            Manage all your businesses here.
          </p>
        </div>
      </header>

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
            { label: "Email", value: "email" },
            { label: "Address", value: "address" },
          ],
        }}
        dataSource={
          data?.businesses?.data?.map((row) => ({
            ...row,
            customStatus: (
              <StatusBadge status={row.status} onClick={() => {}} />
            ),
          })) || []
        }
      >
        <Link
          href={`/businesses/create`}
          className={`btn btn-primary text-base-300`}
        >
          <PiPlusCircle className={`text-xl`} />
          Add Business
        </Link>
      </CustomTable>
    </section>
  );
}
