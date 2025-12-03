type IAction_TYPE = "create" | "update" | "delete" | "view";

type IForm_NAME =
  | ""
  | "SubscriptionPlanForm"
  | "job_type"
  | "recruitment_process"
  | "onboarding_process"
  | "work_site"
  | "job_platforms"
  | "designation"
  | "employment_status"
  | "leave_type"
  | "asset_type"
  | "asset"
  | "project"
  | "employee"
  | "offered_course_section"
  | "academic_semester"
  | "academic_faculty"
  | "academic_department"
  | "building"
  | "room"
  | "course"
  | "semester_registration"
  | "offered_course"
  | "department"
  | "student_basic_info"
  | "admin_basic_info"
  | "faculty_basic_info"
  | "assign_course_into_faculty"
  | "guardian_info"
  | "profileInfo"
  | "emergencyContact"
  | "employmentDetails"
  | "education"
  | "experience"
  | "scheduleAssignment"
  | "projectMember"
  | "assetAssignment"
  | "document"
  | "note"
  | "socialLink"
  | "attendance"
  | "leave"
  | "holiday"
  | "bulk_schedule";

export interface IPopupOption {
  open: boolean;
  closeOnDocumentClick?: boolean;
  actionType: IAction_TYPE;
  form: IForm_NAME;
  data?: any;
  title: string;
  deleteHandler?: () => void;
}
