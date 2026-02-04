"use client";

import { IoPlay, IoPause } from "react-icons/io5";
import CustomSelect from "@/components/form/input/CustomSelect";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import { useForm, FormProvider } from "react-hook-form";
import ProfileWelcomeCard from "./ProfileWelcomeCard";

// Mock types/interfaces for the snippet
interface ITodaysAttendanceCardV2Props {
  times?: any;
  checkedIn?: boolean;
  isGettingData?: boolean;
}

export default function TodaysAttendanceCardV2({
  times = {
    nowTime: "12:30 PM",
    todaysTotal: "04:30:00",
    totalInThisClocks: "00:00:00",
    todaysScheduledTotal: "08:00:00",
    totalRemaining: "03:30:00",
    totalOverTime: "00:00:00",
  },
  checkedIn = false,
  isGettingData = false,
}: ITodaysAttendanceCardV2Props) {
  const methods = useForm();

  // Mock Queries
  const workSiteQuery = {
    data: [
      { value: 1, label: "Remote" },
      { value: 2, label: "Office" },
    ],
    isLoading: false,
  };
  const projectQuery = {
    data: [
      { value: 1, label: "Project A" },
      { value: 2, label: "Project B" },
    ],
    isLoading: false,
  };

  const isButtonOnLoadingState = false;
  const isClockOutLoading = false;
  const isUnScheduled = false;
  const noteReq = false;

  const handleSubmitClockIn = () => console.log("Clock In");
  const handleSubmitClockOut = () => console.log("Clock Out");

  return (
    <div className="flex flex-col gap-6 h-full">
      {<ProfileWelcomeCard />}
      <FormProvider {...methods}>
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
                  {times?.nowTime}
                </div>
              </div>

              {/* TODAYS TOTAL  */}
              <div
                data-auto={`todays-attendance-total-dashboard`}
                className={`text-sm`}
              >
                Todays Total: {times?.todaysTotal}
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
                        {times?.totalInThisClocks}
                      </span>
                    </div>

                    {/* CLOCK IN AND CLOCK OUT BUTTONS  */}
                    <div>
                      {/* CLOCK IN  */}
                      {!checkedIn ? (
                        <button
                          data-auto={`todays-attendance-clock-in-button-dashboard`}
                          onClick={handleSubmitClockIn}
                          disabled={isButtonOnLoadingState} // Simplified
                          className={`flex w-34 rounded-md relative btn btn-success text-base-300 btn-sm items-center gap-2`}
                        >
                          {isButtonOnLoadingState ? (
                            <span>Loading...</span>
                          ) : (
                            <IoPlay />
                          )}
                          <span className={`z-10`}>Clock In</span>
                        </button>
                      ) : (
                        <button
                          data-auto={`todays-attendance-clock-out-button-dashboard`}
                          className={`flex rounded-md items-center w-34 text-base-300 relative btn btn-error btn-sm gap-2`}
                          disabled={isClockOutLoading}
                          onClick={handleSubmitClockOut}
                        >
                          {isClockOutLoading ? (
                            <span>Loading...</span>
                          ) : (
                            <IoPause className={`text-lg`} />
                          )}
                          <span className={`z-10 `}>Clock Out</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* FIELDS  */}
                {!checkedIn ? (
                  <div className={`grid h-20 grid-cols-1 gap-1 w-full`}>
                    <CustomSelect
                      dataAuto="work_location_select"
                      name="work_location"
                      label=""
                      required={true}
                      isLoading={workSiteQuery.isLoading || isGettingData}
                      options={workSiteQuery.data}
                      placeholder="Select Work Sites*"
                    />

                    <CustomSelect
                      dataAuto="project_select"
                      name="project_id"
                      label=""
                      required={true}
                      isLoading={projectQuery.isLoading || isGettingData}
                      options={projectQuery.data}
                      placeholder="Select project*"
                    />
                  </div>
                ) : (
                  <div className={`flex flex-col gap-2 w-full`}>
                    <CustomSelect
                      dataAuto="project_out_select"
                      name="project_id_out"
                      label=""
                      required={true}
                      isLoading={projectQuery.isLoading || isGettingData}
                      options={projectQuery.data}
                      placeholder="Select project*"
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
                      {times?.todaysScheduledTotal}
                    </span>
                  </div>

                  <div
                    className={`w-[2.1px] block bg-primary-content h-full py-5`}
                  ></div>

                  {times?.totalOverTime === "00:00:00" ? (
                    <div className={`w-1/2 text-right`}>
                      <h4>Remaining</h4>
                      <span
                        data-auto={`todays-attendance-remaining-time-dashboard`}
                      >
                        {times?.totalRemaining}
                      </span>
                    </div>
                  ) : (
                    <div className={`w-1/2 text-right text-green-500`}>
                      <h4>Extra</h4>
                      <span data-auto={`todays-attendance-overtime-dashboard`}>
                        {times?.totalOverTime}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </FormProvider>
    </div>
  );
}
