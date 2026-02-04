import { IPersonalInfo } from "@/types/dashboard.type";
import { HiOutlineUser, HiOutlineCalendar } from "react-icons/hi";
import { customFormatDate } from "@/utils/date-format.utils";

interface IWelcomeBannerProps {
  personalInfo: IPersonalInfo;
}

export default function WelcomeBanner({ personalInfo }: IWelcomeBannerProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-green-400 flex items-center justify-center text-white text-2xl font-bold">
            {personalInfo.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Welcome back, {personalInfo.fullName.split(" ")[0]}!
            </h1>
            <p className="text-base-content/70 text-sm">
              {personalInfo.designation} • {personalInfo.department}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <HiOutlineUser className="text-primary" />
            <span>{personalInfo.employeeId}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineCalendar className="text-primary" />
            <span>
              Joined {customFormatDate(personalInfo.joiningDate, "MMM YYYY")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
