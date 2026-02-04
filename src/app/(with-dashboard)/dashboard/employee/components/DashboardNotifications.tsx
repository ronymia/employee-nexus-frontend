import {
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineCurrencyDollar,
  HiOutlineBell,
} from "react-icons/hi";
import { INotifications, INotificationItem } from "@/types/dashboard.type";
import { customFormatDate } from "@/utils/date-format.utils";

interface IDashboardNotificationsProps {
  notifications: INotifications;
}

export default function DashboardNotifications({
  notifications,
}: IDashboardNotificationsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-base-content">
          Recent Notifications
        </h3>
        {notifications.unread > 0 && (
          <span className="badge badge-error badge-sm">
            {notifications.unread} unread
          </span>
        )}
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.recent.map(
          (notification: INotificationItem, index: number) => (
            <div
              key={index}
              className={`flex gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                !notification.readAt ? "bg-blue-50" : "bg-gray-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  notification.type === "leave"
                    ? "bg-blue-100 text-blue-600"
                    : notification.type === "task"
                      ? "bg-purple-100 text-purple-600"
                      : notification.type === "payroll"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {notification.type === "leave" ? (
                  <HiOutlineCalendar className="text-lg" />
                ) : notification.type === "task" ? (
                  <HiOutlineClipboardList className="text-lg" />
                ) : notification.type === "payroll" ? (
                  <HiOutlineCurrencyDollar className="text-lg" />
                ) : (
                  <HiOutlineBell className="text-lg" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-base-content">
                  {notification.message}
                </p>
                <p className="text-xs text-base-content/70 mt-1">
                  {customFormatDate(notification.timestamp, undefined, {
                    relative: true,
                  })}
                </p>
              </div>
              {!notification.readAt && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></div>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
