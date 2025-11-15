import type { IPopupOption } from "@/types";
import { useState } from "react";

export default function usePopupOption() {
  const [popupOption, setPopupOption] = useState<IPopupOption>({
    open: false,
    closeOnDocumentClick: true,
    actionType: "create",
    form: "",
    data: null,
    title: "",
  });

  // CREATE NEW SUBSCRIPTION PLAN
  const createNewSubscriptionPlan = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "SubscriptionPlanForm",
      data: null,
      title: "Create Subscription Plan",
    });
  };

  // CREATE NEW JOB TYPE
  const createNewJobType = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "job_type",
      data: null,
      title: "Create Job Type",
    });
  };

  // CREATE NEW RECRUITMENT PROCESS
  const createNewRecruitmentProcess = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "recruitment_process",
      data: null,
      title: "Create Recruitment Process",
    });
  };

  // CREATE NEW ONBOARDING PROCESS
  const createNewOnboardingProcess = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "onboarding_process",
      data: null,
      title: "Create Onboarding Process",
    });
  };

  // CREATE NEW WORK SITE
  const createNewWorkSite = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "work_site",
      data: null,
      title: "Create Work Site",
    });
  };

  // CREATE NEW JOB TYPE
  const createNewJobPlatforms = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "job_platforms",
      data: null,
      title: "Create Job Platforms",
    });
  };
  // CREATE NEW DESIGNATION
  const createNewDesignation = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "designation",
      data: null,
      title: "Create Designation",
    });
  };

  // CREATE NEW EMPLOYMENT STATUS
  const createNewEmploymentStatus = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "employment_status",
      data: null,
      title: "Create Employment Status",
    });
  };

  return {
    popupOption,
    setPopupOption,
    createNewSubscriptionPlan,
    createNewJobType,
    createNewRecruitmentProcess,
    createNewOnboardingProcess,
    createNewWorkSite,
    createNewJobPlatforms,
    createNewDesignation,
    createNewEmploymentStatus,
  };
}
