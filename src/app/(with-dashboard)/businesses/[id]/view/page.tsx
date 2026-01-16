"use client";

import CustomTab from "@/components/ui/Tab/CustomTab";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import { IBusiness } from "@/types";
import { useQuery } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import BusinessOwnerProfile from "@/app/(with-dashboard)/businesses/[id]/view/tabs/BusinessOwnerProfile";
import BusinessSchedule from "@/app/(with-dashboard)/businesses/[id]/view/tabs/BusinessSchedule";
import CustomLoading from "@/components/loader/CustomLoading";
import BusinessProfileCard from "@/app/(with-dashboard)/businesses/[id]/view/BusinessProfileCard";
import BusinessSubscription from "./tabs/BusinessSubscription";
import BusinessSettings from "./tabs/BusinessSettings";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);

  // Get active tab from search params, default to "owner"
  const activeTab = searchParams.get("tab") || "owner";

  const businessByIdQuery = useQuery<{
    businessById: {
      data: IBusiness;
    };
  }>(GET_BUSINESS_BY_ID, {
    variables: { id: Number(id) },
    skip: !id,
  });

  const singleBusinessData = businessByIdQuery.data?.businessById?.data;

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
      <BusinessProfileCard
        businessData={singleBusinessData as IBusiness}
        isLoading={businessByIdQuery.loading}
      />
      <CustomTab
        tabs={[
          { title: "Owner", id: "owner" },
          { title: "Schedule", id: "schedule" },
          { title: "Subscription", id: "subscription" },
          { title: "Settings", id: "business_settings" },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        gridColumns={`grid-cols-4`}
        className={`mt-3 w-full md:w-auto px-5`}
      />

      {/* Render content based on active tab */}
      <div className="mt-4 max-w-5xl w-full">
        {activeTab === "owner" && (
          <BusinessOwnerProfile
            key={`owner_information`}
            ownerId={singleBusinessData?.ownerId as number}
          />
        )}
        {activeTab === "schedule" && (
          <BusinessSchedule
            key={`business_schedule`}
            businessId={singleBusinessData?.id as number}
          />
        )}
        {activeTab === "subscription" && (
          <BusinessSubscription
            key={`business_subscription`}
            businessId={singleBusinessData?.id as number}
          />
        )}
        {activeTab === "business_settings" && (
          <BusinessSettings
            key={`business_settings`}
            businessId={singleBusinessData?.id as number}
          />
        )}
      </div>
    </div>
  );
}
