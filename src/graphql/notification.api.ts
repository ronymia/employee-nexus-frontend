import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query Notifications($query: QueryNotificationInput) {
    notifications(query: $query) {
      success
      statusCode
      message
      data {
        id
        type
        title
        message
        priority
        notificationTemplateId
        entityType
        entityId
        actionUrl
        userId
        isRead
        readAt
        channels
        sentVia
        businessId
        metadata
        expiresAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($id: Int!) {
    markNotificationAsRead(id: $id) {
      success
      statusCode
      message
      data {
        id
        isRead
        readAt
      }
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
      success
      statusCode
      message
    }
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: Int!) {
    deleteNotification(id: $id) {
      success
      statusCode
      message
    }
  }
`;
