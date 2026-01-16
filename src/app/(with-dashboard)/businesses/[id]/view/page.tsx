"use client";

import { lazy, Suspense, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";

import CustomTab from "@/components/ui/Tab/CustomTab";
import CustomLoading from "@/components/loader/CustomLoading";
import BusinessProfileCard from "@/app/(with-dashboard)/businesses/[id]/view/BusinessProfileCard";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import { IBusiness } from "@/types";

// ==================== LAZY LOADED COMPONENTS ====================
const BusinessOwnerProfile = lazy(
  () =>
    import(
      "@/app/(with-dashboard)/businesses/[id]/view/tabs/BusinessOwnerProfile"
    )
);
const BusinessSchedule = lazy(
  () =>
    import("@/app/(with-dashboard)/businesses/[id]/view/tabs/BusinessSchedule")
);
const BusinessSubscription = lazy(() => import("./tabs/BusinessSubscription"));
const BusinessSettings = lazy(() => import("./tabs/BusinessSettings"));

// ==================== TAB LOADING SKELETON ====================
function TabLoadingFallback() {
  return (
    <div className="max-w-5xl w-full p-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-300 rounded mb-4" />
      <div className="space-y-3">
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
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

  // ==================== MEMOIZED TAB CONTENT ====================
  const tabContent = useMemo(() => {
    if (!singleBusinessData) return null;

    const tabComponents = {
      owner: (
        <BusinessOwnerProfile
          key="owner_information"
          ownerId={singleBusinessData.ownerId as number}
        />
      ),
      schedule: (
        <BusinessSchedule
          key="business_schedule"
          businessId={singleBusinessData.id as number}
        />
      ),
      subscription: (
        <BusinessSubscription
          key="business_subscription"
          businessId={singleBusinessData.id as number}
        />
      ),
      business_settings: (
        <BusinessSettings
          key="business_settings"
          businessId={singleBusinessData.id as number}
        />
      ),
    };

    return tabComponents[activeTab as keyof typeof tabComponents] || null;
  }, [activeTab, singleBusinessData]);

  // ==================== LOADING STATE ====================
  if (businessByIdQuery.loading) {
    return <CustomLoading />;
  }

  // ==================== RENDER ====================
  return (
    <div className={`flex flex-col items-center justify-center w-full`}>
      {/* HEADER */}
      {/* BUSINESS INFO CARD */}
      <div className={`max-w-5xl w-full`}>
        <BusinessProfileCard
          businessData={singleBusinessData as IBusiness}
          isLoading={businessByIdQuery.loading}
        />
      </div>

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

      {/* TAB CONTENT WITH SUSPENSE */}
      <div className="mt-4 max-w-5xl w-full">
        <Suspense fallback={<TabLoadingFallback />}>{tabContent}</Suspense>
      </div>
    </div>
  );
}
