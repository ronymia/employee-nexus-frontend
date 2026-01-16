// ==================== ENUM ====================
export enum BusinessSubscriptionStatus {
  TRIAL = "TRIAL", // During trial period before subscription starts
  ACTIVE = "ACTIVE", // Active paid subscription
  EXPIRED = "EXPIRED", // Subscription has ended (past endDate)
  CANCELLED = "CANCELLED", // Manually cancelled by admin/user
  SUSPENDED = "SUSPENDED", // Temporarily suspended (payment issues, etc.)
  PENDING = "PENDING", // Awaiting activation (before startDate)
}

// ==================== TYPE GUARD ====================
export function isBusinessSubscriptionStatus(
  status: string
): status is BusinessSubscriptionStatus {
  return Object.values(BusinessSubscriptionStatus).includes(
    status as BusinessSubscriptionStatus
  );
}

// ==================== STATUS METADATA ====================
export interface ISubscriptionStatusMetadata {
  value: BusinessSubscriptionStatus;
  label: string;
  description: string;
  isActive: boolean;
  priority: number; // Higher number = more urgent
}

export const SUBSCRIPTION_STATUS_METADATA: Record<
  BusinessSubscriptionStatus,
  ISubscriptionStatusMetadata
> = {
  [BusinessSubscriptionStatus.TRIAL]: {
    value: BusinessSubscriptionStatus.TRIAL,
    label: "Trial",
    description: "During trial period before subscription starts",
    isActive: true,
    priority: 3,
  },
  [BusinessSubscriptionStatus.ACTIVE]: {
    value: BusinessSubscriptionStatus.ACTIVE,
    label: "Active",
    description: "Active paid subscription",
    isActive: true,
    priority: 1,
  },
  [BusinessSubscriptionStatus.EXPIRED]: {
    value: BusinessSubscriptionStatus.EXPIRED,
    label: "Expired",
    description: "Subscription has ended (past endDate)",
    isActive: false,
    priority: 5,
  },
  [BusinessSubscriptionStatus.CANCELLED]: {
    value: BusinessSubscriptionStatus.CANCELLED,
    label: "Cancelled",
    description: "Manually cancelled by admin/user",
    isActive: false,
    priority: 4,
  },
  [BusinessSubscriptionStatus.SUSPENDED]: {
    value: BusinessSubscriptionStatus.SUSPENDED,
    label: "Suspended",
    description: "Temporarily suspended (payment issues, etc.)",
    isActive: false,
    priority: 6,
  },
  [BusinessSubscriptionStatus.PENDING]: {
    value: BusinessSubscriptionStatus.PENDING,
    label: "Pending",
    description: "Awaiting activation (before startDate)",
    isActive: false,
    priority: 2,
  },
};
