"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  DELETE_NOTIFICATION,
} from "@/graphql/notification.api";
import {
  INotification,
  NotificationType,
  NotificationPriority,
} from "@/types/notification.type";
import CustomLoading from "@/components/loader/CustomLoading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IMeta } from "@/types";

dayjs.extend(relativeTime);

export default function NotificationsPage() {
  const [filter, setFilter] = useState<{
    isRead?: boolean;
    type?: NotificationType | "ALL";
    priority?: NotificationPriority | "ALL";
  }>({
    isRead: undefined,
    type: "ALL",
    priority: "ALL",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const { data, loading, refetch } = useQuery<{
    notifications: {
      data: INotification[];
      meta: IMeta;
    };
  }>(GET_NOTIFICATIONS, {
    variables: {
      query: {
        isRead: filter.isRead,
        type: filter.type === "ALL" ? undefined : filter.type,
        priority: filter.priority === "ALL" ? undefined : filter.priority,
      },
    },
  });

  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
  });

  const [markAllAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
  });

  const [deleteNotification] = useMutation(DELETE_NOTIFICATION, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
  });

  //   EXTRACT NOTIFICATION
  const notifications = data?.notifications?.data || [];

  //   PAGINATION
  const totalPages = data?.notifications?.meta?.totalPages || 1;

  // UNREAD COUNT
  const unreadCount =
    notifications.filter((n: INotification) => !n.isRead).length || 0;

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead({ variables: { id: Number(id) } });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteNotification({ variables: { id } });
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return "badge-error";
      case NotificationPriority.HIGH:
        return "badge-warning";
      case NotificationPriority.NORMAL:
        return "badge-info";
      case NotificationPriority.LOW:
        return "badge-ghost";
      default:
        return "badge-ghost";
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LEAVE:
        return "📅";
      case NotificationType.ATTENDANCE:
        return "⏰";
      case NotificationType.PAYROLL:
        return "💰";
      case NotificationType.PROJECT:
        return "📊";
      case NotificationType.DOCUMENT:
        return "📄";
      case NotificationType.ANNOUNCEMENT:
        return "📢";
      case NotificationType.SYSTEM:
        return "⚙️";
      default:
        return "🔔";
    }
  };

  if (loading && notifications.length === 0) {
    return <CustomLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Notifications
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Stay updated with all your important alerts and messages
              </p>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="badge badge-primary badge-sm sm:badge-lg">
                  {unreadCount} Unread
                </span>
                <button
                  onClick={handleMarkAllAsRead}
                  className="btn btn-xs sm:btn-sm btn-outline btn-primary"
                >
                  Mark All as Read
                </button>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            {/* Read Status Filter */}
            <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
              <button
                onClick={() => setFilter({ ...filter, isRead: undefined })}
                className={`btn btn-xs sm:btn-sm flex-1 sm:flex-none ${
                  filter.isRead === undefined ? "btn-primary" : "btn-ghost"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter({ ...filter, isRead: false })}
                className={`btn btn-xs sm:btn-sm flex-1 sm:flex-none ${
                  filter.isRead === false ? "btn-primary" : "btn-ghost"
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter({ ...filter, isRead: true })}
                className={`btn btn-xs sm:btn-sm flex-1 sm:flex-none ${
                  filter.isRead === true ? "btn-primary" : "btn-ghost"
                }`}
              >
                Read
              </button>
            </div>

            {/* Type Filter */}
            <select
              value={filter.type}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  type: e.target.value as NotificationType | "ALL",
                })
              }
              className="select select-xs sm:select-sm select-bordered w-full sm:w-auto"
            >
              <option value="ALL">All Types</option>
              {Object.values(NotificationType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filter.priority}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  priority: e.target.value as NotificationPriority | "ALL",
                })
              }
              className="select select-xs sm:select-sm select-bordered w-full sm:w-auto"
            >
              <option value="ALL">All Priorities</option>
              {Object.values(NotificationPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4">🔔</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No Notifications
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                You're all caught up! No notifications to display.
              </p>
            </div>
          ) : (
            notifications.map((notification: INotification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                  !notification.isRead ? "border-l-4 border-primary" : ""
                }`}
              >
                <div className="p-3 sm:p-5">
                  <div className="flex items-start gap-2 sm:gap-4">
                    {/* Icon */}
                    <div className="text-2xl sm:text-3xl shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3
                          className={`text-base sm:text-lg font-semibold ${
                            !notification.isRead
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                          <span
                            className={`badge badge-xs sm:badge-sm ${getPriorityColor(
                              notification.priority,
                            )}`}
                          >
                            {notification.priority}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 text-xs sm:text-sm mb-3">
                        {notification.message}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                          <span className="badge badge-xs sm:badge-sm badge-ghost">
                            {notification.type}
                          </span>
                          <span className="text-xs">
                            {dayjs(notification.createdAt).fromNow()}
                          </span>
                          {notification.channels.length > 0 && (
                            <span className="flex items-center gap-1 text-xs">
                              📡
                              <span className="hidden sm:inline">
                                {notification.channels.join(", ")}
                              </span>
                              <span className="sm:hidden">
                                {notification.channels.length}
                              </span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="btn btn-xs btn-ghost text-primary"
                            >
                              <span className="hidden sm:inline">
                                ✓ Mark as Read
                              </span>
                              <span className="sm:hidden">✓</span>
                            </button>
                          )}
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="btn btn-xs btn-primary"
                            >
                              <span className="hidden sm:inline">
                                View Details
                              </span>
                              <span className="sm:hidden">View</span>
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="btn btn-xs btn-ghost text-error"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mt-4 sm:mt-6">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn btn-xs sm:btn-sm btn-outline"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              <span className="text-xs sm:text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="btn btn-xs sm:btn-sm btn-outline"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
