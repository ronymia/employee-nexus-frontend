"use client";

import { useState, useEffect } from "react";

import { IoPlay, IoPause } from "react-icons/io5";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import ProfileWelcomeCard from "./ProfileWelcomeCard";
import EmployeeProjectSelect from "@/components/input-fields/EmployeeProjectSelect";
import useAppStore from "@/hooks/useAppStore";
import EmployeeWorkSiteSelect from "@/components/input-fields/EmployeeWorkSiteSelect";
import CustomForm from "@/components/form/CustomForm";
import {
  usePunchInMutation,
  usePunchOut,
} from "@/graphql/punchIn-punchOut.api";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

// Mock types/interfaces for the snippet

export default function TodaysAttendanceCardV2() {
  const user = useAppStore((state) => state.user);
  const { punchIn, loading: punchInLoading } = usePunchInMutation();
  const { punchOut, loading: punchOutLoading } = usePunchOut();

  const loading = punchInLoading || punchOutLoading;

  // State for live clock and metrics
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [liveTodaysTotal, setLiveTodaysTotal] = useState("00:00:00");
  const [liveRemaining, setLiveRemaining] = useState("00:00:00");
  const [liveOvertime, setLiveOvertime] = useState("00:00:00");
  const [isEarlyCheckout, setIsEarlyCheckout] = useState(true);

  const isUnScheduled = false;
  const isGettingData = false;
  const noteReq = false;

  // GraphQL query for today's attendance
  const GET_TODAY_ATTENDANCE = gql`
    query GetTodayAttendance {
      getTodayAttendance {
        message
        statusCode
        success
        data {
          id
          userId
          date
          scheduleMinutes
          totalMinutes
          breakMinutes
          status
          createdAt
          updatedAt
          user {
            id
            email
            profile {
              fullName
            }
          }
          punchRecords {
            id
            attendanceId
            projectId
            workSiteId
            punchIn
            punchOut
            breakStart
            breakEnd
            workMinutes
            breakMinutes
            punchInIp
            punchOutIp
            punchInLat
            punchInLng
            punchOutLat
            punchOutLng
            punchInDevice
            punchOutDevice
            notes
            createdAt
            updatedAt
          }
        }
      }
    }
  `;

  const getTodayPunchInRecords = useQuery<any>(GET_TODAY_ATTENDANCE);

  const attendanceDataForCheck =
    getTodayPunchInRecords.data?.getTodayAttendance?.data;
  const activePunchRecord = attendanceDataForCheck?.punchRecords?.find(
    (record: any) => record.punchIn && !record.punchOut,
  );

  const checkedIn = !!activePunchRecord;

  // console.log({ punchRecords: getTodayPunchInRecords.data });

  // Helper function to convert minutes to HH:MM:SS
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Get attendance data for calculations
  const attendanceData = getTodayPunchInRecords.data?.getTodayAttendance?.data;

  // Initialize punchRecords object
  const punchRecords = {
    nowTime: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    todaysTotal: liveTodaysTotal,
    totalInThisCheckIn: elapsedTime,
    todaysScheduledTotal: minutesToTime(attendanceData?.scheduleMinutes || 0),
    totalRemaining: liveRemaining,
    totalOverTime: liveOvertime,
  };

  // Calculate elapsed time and live metrics from punch-in
  useEffect(() => {
    const attendanceData =
      getTodayPunchInRecords.data?.getTodayAttendance?.data;
    const activePunchRecord = attendanceData?.punchRecords?.find(
      (record: any) => record.punchIn && !record.punchOut,
    );

    if (!activePunchRecord?.punchIn || !attendanceData) {
      setElapsedTime("00:00:00");
      setLiveTodaysTotal(minutesToTime(attendanceData?.totalMinutes || 0));
      setIsEarlyCheckout(false);

      const scheduleMinutes = attendanceData?.scheduleMinutes || 0;
      const totalMinutes = attendanceData?.totalMinutes || 0;
      const remainingMinutes = scheduleMinutes - totalMinutes;

      if (remainingMinutes > 0) {
        setLiveRemaining(minutesToTime(remainingMinutes));
        setLiveOvertime("00:00:00");
      } else {
        setLiveRemaining("00:00:00");
        setLiveOvertime(minutesToTime(Math.abs(remainingMinutes)));
      }
      return;
    }

    const calculateLiveMetrics = () => {
      const punchInTime = new Date(activePunchRecord.punchIn).getTime();
      const now = Date.now();
      const elapsedMs = now - punchInTime;
      const elapsedMinutes = elapsedMs / (1000 * 60);

      // Calculate elapsed time for current punch
      const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
      const elapsedTimeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

      // 1-minute restriction check
      if (elapsedMs < 60 * 1000) {
        setIsEarlyCheckout(true);
      } else {
        setIsEarlyCheckout(false);
      }

      // Calculate live total (API totalMinutes + current elapsed minutes)
      const totalMinutesFromAPI = attendanceData.totalMinutes || 0;
      const liveTotalMinutes = totalMinutesFromAPI + elapsedMinutes;
      const scheduleMinutes = attendanceData.scheduleMinutes || 0;

      // Calculate live remaining/overtime
      const remainingMinutes = scheduleMinutes - liveTotalMinutes;

      setElapsedTime(elapsedTimeStr);
      setLiveTodaysTotal(minutesToTime(liveTotalMinutes));

      if (remainingMinutes > 0) {
        setLiveRemaining(minutesToTime(remainingMinutes));
        setLiveOvertime("00:00:00");
      } else {
        setLiveRemaining("00:00:00");
        setLiveOvertime(minutesToTime(Math.abs(remainingMinutes)));
      }
    };

    // Update immediately
    calculateLiveMetrics();

    // Update every second
    const interval = setInterval(() => {
      calculateLiveMetrics();
    }, 1000);

    return () => clearInterval(interval);
  }, [getTodayPunchInRecords.data]);

  const handleSubmit = async (data: any) => {
    try {
      if (checkedIn) {
        // Handle Punch Out
        const res = await punchOut({
          variables: {
            input: {
              punchId: Number(activePunchRecord.id),
              punchOutIp: "1",
              punchOutLat: 0,
              punchOutLng: 0,
              punchOutDevice: "web",
              notes: data.note,
            },
          },
        });
        if (res.data?.punchOut?.statusCode === 200) {
          getTodayPunchInRecords.refetch();
        }
      } else {
        // Handle Punch In
        const res = await punchIn({
          variables: {
            punchInInput: {
              projectId: Number(data.project_id),
              workSiteId: Number(data.work_location),
              punchInIp: "1",
              punchInLat: 0,
              punchInLng: 0,
              punchInDevice: "web",
            },
          },
        });
        if (res.data?.punchIn?.statusCode === 200) {
          getTodayPunchInRecords.refetch();
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Profile Welcome Card */}
      <ProfileWelcomeCard />

      {/* Attendance Form */}
      <CustomForm submitHandler={handleSubmit}>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col flex-1">
          {isGettingData ? (
            <div className={`flex flex-col w-full`}>
              {/* SKELETON LOADER */}
              <div className={`flex justify-between items-center`}>
                <div
                  className={`bg-gray-200 animate-pulse py-3 px-10 mt-1 w-36 rounded-[5px]`}
                ></div>
                <div
                  className={`bg-gray-200 animate-pulse py-2 px-10 mt-1 w-32 rounded-[5px]`}
                ></div>
              </div>
              <div
                className={`bg-gray-200 animate-pulse py-2 px-10 mt-1 w-32 rounded-[5px]`}
              ></div>
              <div
                className={`flex mt-2 flex-col justify-center items-center w-full`}
              >
                <div
                  className={`bg-gray-200 my-t animate-pulse py-20 w-full  rounded-md`}
                ></div>
              </div>
              <div className={`flex justify-between items-center w-full mt-4`}>
                <div
                  className={` bottom-0 w-1/4 bg-gray-200 animate-pulse h-10 rounded-[5px]`}
                ></div>
                <div
                  className={` bottom-0 w-1/4 bg-gray-200 animate-pulse h-10 rounded-[5px]`}
                ></div>
              </div>
            </div>
          ) : (
            <>
              {/* TITLE AND TIME  */}
              <div className={`flex justify-between items-center `}>
                <h1 className={`text-lg block font-semibold`}>
                  Today&apos;s Attendance
                </h1>
                <div
                  data-auto={`todays-attendance-time-dashboard`}
                  className={` text-xs font-bold `}
                >
                  {punchRecords?.nowTime}
                </div>
              </div>

              {/* TODAYS TOTAL  */}
              <div
                data-auto={`todays-attendance-total-dashboard`}
                className={`text-sm`}
              >
                Todays Total: {punchRecords?.todaysTotal}
              </div>

              {/* MAIN AREA  */}
              <div
                className={`w-full min-h-[160px] h-auto max-h-[400px] mt-2 rounded-md bg-primary-content p-2`}
              >
                <div>
                  <div className={`flex justify-between items-center pb-2`}>
                    {/* THIS CLOCK IN TIMER  */}
                    <div>
                      <span
                        data-auto={`todays-attendance-total-in-this-clock-dashboard`}
                        className={`font-bold text-2xl`}
                      >
                        {punchRecords?.totalInThisCheckIn}
                      </span>
                    </div>

                    {/* CLOCK IN AND CLOCK OUT BUTTONS  */}
                    <div>
                      {/* CLOCK IN  */}
                      {!checkedIn ? (
                        <button
                          data-auto={`todays-attendance-clock-in-button-dashboard`}
                          type="submit"
                          disabled={loading} // Simplified
                          className={`flex w-34 rounded-md relative btn btn-success text-base-300 btn-sm items-center gap-2`}
                        >
                          {loading ? <span>Loading...</span> : <IoPlay />}
                          <span className={`z-10`}>Check In</span>
                        </button>
                      ) : (
                        <div
                          className="tooltip tooltip-bottom"
                          data-tip={
                            isEarlyCheckout
                              ? "As per system policy, you cannot check out within 1 minute of checking in."
                              : ""
                          }
                        >
                          <button
                            data-auto={`todays-attendance-clock-out-button-dashboard`}
                            className={`flex rounded-md items-center w-34 text-base-300 relative btn btn-error btn-sm gap-2 ${
                              isEarlyCheckout ? "btn-disabled opacity-50" : ""
                            }`}
                            disabled={loading || isEarlyCheckout}
                            type="submit"
                          >
                            {loading ? (
                              <span>Loading...</span>
                            ) : (
                              <IoPause className={`text-lg`} />
                            )}
                            <span className={`z-10 `}>Checkout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* FIELDS  */}
                {!checkedIn ? (
                  <div className={`grid h-20 grid-cols-1 gap-1 w-full`}>
                    <EmployeeWorkSiteSelect
                      dataAuto="work_location_select"
                      name="work_location"
                      label=""
                      required={true}
                      placeholder="Select Work Sites*"
                      query={{
                        userId: user?.id,
                      }}
                    />

                    <EmployeeProjectSelect
                      dataAuto="project_select"
                      name="project_id"
                      label=""
                      required={true}
                      placeholder="Select project*"
                      query={{
                        userId: user?.id,
                      }}
                    />
                  </div>
                ) : (
                  <div className={`flex flex-col gap-2 w-full`}>
                    <EmployeeProjectSelect
                      dataAuto="project_select"
                      name="project_id"
                      label=""
                      required={true}
                      placeholder="Select project*"
                      query={{
                        userId: user?.id,
                      }}
                    />
                    <CustomTextareaField
                      dataAuto="note_textarea"
                      name="note" // Adjusted name
                      required={isUnScheduled || noteReq}
                      placeholder={`Note ${
                        isUnScheduled || noteReq ? "(required)" : "(optional)"
                      }`}
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {!isUnScheduled && (
                <div
                  className={`bottom-0 w-full py-1 flex justify-start items-center gap-2 font-semibold mt-2`}
                >
                  <div className={`w-1/2`}>
                    <h4>Scheduled</h4>
                    <span
                      data-auto={`todays-attendance-remaining-time-dashboard`}
                    >
                      {punchRecords?.todaysScheduledTotal}
                    </span>
                  </div>

                  <div
                    className={`w-[2.1px] block bg-primary-content h-full py-5`}
                  ></div>

                  {punchRecords?.totalOverTime === "00:00:00" ? (
                    <div className={`w-1/2 text-right`}>
                      <h4>Remaining</h4>
                      <span
                        data-auto={`todays-attendance-remaining-time-dashboard`}
                      >
                        {punchRecords?.totalRemaining}
                      </span>
                    </div>
                  ) : (
                    <div className={`w-1/2 text-right text-green-500`}>
                      <h4>Extra</h4>
                      <span data-auto={`todays-attendance-overtime-dashboard`}>
                        {punchRecords?.totalOverTime}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </CustomForm>
    </div>
  );
}
