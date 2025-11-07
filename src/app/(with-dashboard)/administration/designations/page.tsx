"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import {
  DELETE_DESIGNATION,
  GET_DESIGNATIONS,
} from "@/graphql/designation.api";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType } from "@/types";
import { IDesignation } from "@/types/designation.type";
import { IJobType } from "@/types/job-type.type";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function DesignationsPage() {
  const { popupOption, setPopupOption, createNewDesignation } =
    usePopupOption();
  const { data, loading } = useQuery<{
    designations: {
      data: IJobType[];
    };
  }>(GET_DESIGNATIONS, {});

  const [deleteSubscriptionPlan, deleteResult] = useMutation(
    DELETE_DESIGNATION,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_DESIGNATIONS }],
    }
  );
  // console.log({ data });

  const handleEdit = (row: IDesignation) => {
    //
    const data = {
      id: row?.id,
      description: row?.description,
      name: row?.name,
    };

    // open the popup for editing the form
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "job_type",
      data: data,
      title: "Update Job Type",
    });
  };
  const handleDelete = async (row: IDesignation) => {
    await deleteSubscriptionPlan({
      variables: {
        id: Number(row?.id),
      },
    });
  };

  const [columns, setColumns] = useState<TableColumnType[]>([
    {
      key: "1",
      header: "Name",
      accessorKey: "name",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "2",
      header: "Description",
      accessorKey: "description",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "3",
      header: "Status",
      accessorKey: "status",
      show: true,
      sortDirection: "ascending",
    },
  ]);

  const actions: TableActionType[] = [
    {
      name: "edit",
      type: "button",
      permissions: [],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "inactive" }],
    },
    {
      name: "delete",
      type: "button",
      permissions: [],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "job_type",
          deleteHandler: () => handleDelete(row),
          title: "Delete Job Type",
        });
      },
      disabledOn: [],
    },
  ];

  // Modal for adding a new subscription plan
  return (
    <>
      {/* Popup for adding/editing a subscription plan */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Modal for adding a new subscription plan */}
      <section className={``}>
        <header className={`mb-5 flex items-center justify-between`}>
          <div className="">
            <h1 className={`text-2xl font-medium`}>All Designations</h1>
          </div>
        </header>
        {/* TABLE */}
        <CustomTable
          isLoading={loading || deleteResult.loading}
          actions={actions}
          columns={columns}
          setColumns={setColumns}
          searchConfig={{
            searchable: loading ? true : false,
            debounceDelay: 500,
            defaultField: "name",
            searchableFields: [
              { label: "Name", value: "name" },
              { label: "Price", value: "price" },
              { label: "Description", value: "description" },
            ],
          }}
          dataSource={data?.designations?.data || []}
        >
          <button
            type="button"
            className={`btn btn-primary text-base-300`}
            onClick={createNewDesignation}
          >
            <PiPlusCircle className={`text-xl`} />
            Add New
          </button>
        </CustomTable>
      </section>
    </>
  );
}
