"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import CustomTab from "@/components/ui/Tab/CustomTab";
import PageHeader from "@/components/ui/PageHeader";
import { GET_BUSINESS_BY_ID } from "@/graphql/business.api";
import { IBusiness } from "@/types";
import BusinessProfileCard from "../businesses/[id]/view/BusinessProfileCard";
import BusinessSchedule from "../businesses/[id]/view/tabs/BusinessSchedule";
import BusinessConfig from "./tabs/BusinessConfig";
import useAppStore from "@/stores/appStore";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import {
  MdCalendarToday,
  MdCardMembership,
  MdSettings,
  MdBlock,
} from "react-icons/md";
import BusinessSubscription from "../businesses/[id]/view/tabs/BusinessSubscription";

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

  // CHECK PERMISSION
  if (!hasPermission(Permissions.BusinessSettingsRead)) {
    return <AccessDeniedMessage />;
  }

  // SHOW LOADING SKELETON
  if (loading) {
    return <BusinessProfileLoadingSkeleton />;
  }

  const businessData = data?.businessById.data;

  // ==================== RENDER ====================
  return (
    <section className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-6 space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Business Profile"
        subtitle="Manage your business profile, schedule, and configuration"
      />

      {/* BUSINESS INFO CARD */}
      <div className="flex justify-center">
        <div className="w-full max-w-5xl">
          <BusinessProfileCard
            businessData={businessData as IBusiness}
            isLoading={loading}
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex justify-center">
        <div className="w-full max-w-5xl flex justify-center">
          <CustomTab
            tabs={availableTabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            gridColumns={`grid-cols-${availableTabs.length}`}
          />
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="flex justify-center">
        <div className="w-full max-w-5xl">
          {activeTab === "schedule" && (
            <BusinessSchedule
              key="business_schedule"
              businessSchedules={businessData?.businessSchedules || []}
            />
          )}

          {activeTab === "subscription" && (
            <BusinessSubscription businessId={businessData?.id as number} />
          )}

          {activeTab === "config" && <BusinessConfig />}
        </div>
      </div>
    </section>
  );
}
