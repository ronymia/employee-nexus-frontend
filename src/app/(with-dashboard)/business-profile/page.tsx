"use client";

import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";

import CustomTab from "@/components/ui/Tab/CustomTab";
import PageHeader from "@/components/ui/PageHeader";
import BusinessProfileCard from "../businesses/[id]/view/BusinessProfileCard";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import { IBusiness } from "@/types";
import useAppStore from "@/stores/appStore";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import {
  MdCalendarToday,
  MdCardMembership,
  MdSettings,
  MdBlock,
} from "react-icons/md";

// ==================== LAZY LOADED TAB COMPONENTS ====================
const BusinessSchedule = lazy(
  () => import("../businesses/[id]/view/tabs/BusinessSchedule")
);
const BusinessSubscription = lazy(
  () => import("../businesses/[id]/view/tabs/BusinessSubscription")
);
const BusinessSettings = lazy(
  () => import("../businesses/[id]/view/tabs/BusinessSettings")
);

// ==================== TAB LOADING SKELETON ====================
function TabLoadingFallback() {
  return (
    <div className="max-w-5xl w-full p-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-300 rounded mb-4" />
      <div className="space-y-3">
        <div className="h-24 bg-gray-200 rounded" />
        <div className="h-24 bg-gray-200 rounded" />
        <div className="h-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ==================== LOADING SKELETON SUB-COMPONENT ====================
function BusinessProfileLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-6 animate-pulse">
      {/* BUSINESS CARD SKELETON */}
      <div className="w-full max-w-5xl bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 bg-gray-300 rounded"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* TABS SKELETON */}
      <div className="w-full max-w-5xl grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded-md"></div>
        ))}
      </div>

      {/* CONTENT SKELETON */}
      <div className="w-full max-w-5xl bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="h-6 w-32 bg-gray-300 rounded"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// ==================== ACCESS DENIED SUB-COMPONENT ====================
function AccessDeniedMessage() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md p-8 bg-white rounded-lg border border-red-200 shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <MdBlock className="text-4xl text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600 leading-relaxed">
          You don't have permission to view business profile. Please contact
          your administrator for access.
        </p>
      </div>
    </div>
  );
}

// ==================== BUSINESS PROFILE PAGE COMPONENT ====================
export default function BusinessProfilePage() {
  // ==================== HOOKS ====================
  const { user } = useAppStore((state) => state);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasPermission } = usePermissionGuard();
  const [activeTab, setActiveTab] = useState<string>("schedule");

  // GET BUSINESS DATA
  const { data, loading } = useQuery<{
    businessById: {
      data: IBusiness;
    };
  }>(GET_BUSINESS_BY_ID, {
    variables: { id: user.businessId },
    skip: !user.businessId,
  });

  const businessData = data?.businessById.data;

  // FILTER TABS BASED ON PERMISSIONS
  const availableTabs = useMemo(() => {
    const allTabs = [
      {
        title: "Schedule",
        id: "schedule",
        Icon: MdCalendarToday,
        permission: Permissions.WorkScheduleRead,
      },
      {
        title: "Subscription",
        id: "subscription",
        Icon: MdCardMembership,
        permission: Permissions.WorkScheduleRead,
      },
      {
        title: "Config",
        id: "config",
        Icon: MdSettings,
        permission: Permissions.BusinessSettingsRead,
      },
    ];
    return allTabs.filter(
      (tab) => !tab.permission || hasPermission(tab.permission)
    );
  }, [hasPermission]);

  // SYNC ACTIVE TAB WITH URL SEARCH PARAMS
  useEffect(() => {
    const tabParam = searchParams.get("tab");

    // VALIDATE AND SET TAB FROM URL
    if (tabParam) {
      const validTabIds = availableTabs.map((t) => t.id);
      if (validTabIds.includes(tabParam)) {
        setActiveTab(tabParam);
      } else {
        // INVALID TAB - REDIRECT TO FIRST AVAILABLE
        const firstTab = availableTabs[0]?.id || "schedule";
        router.replace(`?tab=${firstTab}`);
      }
    } else {
      // NO TAB PARAM - SET FIRST AVAILABLE
      const firstTab = availableTabs[0]?.id || "schedule";
      router.replace(`?tab=${firstTab}`);
    }
  }, [searchParams, router, availableTabs]);

  // HANDLE TAB CHANGE AND UPDATE URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`?tab=${tabId}`, { scroll: false });
  };

  // ==================== MEMOIZED TAB CONTENT ====================
  const tabContent = useMemo(() => {
    if (!businessData?.id) return null;

    const tabComponents = {
      schedule: (
        <BusinessSchedule
          key={`business_schedule_${businessData.id}`}
          businessId={businessData.id as number}
        />
      ),
      subscription: (
        <BusinessSubscription
          key={`business_subscription_${businessData.id}`}
          businessId={businessData.id as number}
        />
      ),
      config: (
        <BusinessSettings
          key={`business_settings_${businessData.id}`}
          businessId={businessData.id as number}
        />
      ),
    };

    return tabComponents[activeTab as keyof typeof tabComponents] || null;
  }, [activeTab, businessData?.id]);

  // CHECK PERMISSION
  if (!hasPermission(Permissions.BusinessSettingsRead)) {
    return <AccessDeniedMessage />;
  }

  // SHOW LOADING SKELETON
  if (loading) {
    return <BusinessProfileLoadingSkeleton />;
  }

  // ==================== RENDER ====================
  return (
    <section
      className={`min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-6 space-y-6 flex flex-col items-center justify-center w-full`}
    >
      {/* HEADER */}
      <PageHeader
        title="Business Profile"
        subtitle="Manage your business profile, schedule, and configuration"
        className={`self-start`}
      />

      {/* BUSINESS INFO CARD */}
      <div className={`max-w-5xl w-full`}>
        <BusinessProfileCard
          businessData={businessData as IBusiness}
          isLoading={loading}
        />
      </div>

      {/* TABS */}
      <CustomTab
        tabs={availableTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        gridColumns={`grid-cols-${availableTabs.length}`}
      />

      {/* TAB CONTENT WITH SUSPENSE */}
      <div className={`w-full max-w-5xl`}>
        <Suspense fallback={<TabLoadingFallback />}>{tabContent}</Suspense>
      </div>
    </section>
  );
}
