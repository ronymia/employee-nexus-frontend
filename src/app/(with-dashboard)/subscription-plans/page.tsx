"use client";

import { useState } from "react";
import {
  DELETE_SUBSCRIPTION_PLAN,
  GET_SUBSCRIPTION_PLANS,
} from "@/graphql/subscription-plans.api";
import CustomTable from "@/components/table/CustomTable";
import type {
  ISubscriptionPlan,
  TableActionType,
  TableColumnType,
} from "@/types";
import { PiPlusCircle } from "react-icons/pi";
import { useMutation, useQuery } from "@apollo/client/react";
import usePopupOption from "@/hooks/usePopupOption";
import FormModal from "@/components/form/FormModal";

export default function AllSubscriptionPlan() {
  const { popupOption, setPopupOption, createNewSubscriptionPlan } =
    usePopupOption();
  const { data, loading } = useQuery<{
    subscriptionPlans: {
      data: ISubscriptionPlan[];
    };
  }>(GET_SUBSCRIPTION_PLANS, {});

  const [deleteSubscriptionPlan, deleteResult] = useMutation(
    DELETE_SUBSCRIPTION_PLAN,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_SUBSCRIPTION_PLANS }],
    }
  );
  // console.log({ data });

  const handleEdit = (row: ISubscriptionPlan) => {
    //
    const data = {
      id: row?.id,
      description: row?.description,
      name: row?.name,
      price: row?.price,
      setupFee: row?.setupFee,
    };

    // open the popup for editing the subscription plan
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "update",
      form: "SubscriptionPlanForm",
      data: data,
      title: "Update Subscription Plan",
    });
  };
  const handleDelete = async (row: ISubscriptionPlan) => {
    await deleteSubscriptionPlan({
      variables: {
        id: Number(row?.id),
      },
    });

    // setPopupOption({
    //   open: true,
    //   closeOnDocumentClick: true,
    //   actionType: "delete",
    //   form: "SubscriptionPlanForm",
    //   deleteHandler: data,
    //   title: "Update Subscription Plan",
    // });
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
      header: "Price",
      accessorKey: "price",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "3",
      header: "Setup Fee",
      accessorKey: "setupFee",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "4",
      header: "Description",
      accessorKey: "description",
      show: true,
      sortDirection: "ascending",
    },
    {
      key: "5",
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
          form: "SubscriptionPlanForm",
          deleteHandler: () => handleDelete(row),
          title: "Delete Subscription Plan",
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
            <h1 className={`text-2xl font-medium`}>All Subscription Plans</h1>
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
          dataSource={data?.subscriptionPlans?.data || []}
          // dataSource={[
          //   {
          //     createdAt: "2025-08-15T10:12:45.123Z",
          //     createdBy: 2,
          //     description: "Starter plan with basic features",
          //     id: "101",
          //     name: "Starter",
          //     price: 50,
          //     setupFee: 5,
          //     status: "ACTIVE",
          //     updatedAt: "2025-08-15T10:12:45.123Z",
          //     __typename: "SubscriptionPlan",
          //   },
          //   {
          //     createdAt: "2025-08-16T08:22:30.555Z",
          //     createdBy: 3,
          //     description: "Standard plan for small businesses",
          //     id: "102",
          //     name: "Standard",
          //     price: 120,
          //     setupFee: 15,
          //     status: "ACTIVE",
          //     updatedAt: "2025-08-16T08:22:30.555Z",
          //     __typename: "SubscriptionPlan",
          //   },
          //   {
          //     createdAt: "2025-08-17T14:30:10.890Z",
          //     createdBy: 1,
          //     description: "Pro plan with advanced analytics",
          //     id: "103",
          //     name: "Pro",
          //     price: 250,
          //     setupFee: 25,
          //     status: "INACTIVE",
          //     updatedAt: "2025-08-17T14:30:10.890Z",
          //     __typename: "SubscriptionPlan",
          //   },
          //   {
          //     createdAt: "2025-08-18T09:15:55.432Z",
          //     createdBy: 2,
          //     description: "Enterprise-level subscription",
          //     id: "104",
          //     name: "Enterprise",
          //     price: 500,
          //     setupFee: 50,
          //     status: "ACTIVE",
          //     updatedAt: "2025-08-18T09:15:55.432Z",
          //     __typename: "SubscriptionPlan",
          //   },
          //   {
          //     createdAt: "2025-08-19T12:00:00.000Z",
          //     createdBy: 4,
          //     description: "Trial plan with limited access",
          //     id: "105",
          //     name: "Trial",
          //     price: 0,
          //     setupFee: 0,
          //     status: "ACTIVE",
          //     updatedAt: "2025-08-19T12:00:00.000Z",
          //     __typename: "SubscriptionPlan",
          //   },
          //   {
          //     createdAt: "2025-08-20T16:40:22.321Z",
          //     createdBy: 1,
          //     description: "Basic annual subscription",
          //     id: "106",
          //     name: "Basic Annual",
          //     price: 900,
          //     setupFee: 20,
          //     status: "INACTIVE",
          //     updatedAt: "2025-08-20T16:40:22.321Z",
          //     __typename: "SubscriptionPlan",
          //   },
          //   {
          //     createdAt: "2025-08-21T05:44:37.171Z",
          //     createdBy: 5,
          //     description: "Premium subscription with extras",
          //     id: "107",
          //     name: "Premium",
          //     price: 350,
          //     setupFee: 30,
          //     status: "ACTIVE",
          //     updatedAt: "2025-08-21T05:44:37.171Z",
          //     __typename: "SubscriptionPlan",
          //   },
          //   {
          //     createdAt: "2025-08-22T07:33:10.981Z",
          //     createdBy: 2,
          //     description: "Team plan with multi-user access",
          //     id: "108",
          //     name: "Team",
          //     price: 400,
          //     setupFee: 40,
          //     status: "INACTIVE",
          //     updatedAt: "2025-08-22T07:33:10.981Z",
          //     __typename: "SubscriptionPlan",
          //   },
          //   {
          //     createdAt: "2025-08-23T11:29:40.765Z",
          //     createdBy: 3,
          //     description: "Student plan with discount",
          //     id: "109",
          //     name: "Student",
          //     price: 30,
          //     setupFee: 5,
          //     status: "ACTIVE",
          //     updatedAt: "2025-08-23T11:29:40.765Z",
          //     __typename: "SubscriptionPlan",
          //   },
          //   {
          //     createdAt: "2025-08-24T13:00:00.000Z",
          //     createdBy: 1,
          //     description: "Custom plan for enterprises",
          //     id: "110",
          //     name: "Custom",
          //     price: 1000,
          //     setupFee: 100,
          //     status: "ACTIVE",
          //     updatedAt: "2025-08-24T13:00:00.000Z",
          //     __typename: "SubscriptionPlan",
          //   },
          // ]}
        >
          <button
            type="button"
            className={`btn btn-primary`}
            onClick={createNewSubscriptionPlan}
          >
            <PiPlusCircle className={`text-xl`} />
            Add Plan
          </button>
        </CustomTable>
      </section>
    </>
  );
}
