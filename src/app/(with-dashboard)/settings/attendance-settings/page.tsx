"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import CustomTab from "@/components/ui/Tab/CustomTab";
import {
  GET_ATTENDANCE_SETTINGS,
  UPDATE_ATTENDANCE_SETTINGS,
} from "@/graphql/attendance-settings.api";
import { IAttendanceSettings, AttendanceTab } from "@/types";
import { MdSettings, MdLocationOn } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import PageHeader from "@/components/ui/PageHeader";
import PreferenceTab from "./PreferenceTab";
import DefinitionsTab from "./DefinitionsTab";
import GeolocationTab from "./GeolocationTab";

// ==================== ATTENDANCE SETTINGS PAGE COMPONENT ====================
export default function AttendanceSettingsPage() {
  // ==================== HOOKS ====================
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(AttendanceTab.PREFERENCE);

  // GET ATTENDANCE SETTINGS
  const { data, loading, refetch } = useQuery<{
    attendanceSettingsByBusiness: {
      message: string;
      statusCode: number;
      success: boolean;
      data: IAttendanceSettings;
    };
  }>(GET_ATTENDANCE_SETTINGS, {});

  // UPDATE ATTENDANCE SETTINGS
  const [updateSettings, updateResult] = useMutation(
    UPDATE_ATTENDANCE_SETTINGS,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_ATTENDANCE_SETTINGS }],
    }
  );

  // SYNC ACTIVE TAB WITH URL SEARCH PARAMS
  useEffect(() => {
    const tabParam = searchParams.get("tab");

    // VALIDATE AND SET TAB FROM URL
    if (tabParam) {
      const validTabs = Object.values(AttendanceTab);
      if (validTabs.includes(tabParam as AttendanceTab)) {
        setActiveTab(tabParam);
      } else {
        // INVALID TAB - REDIRECT TO DEFAULT
        router.replace(`?tab=${AttendanceTab.PREFERENCE}`);
      }
    } else {
      // NO TAB PARAM - SET DEFAULT
      router.replace(`?tab=${AttendanceTab.PREFERENCE}`);
    }
  }, [searchParams, router]);

  // HANDLE TAB CHANGE AND UPDATE URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  // TAB CONFIGURATION
  const tabs = [
    {
      id: AttendanceTab.PREFERENCE,
      title: "Preference",
      Icon: MdSettings,
    },
    {
      id: AttendanceTab.DEFINITIONS,
      title: "Definitions",
      Icon: FaListUl,
    },
    {
      id: AttendanceTab.GEOLOCATION,
      title: "Geolocation & IP",
      Icon: MdLocationOn,
    },
  ];

  const settings = data?.attendanceSettingsByBusiness?.data;

  // ==================== RENDER ====================
  return (
    <section className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Attendance Settings"
        subtitle="Configure attendance tracking and approval settings"
      />

      {/* TABS */}
      <div className="flex justify-center">
        <CustomTab
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          gridColumns="grid-cols-3"
          containerWidth="w-full sm:w-[500px]"
          testId="attendance-settings"
        />
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6">
        {activeTab === AttendanceTab.PREFERENCE && (
          <PreferenceTab
            settings={settings}
            updateSettings={updateSettings}
            isLoading={loading || updateResult.loading}
            refetch={refetch}
          />
        )}

        {activeTab === AttendanceTab.DEFINITIONS && (
          <DefinitionsTab
            settings={settings}
            updateSettings={updateSettings}
            isLoading={loading || updateResult.loading}
            refetch={refetch}
          />
        )}

        {activeTab === AttendanceTab.GEOLOCATION && (
          <GeolocationTab
            settings={settings}
            updateSettings={updateSettings}
            isLoading={loading || updateResult.loading}
            refetch={refetch}
          />
        )}
      </div>
    </section>
  );
}
