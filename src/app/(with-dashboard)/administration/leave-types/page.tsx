"use client";

import { showToast } from "@/components/ui/CustomToast";
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
import {
  TableActionType,
  TableColumnType,
  ILeaveType,
  ILeaveTypeArrayResponse,
} from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { Fragment, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import PageHeader from "@/components/ui/PageHeader";

export default function LeaveTypesPage() {
  // PERMISSION GUARD
  const { permissionGuard } = usePermissionGuard();
  // CREATE NEW LEAVE TYPE
  const { popupOption, setPopupOption, createNewLeaveType } = usePopupOption();
  // GET LEAVE TYPES
  const { data, loading } = useQuery<ILeaveTypeArrayResponse>(GET_LEAVE_TYPES);

  // DELETE LEAVE TYPE
  const [deleteLeaveType, deleteResult] = useMutation(DELETE_LEAVE_TYPE, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_LEAVE_TYPES }],
  });

  // HANDLERS
  const handleEdit = (row: ILeaveType) => {
    // open the popup for editing the form
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "leave_type",
      data: row,
      title: "Update Leave Type",
    });
  };

  // DELETE LEAVE TYPE
  const handleDelete = async (row: ILeaveType) => {
    try {
      const res = await deleteLeaveType({
        variables: {
          id: Number(row?.id),
        },
      });
      if (res?.data) {
        showToast.success("Deleted!", "Leave type deleted successfully");
      }
    } catch (error: any) {
      showToast.error("Error", error.message || "Failed to delete leave type");
    }
  };

  // TABLE COLUMNS
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
      accessorKey: "customLeaveType",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "3",
      header: "Leave Minutes",
      accessorKey: "leaveMinutes",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "4",
      header: "Rollover Type",
      accessorKey: "customLeaveRolloverType",
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
    {
      key: "6",
      header: "Employment Statuses",
      accessorKey: "customEmploymentStatuses",
      show: true,
      sortDirection: "ascending",
    },
  ]);

  // TABLE ACTIONS
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
    <Fragment key={`leave_type-page`}>
      {/* Popup for adding/editing a leave type */}
      <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* Modal for adding a new leave type */}
      <PageHeader
        title="All Leave Types"
        subtitle="Manage and configure different types of leave available in your organization"
      />
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
        dataSource={
          data?.leaveTypes?.data?.map((row) => ({
            ...row,
            customLeaveType: (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  row.leaveType === "PAID"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-orange-100 text-orange-800 border border-orange-200"
                }`}
              >
                {row.leaveType === "PAID" ? "Paid" : "Unpaid"}
              </span>
            ),
            customLeaveRolloverType: (() => {
              let badgeColor = "";
              let displayText = "";

              switch (row.leaveRolloverType) {
                case "NONE":
                  badgeColor =
                    "bg-gray-100 text-gray-800 border border-gray-200";
                  displayText = "No Rollover";
                  break;
                case "PARTIAL_ROLLOVER":
                  badgeColor =
                    "bg-blue-100 text-blue-800 border border-blue-200";
                  displayText = "Partial Rollover";
                  break;
                case "FULL_ROLLOVER":
                  badgeColor =
                    "bg-purple-100 text-purple-800 border border-purple-200";
                  displayText = "Full Rollover";
                  break;
                default:
                  badgeColor =
                    "bg-gray-100 text-gray-800 border border-gray-200";
                  displayText = row.leaveRolloverType || "N/A";
              }

              return (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}
                >
                  {displayText}
                </span>
              );
            })(),
            customEmploymentStatuses: (
              <div className="flex flex-wrap gap-1.5">
                {row.employmentStatuses && row.employmentStatuses.length > 0 ? (
                  row.employmentStatuses.map((status: any, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                    >
                      {status.name}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    All Employee Statuses
                  </span>
                )}
              </div>
            ),
          })) || []
        }
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
    </Fragment>
  );
}
