"use client";

import FormModal from "@/components/form/FormModal";
import CustomTable from "@/components/table/CustomTable";
import {
  PermissionAction,
  PermissionResource,
  Permissions,
} from "@/constants/permissions.constant";
import { DELETE_LEAVE_TYPE, GET_LEAVE_TYPES } from "@/graphql/leave-types.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import usePopupOption from "@/hooks/usePopupOption";
import { TableActionType, TableColumnType } from "@/types";
import { ILeaveType } from "@/types/leave-types.type";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

export default function LeaveTypesPage() {
  const { permissionGuard } = usePermissionGuard();
  // CREATE NEW LEAVE TYPE
  const { popupOption, setPopupOption, createNewLeaveType } = usePopupOption();
  const { data, loading } = useQuery<{
    leaveTypes: {
      message: string;
      statusCode: number;
      success: boolean;
      data: ILeaveType[];
    };
  }>(GET_LEAVE_TYPES, {});

  // DELETE LEAVE TYPE
  const [deleteLeaveType, deleteResult] = useMutation(DELETE_LEAVE_TYPE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_LEAVE_TYPES }],
  });

  // HANDLERS
  const handleEdit = (row: ILeaveType) => {
    //
    const data = {
      id: row?.id,
      name: row?.name,
      leaveType: row?.leaveType,
      leaveHours: row?.leaveHours,
      leaveRolloverType: row?.leaveRolloverType,
      carryOverLimit: row?.carryOverLimit,
      employmentStatuses:
        row?.employmentStatuses?.map((es) => Number(es?.id)) || [],
    };

    // open the popup for editing the form
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "leave_type",
      data: data,
      title: "Update Leave Type",
    });
  };
  const handleDelete = async (row: ILeaveType) => {
    await deleteLeaveType({
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
      header: "Leave Type",
      accessorKey: "leaveType",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "3",
      header: "Leave Hours",
      accessorKey: "leaveHours",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "4",
      header: "Rollover Type",
      accessorKey: "leaveRolloverType",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "5",
      header: "Carry Over Limit",
      accessorKey: "carryOverLimit",
      show: true,
      sortDirection: "ascending",
    },
  ]);

  const actions: TableActionType[] = [
    {
      name: "edit",
      type: "button",
      permissions: [Permissions.LeaveTypeUpdate],
      handler: handleEdit,
      disabledOn: [{ accessorKey: "status", value: "inactive" }],
    },
    {
      name: "delete",
      type: "button",
      permissions: [Permissions.LeaveTypeDelete],
      handler: (row) => {
        setPopupOption({
          open: true,
          closeOnDocumentClick: true,
          actionType: "delete",
          form: "leave_type",
          deleteHandler: () => handleDelete(row),
          title: "Delete Leave Type",
        });
      },
      disabledOn: [],
    },
  ];

  // Modal for adding a new leave type
  return (
    <>
      {/* Popup for adding/editing a leave type */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Modal for adding a new leave type */}
      <section className={``}>
        <header className={`mb-5 flex items-center justify-between`}>
          <div className="">
            <h1 className={`text-2xl font-medium`}>All Leave Types</h1>
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
              { label: "Leave Type", value: "leaveType" },
            ],
          }}
          dataSource={data?.leaveTypes?.data || []}
        >
          {permissionGuard(PermissionResource.LEAVE_TYPE, [
            PermissionAction.CREATE,
          ]) && (
            <button
              type="button"
              className={`btn btn-primary text-base-300`}
              onClick={createNewLeaveType}
            >
              <PiPlusCircle className={`text-xl`} />
              Add New
            </button>
          )}
        </CustomTable>
      </section>
    </>
  );
}
