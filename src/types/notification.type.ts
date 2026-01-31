export enum NotificationType {
  SYSTEM = "SYSTEM",
  LEAVE = "LEAVE",
  ATTENDANCE = "ATTENDANCE",
  PAYROLL = "PAYROLL",
  PROJECT = "PROJECT",
  DOCUMENT = "DOCUMENT",
  ANNOUNCEMENT = "ANNOUNCEMENT",
}

export enum NotificationPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum NotificationChannel {
  IN_APP = "IN_APP",
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH",
}

export interface INotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  notificationTemplateId?: number;
  entityType?: string;
  entityId?: number;
  actionUrl?: string;
  userId: number;
  isRead: boolean;
  readAt?: Date;
  channels: NotificationChannel[];
  sentVia: NotificationChannel[];
  businessId?: number;
  metadata?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
