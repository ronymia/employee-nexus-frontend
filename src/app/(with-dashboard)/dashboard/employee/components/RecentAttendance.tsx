import { IRecentAttendance } from "@/types/dashboard.type";
import { customFormatDate } from "@/utils/date-format.utils";

interface IRecentAttendanceProps {
  recentAttendance: IRecentAttendance[];
}

export default function RecentAttendance({
  recentAttendance,
}: IRecentAttendanceProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-base-content mb-4">
        Recent Attendance
      </h3>
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {recentAttendance.map((record, index) => (
              <tr key={index}>
                <td>{customFormatDate(record.date, "ddd, MMM DD, YYYY")}</td>
                <td>
                  <span
                    className={`badge badge-sm ${
                      record.status === "PRESENT"
                        ? "badge-success"
                        : record.status === "LATE"
                          ? "badge-warning"
                          : "badge-error"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
                <td>{record.checkInTime}</td>
                <td>{record.checkOutTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
