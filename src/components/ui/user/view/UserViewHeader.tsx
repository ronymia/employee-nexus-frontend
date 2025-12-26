"use client";

import dayjs from "dayjs";
import ImageUploader from "../../uploader/ImageUploader";

interface ProfileHeaderProps {
  employee?: {
    fullName: string;
    employmentType: string;
    designation: string;
    employeeId: string;
    joiningDate: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    department: string;
    gender: string;
    profileImage?: string;
  };
  // workSchedule?: {
  //   today: {
  //     scheduled: number;
  //     worked: number;
  //     overtime: number;
  //     leave: number;
  //   };
  //   week: {
  //     scheduled: number;
  //     worked: number;
  //     overtime: number;
  //     leave: number;
  //   };
  //   month: {
  //     scheduled: number;
  //     worked: number;
  //     overtime: number;
  //     leave: number;
  //   };
  // };
}

export default function ProfileHeader({
  employee,
}: // workSchedule,
ProfileHeaderProps) {
  // Default mock data
  const defaultEmployee = {
    fullName: "Mr Saadman Galib",
    employmentType: "Full-Time",
    designation: "Frontend Developer",
    employeeId: "WS-0010",
    joiningDate: "07 Jul 2025",
    updatedAt: "02 October, 2025",
    phone: "01741082804",
    email: "saadmangalib@gmail.com",
    dateOfBirth: "07 Jul 2011",
    department: "Frontend Developer",
    gender: "Male",
  };

  const defaultWorkSchedule = {
    today: { scheduled: 7.98, worked: 6.5, overtime: 0, leave: 0 },
    week: { scheduled: 47.88, worked: 40, overtime: 2, leave: 0 },
    month: { scheduled: 207.48, worked: 180, overtime: 5, leave: 8 },
  };

  const emp = employee || defaultEmployee;
  const schedule = defaultWorkSchedule;

  const chartData = [
    {
      period: "Today",
      worked: schedule.today.worked,
      overtime: schedule.today.overtime,
      leave: schedule.today.leave,
    },
    {
      period: "Week",
      worked: schedule.week.worked,
      overtime: schedule.week.overtime,
      leave: schedule.week.leave,
    },
    {
      period: "Month",
      worked: schedule.month.worked,
      overtime: schedule.month.overtime,
      leave: schedule.month.leave,
    },
  ];

  return (
    <div className="p-3 bg-white">
      <div className="w-full">
        {/* Avatar and Basic Info */}
        <div className="shadow-md rounded-xl text-base-300 p-6 md:p-8 bg-linear-to-tr from-primary to-primary/50 relative">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 justify-center">
              <div className="shrink-0">
                <ImageUploader
                  name={`Profile`}
                  type="circular"
                  defaultImage={employee?.profileImage || ""}
                  handleGetImage={() => {}}
                  isLoading={false}
                />
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-xl md:text-2xl font-bold text-base-300 mb-1">
                  {emp.fullName}
                </h2>
                <p className="text-sm text-base-300/80 font-medium">
                  {emp.designation}
                </p>
                <p className="text-xs text-base-300/70">{emp.employmentType}</p>
              </div>
            </div>

            {/* Employee Details */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-base-300/60 font-medium uppercase tracking-wide">
                    Employee ID
                  </label>
                  <p className="text-sm font-semibold text-base-300">
                    {emp.employeeId}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-base-300/60 font-medium uppercase tracking-wide">
                    Phone
                  </label>
                  <p className="text-sm font-semibold text-base-300">
                    {emp.phone}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-base-300/60 font-medium uppercase tracking-wide">
                    Email
                  </label>
                  <a
                    href={`mailto:${emp.email}`}
                    className="text-sm font-semibold text-base-300 hover:underline block truncate"
                  >
                    {emp.email}
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-base-300/60 font-medium uppercase tracking-wide">
                    Date of Birth
                  </label>
                  <p className="text-sm font-semibold text-base-300">
                    {dayjs(emp.dateOfBirth, "DD-MM-YYYY").format(
                      "DD MMM, YYYY"
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-base-300/60 font-medium uppercase tracking-wide">
                    Department
                  </label>
                  <p className="text-sm font-semibold text-base-300">
                    {emp.department}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-base-300/60 font-medium uppercase tracking-wide">
                    Gender
                  </label>
                  <p className="text-sm font-semibold text-base-300">
                    {emp.gender}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs text-base-300/60 font-medium uppercase tracking-wide">
                  Joined At
                </label>
                <p className="text-sm font-semibold text-base-300">
                  {dayjs(emp.joiningDate).format("DD MMM, YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Work Schedule Stats - COMMENTED FOR LATER */}
        {/* <div className="flex-1 lg:min-w-[400px] border shadow-md rounded-xl p-4 md:p-6 bg-white mt-6">
          <h3 className="text-base md:text-lg font-semibold mb-4 text-base-content">
            Work Schedule Overview
          </h3>

          <div className="flex flex-wrap gap-3 mb-4 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-base-content/70">Worked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span className="text-base-content/70">Overtime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-info rounded"></div>
              <span className="text-base-content/70">Leave</span>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm md:text-base font-medium text-success">
                  Today&apos;s
                </p>
                <p className="text-xs text-base-content/60">
                  Scheduled: {schedule.today.scheduled}h
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs text-base-content/60">
                  Worked:{" "}
                  <span className="font-medium">{schedule.today.worked}h</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm md:text-base font-medium text-success">
                  This Week&apos;s
                </p>
                <p className="text-xs text-base-content/60">
                  Scheduled: {schedule.week.scheduled}h
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs text-base-content/60">
                  Worked:{" "}
                  <span className="font-medium">{schedule.week.worked}h</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm md:text-base font-medium text-success">
                  This Month&apos;s
                </p>
                <p className="text-xs text-base-content/60">
                  Scheduled: {schedule.month.scheduled}h
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs text-base-content/60">
                  Worked:{" "}
                  <span className="font-medium">{schedule.month.worked}h</span>
                </p>
              </div>
            </div>
          </div>

          <div className="h-48 md:h-56">
            <WorkScheduleChart data={chartData} />
          </div>
        </div> */}
      </div>
    </div>
  );
}
