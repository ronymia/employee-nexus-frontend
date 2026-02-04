import {
  ILeaveSummary,
  IAvailableLeave,
  IUpcomingLeaveEmployee,
} from "@/types/dashboard.type";
import { customFormatDate, FORMAT_PRESETS } from "@/utils/date-format.utils";

interface ILeaveBalanceCardProps {
  leaveSummary: ILeaveSummary;
}

export default function LeaveBalanceCard({
  leaveSummary,
}: ILeaveBalanceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-base-content mb-4">
        Leave Balance
      </h3>
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {leaveSummary.availableLeaves.map(
          (leave: IAvailableLeave, index: number) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-base-content">
                  {leave.leaveType}
                </span>
                <span className="text-xs text-base-content/70">
                  {leave.used}/{leave.total} used
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(leave.remaining / leave.total) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {leave.remaining}
                </span>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Upcoming Leaves */}
      {leaveSummary.upcomingLeaves.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-base-content mb-3">
            Upcoming Leaves
          </h4>
          <div className="space-y-2">
            {leaveSummary.upcomingLeaves.map(
              (leave: IUpcomingLeaveEmployee, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-sm text-base-content">
                      {leave.leaveType}
                    </div>
                    <div className="text-xs text-base-content/70">
                      {customFormatDate(
                        leave.startDate,
                        FORMAT_PRESETS.SHORT_DATE,
                      )}{" "}
                      - {customFormatDate(leave.endDate)}
                    </div>
                  </div>
                  <span className="badge badge-sm badge-success">
                    {leave.status}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
