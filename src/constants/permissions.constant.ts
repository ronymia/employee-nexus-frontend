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
  ASSET_TYPE = "Asset Type",
  ASSET = "Asset",
  PROJECT = "Project",
  PROJECT_MEMBER = "Project Member",
  ATTENDANCE_SETTINGS = "Attendance Settings",
  LEAVE_SETTINGS = "Leave Settings",
  BUSINESS_SETTINGS = "Business Settings",
  DOCUMENT = "Document",
  NOTE = "Note",
  SOCIAL_LINK = "Social Link",
  ATTENDANCE = "Attendance",
  LEAVE = "Leave",
  HOLIDAY = "Holiday",
  PAYROLL_COMPONENT = "Payroll Component",
  PAYROLL_CYCLE = "Payroll Cycle",
  PAYROLL_ITEM = "Payroll Item",
  PROFILE = "Profile",
  EDUCATION_HISTORY = "Education History",
  JOB_HISTORY = "Job History",
  EMERGENCY_CONTACT = "Emergency Contact",
  EMPLOYMENT_DETAILS = "Employment Details",
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

  // Asset Type Permissions
  AssetTypeCreate: `${PermissionResource.ASSET_TYPE}:${PermissionAction.CREATE}`,
  AssetTypeRead: `${PermissionResource.ASSET_TYPE}:${PermissionAction.READ}`,
  AssetTypeUpdate: `${PermissionResource.ASSET_TYPE}:${PermissionAction.UPDATE}`,
  AssetTypeDelete: `${PermissionResource.ASSET_TYPE}:${PermissionAction.DELETE}`,

  // Asset Permissions
  AssetCreate: `${PermissionResource.ASSET}:${PermissionAction.CREATE}`,
  AssetRead: `${PermissionResource.ASSET}:${PermissionAction.READ}`,
  AssetUpdate: `${PermissionResource.ASSET}:${PermissionAction.UPDATE}`,
  AssetDelete: `${PermissionResource.ASSET}:${PermissionAction.DELETE}`,

  // Project Permissions
  ProjectCreate: `${PermissionResource.PROJECT}:${PermissionAction.CREATE}`,
  ProjectRead: `${PermissionResource.PROJECT}:${PermissionAction.READ}`,
  ProjectUpdate: `${PermissionResource.PROJECT}:${PermissionAction.UPDATE}`,
  ProjectDelete: `${PermissionResource.PROJECT}:${PermissionAction.DELETE}`,

  // Project Member Permissions
  ProjectMemberCreate: `${PermissionResource.PROJECT_MEMBER}:${PermissionAction.CREATE}`,
  ProjectMemberRead: `${PermissionResource.PROJECT_MEMBER}:${PermissionAction.READ}`,
  ProjectMemberUpdate: `${PermissionResource.PROJECT_MEMBER}:${PermissionAction.UPDATE}`,
  ProjectMemberDelete: `${PermissionResource.PROJECT_MEMBER}:${PermissionAction.DELETE}`,

  // Document Permissions
  DocumentCreate: `${PermissionResource.DOCUMENT}:${PermissionAction.CREATE}`,
  DocumentRead: `${PermissionResource.DOCUMENT}:${PermissionAction.READ}`,
  DocumentUpdate: `${PermissionResource.DOCUMENT}:${PermissionAction.UPDATE}`,
  DocumentDelete: `${PermissionResource.DOCUMENT}:${PermissionAction.DELETE}`,

  // Note Permissions
  NoteCreate: `${PermissionResource.NOTE}:${PermissionAction.CREATE}`,
  NoteRead: `${PermissionResource.NOTE}:${PermissionAction.READ}`,
  NoteUpdate: `${PermissionResource.NOTE}:${PermissionAction.UPDATE}`,
  NoteDelete: `${PermissionResource.NOTE}:${PermissionAction.DELETE}`,

  // Social Link Permissions
  SocialLinkCreate: `${PermissionResource.SOCIAL_LINK}:${PermissionAction.CREATE}`,
  SocialLinkRead: `${PermissionResource.SOCIAL_LINK}:${PermissionAction.READ}`,
  SocialLinkUpdate: `${PermissionResource.SOCIAL_LINK}:${PermissionAction.UPDATE}`,
  SocialLinkDelete: `${PermissionResource.SOCIAL_LINK}:${PermissionAction.DELETE}`,

  // Attendance Permissions
  AttendanceCreate: `${PermissionResource.ATTENDANCE}:${PermissionAction.CREATE}`,
  AttendanceRead: `${PermissionResource.ATTENDANCE}:${PermissionAction.READ}`,
  AttendanceUpdate: `${PermissionResource.ATTENDANCE}:${PermissionAction.UPDATE}`,
  AttendanceDelete: `${PermissionResource.ATTENDANCE}:${PermissionAction.DELETE}`,

  // Leave Permissions
  LeaveCreate: `${PermissionResource.LEAVE}:${PermissionAction.CREATE}`,
  LeaveRead: `${PermissionResource.LEAVE}:${PermissionAction.READ}`,
  LeaveUpdate: `${PermissionResource.LEAVE}:${PermissionAction.UPDATE}`,
  LeaveDelete: `${PermissionResource.LEAVE}:${PermissionAction.DELETE}`,

  // Holiday Permissions
  HolidayCreate: `${PermissionResource.HOLIDAY}:${PermissionAction.CREATE}`,
  HolidayRead: `${PermissionResource.HOLIDAY}:${PermissionAction.READ}`,
  HolidayUpdate: `${PermissionResource.HOLIDAY}:${PermissionAction.UPDATE}`,
  HolidayDelete: `${PermissionResource.HOLIDAY}:${PermissionAction.DELETE}`,

  // Payroll Component Permissions
  PayrollComponentCreate: `${PermissionResource.PAYROLL_COMPONENT}:${PermissionAction.CREATE}`,
  PayrollComponentRead: `${PermissionResource.PAYROLL_COMPONENT}:${PermissionAction.READ}`,
  PayrollComponentUpdate: `${PermissionResource.PAYROLL_COMPONENT}:${PermissionAction.UPDATE}`,
  PayrollComponentDelete: `${PermissionResource.PAYROLL_COMPONENT}:${PermissionAction.DELETE}`,

  // Payroll Cycle Permissions
  PayrollCycleCreate: `${PermissionResource.PAYROLL_CYCLE}:${PermissionAction.CREATE}`,
  PayrollCycleRead: `${PermissionResource.PAYROLL_CYCLE}:${PermissionAction.READ}`,
  PayrollCycleUpdate: `${PermissionResource.PAYROLL_CYCLE}:${PermissionAction.UPDATE}`,
  PayrollCycleDelete: `${PermissionResource.PAYROLL_CYCLE}:${PermissionAction.DELETE}`,

  // Payroll Item Permissions
  PayrollItemCreate: `${PermissionResource.PAYROLL_ITEM}:${PermissionAction.CREATE}`,
  PayrollItemRead: `${PermissionResource.PAYROLL_ITEM}:${PermissionAction.READ}`,
  PayrollItemUpdate: `${PermissionResource.PAYROLL_ITEM}:${PermissionAction.UPDATE}`,
  PayrollItemDelete: `${PermissionResource.PAYROLL_ITEM}:${PermissionAction.DELETE}`,

  // Profile Permissions
  ProfileCreate: `${PermissionResource.PROFILE}:${PermissionAction.CREATE}`,
  ProfileRead: `${PermissionResource.PROFILE}:${PermissionAction.READ}`,
  ProfileUpdate: `${PermissionResource.PROFILE}:${PermissionAction.UPDATE}`,
  ProfileDelete: `${PermissionResource.PROFILE}:${PermissionAction.DELETE}`,

  // Education History Permissions
  EducationHistoryCreate: `${PermissionResource.EDUCATION_HISTORY}:${PermissionAction.CREATE}`,
  EducationHistoryRead: `${PermissionResource.EDUCATION_HISTORY}:${PermissionAction.READ}`,
  EducationHistoryUpdate: `${PermissionResource.EDUCATION_HISTORY}:${PermissionAction.UPDATE}`,
  EducationHistoryDelete: `${PermissionResource.EDUCATION_HISTORY}:${PermissionAction.DELETE}`,

  // Job History Permissions
  JobHistoryCreate: `${PermissionResource.JOB_HISTORY}:${PermissionAction.CREATE}`,
  JobHistoryRead: `${PermissionResource.JOB_HISTORY}:${PermissionAction.READ}`,
  JobHistoryUpdate: `${PermissionResource.JOB_HISTORY}:${PermissionAction.UPDATE}`,
  JobHistoryDelete: `${PermissionResource.JOB_HISTORY}:${PermissionAction.DELETE}`,

  // Emergency Contact Permissions
  EmergencyContactCreate: `${PermissionResource.EMERGENCY_CONTACT}:${PermissionAction.CREATE}`,
  EmergencyContactRead: `${PermissionResource.EMERGENCY_CONTACT}:${PermissionAction.READ}`,
  EmergencyContactUpdate: `${PermissionResource.EMERGENCY_CONTACT}:${PermissionAction.UPDATE}`,
  EmergencyContactDelete: `${PermissionResource.EMERGENCY_CONTACT}:${PermissionAction.DELETE}`,

  // Employment Details Permissions
  EmploymentDetailsCreate: `${PermissionResource.EMPLOYMENT_DETAILS}:${PermissionAction.CREATE}`,
  EmploymentDetailsRead: `${PermissionResource.EMPLOYMENT_DETAILS}:${PermissionAction.READ}`,
  EmploymentDetailsUpdate: `${PermissionResource.EMPLOYMENT_DETAILS}:${PermissionAction.UPDATE}`,
  EmploymentDetailsDelete: `${PermissionResource.EMPLOYMENT_DETAILS}:${PermissionAction.DELETE}`,
} as const;
