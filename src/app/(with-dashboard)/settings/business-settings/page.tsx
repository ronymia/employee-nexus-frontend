"use client";

import CustomTab from "@/components/ui/Tab/CustomTab";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import { IBusiness } from "@/types";
import { useQuery } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import BusinessSettingsOwnerProfile from "./tabs/BusinessSettingsOwnerProfile";
import BusinessSettingsSchedule from "./tabs/BusinessSettingsSchedule";
import BusinessSettingsSubscription from "./tabs/BusinessSettingsSubscription";
import BusinessSettingsConfig from "./tabs/BusinessSettingsConfig";
import { IUser } from "@/types/user.type";
import CustomLoading from "@/components/loader/CustomLoading";
import BusinessSettingsCard from "./components/BusinessSettingsCard";
import useAppStore from "@/stores/appStore";

export default function BusinessSettingsPage() {
  const { user } = useAppStore((state) => state);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active tab from search params, default to "owner"
  const activeTab = searchParams.get("tab") || "owner";

  const businessByIdQuery = useQuery<{
    businessById: IBusiness;
  }>(GET_BUSINESS_BY_ID, {
    variables: { id: user.businessId },
    skip: !user.businessId,
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
      <BusinessSettingsCard businessData={singleBusinessData as IBusiness} />
      <CustomTab
        tabs={[
          { title: "Owner", id: "owner" },
          { title: "Schedule", id: "schedule" },
          { title: "Subscription", id: "subscription" },
          { title: "Config", id: "config" },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className={`mt-3 w-full md:w-auto px-5`}
        gridColumns="grid-cols-4"
      />

      {/* Render content based on active tab */}
      <div className="mt-4 max-w-5xl w-full">
        {activeTab === "owner" && (
          <BusinessSettingsOwnerProfile
            key={`owner_information`}
            ownerData={singleBusinessData?.user as IUser}
          />
        )}
        {activeTab === "schedule" && (
          <BusinessSettingsSchedule
            key={`business_schedule`}
            businessSchedules={singleBusinessData?.businessSchedules || []}
          />
        )}
        {activeTab === "subscription" && <BusinessSettingsSubscription />}
        {activeTab === "config" && <BusinessSettingsConfig />}
      </div>
    </div>
  );
}
