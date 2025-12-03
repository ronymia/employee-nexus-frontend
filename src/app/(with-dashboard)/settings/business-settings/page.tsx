"use client";

import CustomTab from "@/components/ui/Tab/CustomTab";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import { IBusiness } from "@/types";
import { useQuery } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useMemo } from "react";
import BusinessSettingsOwnerProfile from "./tabs/BusinessSettingsOwnerProfile";
import BusinessSettingsSchedule from "./tabs/BusinessSettingsSchedule";
import BusinessSettingsSubscription from "./tabs/BusinessSettingsSubscription";
import BusinessSettingsConfig from "./tabs/BusinessSettingsConfig";
import { IUser } from "@/types";
import CustomLoading from "@/components/loader/CustomLoading";
import BusinessSettingsCard from "./components/BusinessSettingsCard";
import useAppStore from "@/stores/appStore";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";

export default function BusinessSettingsPage() {
  const { user } = useAppStore((state) => state);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasPermission } = usePermissionGuard();

  // Get active tab from search params, default to "owner"
  const activeTab = searchParams.get("tab") || "owner";

  const businessByIdQuery = useQuery<{
    businessById: {
      data: IBusiness;
    };
  }>(GET_BUSINESS_BY_ID, {
    variables: { id: user.businessId },
    skip: !user.businessId,
  });

  const singleBusinessData = businessByIdQuery.data?.businessById.data;

  // Handle tab change and update search params
  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Filter tabs based on permissions
  const availableTabs = useMemo(() => {
    const allTabs = [
      { title: "Owner", id: "owner", permission: Permissions.UserRead },
      {
        title: "Schedule",
        id: "schedule",
        permission: Permissions.WorkScheduleRead,
      },
      {
        title: "Subscription",
        id: "subscription",
        permission: Permissions.WorkScheduleRead,
      },
      {
        title: "Config",
        id: "config",
        permission: Permissions.BusinessSettingsRead,
      },
    ];
    return allTabs.filter(
      (tab) => !tab.permission || hasPermission(tab.permission)
    );
  }, [hasPermission]);

  // Check if user has permission to view business settings
  if (!hasPermission(Permissions.BusinessSettingsRead)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-2">Access Denied</h2>
          <p className="text-base-content/70">
            You don't have permission to view business settings.
          </p>
        </div>
      </div>
    );
  }

  if (businessByIdQuery.loading) {
    return <CustomLoading />;
  }
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* HEADER */}
      <BusinessSettingsCard businessData={singleBusinessData as IBusiness} />
      <CustomTab
        tabs={availableTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className={`mt-3 w-full md:w-auto px-5`}
        gridColumns={`grid-cols-${availableTabs.length}`}
      />

      {/* Render content based on active tab */}
      <div className="mt-4 max-w-5xl w-full">
        {activeTab === "owner" && (
          <BusinessSettingsOwnerProfile
            key={`owner_information`}
            ownerData={singleBusinessData?.owner as IUser}
          />
        )}
        {activeTab === "schedule" && (
          <BusinessSettingsSchedule
            key={`business_schedule`}
            businessSchedules={singleBusinessData?.businessSchedules || []}
          />
        )}
        {activeTab === "subscription" && (
          <BusinessSettingsSubscription
            subscriptionPlan={singleBusinessData?.subscriptionPlan as any}
          />
        )}
        {activeTab === "config" && <BusinessSettingsConfig />}
      </div>
    </div>
  );
}
