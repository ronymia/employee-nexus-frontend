"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import CustomTab from "@/components/ui/Tab/CustomTab";
import {
  GET_ATTENDANCE_SETTINGS,
  UPDATE_ATTENDANCE_SETTINGS,
} from "@/graphql/attendance-settings.api";
import {
  IAttendanceSettings,
  AttendanceTab,
} from "@/types/attendance-settings.type";
import CustomLoading from "@/components/loader/CustomLoading";
import { MdSettings, MdLocationOn } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import PreferenceTab from "./PreferenceTab";
import DefinitionsTab from "./DefinitionsTab";
import GeolocationTab from "./GeolocationTab";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <CustomLoading />
      </div>
    );
  }

  const settings = data?.attendanceSettingsByBusiness?.data;

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="mb-5">
        <h1 className="text-2xl font-medium">Attendance Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Configure attendance tracking and approval settings
        </p>
      </header>

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
