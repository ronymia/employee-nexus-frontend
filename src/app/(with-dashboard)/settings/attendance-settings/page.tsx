"use client";

import { useState } from "react";
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

// ==================== LOADING SKELETON SUB-COMPONENT ====================
function AttendanceSettingsLoadingSkeleton() {
  return (
    <section className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 rounded"></div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex justify-center">
        <div className="w-full sm:w-[500px] grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="mt-6 space-y-6">
        {/* Card 1 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="h-6 w-56 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="h-6 w-52 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Action Button Skeleton */}
        <div className="flex justify-end">
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </section>
  );
}

export default function AttendanceSettingsPage() {
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

  if (loading) {
    return <AttendanceSettingsLoadingSkeleton />;
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Attendance Settings"
        subtitle="Configure attendance tracking and approval settings"
      />

      {/* Tabs */}
      <div className="flex justify-center">
        <CustomTab
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          gridColumns="grid-cols-3"
          containerWidth="w-full sm:w-[500px]"
          testId="attendance-settings"
        />
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === AttendanceTab.PREFERENCE && (
          <PreferenceTab
            settings={settings}
            updateSettings={updateSettings}
            isLoading={updateResult.loading}
            refetch={refetch}
          />
        )}

        {activeTab === AttendanceTab.DEFINITIONS && (
          <DefinitionsTab
            settings={settings}
            updateSettings={updateSettings}
            isLoading={updateResult.loading}
            refetch={refetch}
          />
        )}

        {activeTab === AttendanceTab.GEOLOCATION && (
          <GeolocationTab
            settings={settings}
            updateSettings={updateSettings}
            isLoading={updateResult.loading}
            refetch={refetch}
          />
        )}
      </div>
    </section>
  );
}
