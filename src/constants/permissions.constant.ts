export enum PermissionAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}

export enum PermissionResource {
  USER = "User",
  BUSINESS = "Business",
  ROLE = "Role",
  FEATURE = "Feature",
  PERMISSION = "Permission",
  SUBSCRIPTION_PLAN = "Subscription Plan",
  EMPLOYMENT_STATUS = "Employment Status",
  DESIGNATION = "Designation",
  JOB_TYPE = "Job Type",
  JOB_PLATFORM = "Job Platform",
  RECRUITMENT_PROCESS = "Recruitment Process",
  ONBOARDING_PROCESS = "Onboarding Process",
  WORK_SITE = "Work Site",
  WORK_SCHEDULE = "Work Schedule",
  DEPARTMENT = "Department",
  LEAVE_TYPE = "Leave Type",
  ATTENDANCE_SETTINGS = "Attendance Settings",
  LEAVE_SETTINGS = "Leave Settings",
  BUSINESS_SETTINGS = "Business Settings",
}

// Permission Constants for easy usage
export const Permissions = {
  // User Permissions
  UserCreate: `${PermissionResource.USER}:${PermissionAction.CREATE}`,
  UserRead: `${PermissionResource.USER}:${PermissionAction.READ}`,
  UserUpdate: `${PermissionResource.USER}:${PermissionAction.UPDATE}`,
  UserDelete: `${PermissionResource.USER}:${PermissionAction.DELETE}`,

  // Business Permissions
  BusinessCreate: `${PermissionResource.BUSINESS}:${PermissionAction.CREATE}`,
  BusinessRead: `${PermissionResource.BUSINESS}:${PermissionAction.READ}`,
  BusinessUpdate: `${PermissionResource.BUSINESS}:${PermissionAction.UPDATE}`,
  BusinessDelete: `${PermissionResource.BUSINESS}:${PermissionAction.DELETE}`,

  // Role Permissions
  RoleCreate: `${PermissionResource.ROLE}:${PermissionAction.CREATE}`,
  RoleRead: `${PermissionResource.ROLE}:${PermissionAction.READ}`,
  RoleUpdate: `${PermissionResource.ROLE}:${PermissionAction.UPDATE}`,
  RoleDelete: `${PermissionResource.ROLE}:${PermissionAction.DELETE}`,

  // Feature Permissions
  FeatureCreate: `${PermissionResource.FEATURE}:${PermissionAction.CREATE}`,
  FeatureRead: `${PermissionResource.FEATURE}:${PermissionAction.READ}`,
  FeatureUpdate: `${PermissionResource.FEATURE}:${PermissionAction.UPDATE}`,
  FeatureDelete: `${PermissionResource.FEATURE}:${PermissionAction.DELETE}`,

  // Permission Permissions
  PermissionCreate: `${PermissionResource.PERMISSION}:${PermissionAction.CREATE}`,
  PermissionRead: `${PermissionResource.PERMISSION}:${PermissionAction.READ}`,
  PermissionUpdate: `${PermissionResource.PERMISSION}:${PermissionAction.UPDATE}`,
  PermissionDelete: `${PermissionResource.PERMISSION}:${PermissionAction.DELETE}`,

  // Subscription Plan Permissions
  SubscriptionPlanCreate: `${PermissionResource.SUBSCRIPTION_PLAN}:${PermissionAction.CREATE}`,
  SubscriptionPlanRead: `${PermissionResource.SUBSCRIPTION_PLAN}:${PermissionAction.READ}`,
  SubscriptionPlanUpdate: `${PermissionResource.SUBSCRIPTION_PLAN}:${PermissionAction.UPDATE}`,
  SubscriptionPlanDelete: `${PermissionResource.SUBSCRIPTION_PLAN}:${PermissionAction.DELETE}`,

  // Employment Status Permissions
  EmploymentStatusCreate: `${PermissionResource.EMPLOYMENT_STATUS}:${PermissionAction.CREATE}`,
  EmploymentStatusRead: `${PermissionResource.EMPLOYMENT_STATUS}:${PermissionAction.READ}`,
  EmploymentStatusUpdate: `${PermissionResource.EMPLOYMENT_STATUS}:${PermissionAction.UPDATE}`,
  EmploymentStatusDelete: `${PermissionResource.EMPLOYMENT_STATUS}:${PermissionAction.DELETE}`,

  // Designation Permissions
  DesignationCreate: `${PermissionResource.DESIGNATION}:${PermissionAction.CREATE}`,
  DesignationRead: `${PermissionResource.DESIGNATION}:${PermissionAction.READ}`,
  DesignationUpdate: `${PermissionResource.DESIGNATION}:${PermissionAction.UPDATE}`,
  DesignationDelete: `${PermissionResource.DESIGNATION}:${PermissionAction.DELETE}`,

  // Job Type Permissions
  JobTypeCreate: `${PermissionResource.JOB_TYPE}:${PermissionAction.CREATE}`,
  JobTypeRead: `${PermissionResource.JOB_TYPE}:${PermissionAction.READ}`,
  JobTypeUpdate: `${PermissionResource.JOB_TYPE}:${PermissionAction.UPDATE}`,
  JobTypeDelete: `${PermissionResource.JOB_TYPE}:${PermissionAction.DELETE}`,

  // Job Platform Permissions
  JobPlatformCreate: `${PermissionResource.JOB_PLATFORM}:${PermissionAction.CREATE}`,
  JobPlatformRead: `${PermissionResource.JOB_PLATFORM}:${PermissionAction.READ}`,
  JobPlatformUpdate: `${PermissionResource.JOB_PLATFORM}:${PermissionAction.UPDATE}`,
  JobPlatformDelete: `${PermissionResource.JOB_PLATFORM}:${PermissionAction.DELETE}`,

  // Recruitment Process Permissions
  RecruitmentProcessCreate: `${PermissionResource.RECRUITMENT_PROCESS}:${PermissionAction.CREATE}`,
  RecruitmentProcessRead: `${PermissionResource.RECRUITMENT_PROCESS}:${PermissionAction.READ}`,
  RecruitmentProcessUpdate: `${PermissionResource.RECRUITMENT_PROCESS}:${PermissionAction.UPDATE}`,
  RecruitmentProcessDelete: `${PermissionResource.RECRUITMENT_PROCESS}:${PermissionAction.DELETE}`,

  // Onboarding Process Permissions
  OnboardingProcessCreate: `${PermissionResource.ONBOARDING_PROCESS}:${PermissionAction.CREATE}`,
  OnboardingProcessRead: `${PermissionResource.ONBOARDING_PROCESS}:${PermissionAction.READ}`,
  OnboardingProcessUpdate: `${PermissionResource.ONBOARDING_PROCESS}:${PermissionAction.UPDATE}`,
  OnboardingProcessDelete: `${PermissionResource.ONBOARDING_PROCESS}:${PermissionAction.DELETE}`,

  // Work Site Permissions
  WorkSiteCreate: `${PermissionResource.WORK_SITE}:${PermissionAction.CREATE}`,
  WorkSiteRead: `${PermissionResource.WORK_SITE}:${PermissionAction.READ}`,
  WorkSiteUpdate: `${PermissionResource.WORK_SITE}:${PermissionAction.UPDATE}`,
  WorkSiteDelete: `${PermissionResource.WORK_SITE}:${PermissionAction.DELETE}`,

  // Work Schedule Permissions
  WorkScheduleCreate: `${PermissionResource.WORK_SCHEDULE}:${PermissionAction.CREATE}`,
  WorkScheduleRead: `${PermissionResource.WORK_SCHEDULE}:${PermissionAction.READ}`,
  WorkScheduleUpdate: `${PermissionResource.WORK_SCHEDULE}:${PermissionAction.UPDATE}`,
  WorkScheduleDelete: `${PermissionResource.WORK_SCHEDULE}:${PermissionAction.DELETE}`,

  // Department Permissions
  DepartmentCreate: `${PermissionResource.DEPARTMENT}:${PermissionAction.CREATE}`,
  DepartmentRead: `${PermissionResource.DEPARTMENT}:${PermissionAction.READ}`,
  DepartmentUpdate: `${PermissionResource.DEPARTMENT}:${PermissionAction.UPDATE}`,
  DepartmentDelete: `${PermissionResource.DEPARTMENT}:${PermissionAction.DELETE}`,

  // Leave Type Permissions
  LeaveTypeCreate: `${PermissionResource.LEAVE_TYPE}:${PermissionAction.CREATE}`,
  LeaveTypeRead: `${PermissionResource.LEAVE_TYPE}:${PermissionAction.READ}`,
  LeaveTypeUpdate: `${PermissionResource.LEAVE_TYPE}:${PermissionAction.UPDATE}`,
  LeaveTypeDelete: `${PermissionResource.LEAVE_TYPE}:${PermissionAction.DELETE}`,

  // Attendance Settings Permissions
  AttendanceSettingsRead: `${PermissionResource.ATTENDANCE_SETTINGS}:${PermissionAction.READ}`,
  AttendanceSettingsUpdate: `${PermissionResource.ATTENDANCE_SETTINGS}:${PermissionAction.UPDATE}`,

  // Leave Settings Permissions
  LeaveSettingsRead: `${PermissionResource.LEAVE_SETTINGS}:${PermissionAction.READ}`,
  LeaveSettingsUpdate: `${PermissionResource.LEAVE_SETTINGS}:${PermissionAction.UPDATE}`,

  // Business Settings Permissions
  BusinessSettingsRead: `${PermissionResource.BUSINESS_SETTINGS}:${PermissionAction.READ}`,
} as const;
