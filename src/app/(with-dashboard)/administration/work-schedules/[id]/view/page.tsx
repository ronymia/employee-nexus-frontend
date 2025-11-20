"use client";

import CustomTab from "@/components/ui/Tab/CustomTab";
import { GET_WORK_SCHEDULE_BY_ID } from "@/graphql/work-schedules.api";
import { IWorkSchedule } from "@/types";
import { useQuery } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import WorkScheduleSchedules from "./tabs/WorkScheduleSchedules";
import CustomLoading from "@/components/loader/CustomLoading";
import WorkScheduleDetails from "./tabs/WorkScheduleDetails";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);

  // Get active tab from search params, default to "details"
  const activeTab = searchParams.get("tab") || "details";

  const workScheduleByIdQuery = useQuery<{
    workScheduleById: {
      data: IWorkSchedule;
    };
  }>(GET_WORK_SCHEDULE_BY_ID, {
    variables: { id: Number(id) },
    skip: !id,
  });

  const singleWorkScheduleData =
    workScheduleByIdQuery.data?.workScheduleById?.data;

  // Handle tab change and update search params
  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (workScheduleByIdQuery.loading) {
    return <CustomLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* HEADER */}
      <div className="max-w-5xl w-full mb-4">
        <h1 className="text-2xl font-bold">{singleWorkScheduleData?.name}</h1>
        <p className="text-gray-600">{singleWorkScheduleData?.description}</p>
      </div>

      <CustomTab
        tabs={[
          { title: "Details", id: "details" },
          { title: "Schedules", id: "schedules" },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className={`mt-3 w-full md:w-auto px-5`}
      />

      {/* Render content based on active tab */}
      <div className="mt-4 max-w-5xl w-full">
        {activeTab === "details" && (
          <WorkScheduleDetails
            key={`work_schedule_details`}
            workScheduleData={singleWorkScheduleData as IWorkSchedule}
          />
        )}
        {activeTab === "schedules" && (
          <WorkScheduleSchedules
            key={`work_schedule_schedules`}
            schedules={singleWorkScheduleData?.schedules || []}
          />
        )}
      </div>
    </div>
  );
}
