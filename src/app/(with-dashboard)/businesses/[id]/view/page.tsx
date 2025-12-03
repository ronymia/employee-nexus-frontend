"use client";

import CustomTab from "@/components/ui/Tab/CustomTab";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import { IBusiness } from "@/types";
import { useQuery } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import OwnerProfile from "./tabs/OwnerProfile";
import BusinessSchedule from "./tabs/BusinessSchedule";
import BusinessSubscription from "./tabs/BusinessSubscription";
import { IUser } from "@/types/user.type";
import CustomLoading from "@/components/loader/CustomLoading";
import BusinessCard from "@/app/(with-dashboard)/businesses/[id]/view/components/BusinessCard";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);

  // Get active tab from search params, default to "owner"
  const activeTab = searchParams.get("tab") || "owner";

  const businessByIdQuery = useQuery<{
    businessById: IBusiness;
  }>(GET_BUSINESS_BY_ID, {
    variables: { id: Number(id) },
    skip: !id,
  });

  const singleBusinessData = businessByIdQuery.data?.businessById;

  // Handle tab change and update search params
  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (businessByIdQuery.loading) {
    return <CustomLoading />;
  }
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* HEADER */}
      <BusinessCard businessData={singleBusinessData as IBusiness} />
      <CustomTab
        tabs={[
          { title: "Owner", id: "owner" },
          { title: "Schedule", id: "schedule" },
          { title: "Subscription", id: "subscription" },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className={`mt-3 w-full md:w-auto px-5`}
      />

      {/* Render content based on active tab */}
      <div className="mt-4 max-w-5xl w-full">
        {activeTab === "owner" && (
          <OwnerProfile
            key={`owner_information`}
            ownerData={singleBusinessData?.owner as IUser}
          />
        )}
        {activeTab === "schedule" && (
          <BusinessSchedule
            key={`business_schedule`}
            businessSchedules={singleBusinessData?.businessSchedules || []}
          />
        )}
        {activeTab === "subscription" && <BusinessSubscription />}
      </div>
    </div>
  );
}
