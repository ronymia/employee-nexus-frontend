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

  return {
    popupOption,
    setPopupOption,
    createNewSubscriptionPlan,
    createNewJobType,
    createNewRecruitmentProcess,
    createNewJobPlatforms,
    createNewDesignation,
  };
}
