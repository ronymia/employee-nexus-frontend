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

  // CREATE NEW LEAVE TYPE
  const createNewLeaveType = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "leave_type",
      data: null,
      title: "Create Leave Type",
    });
  };

  // CREATE NEW DEPARTMENT
  const createNewDepartment = () => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "department",
      data: null,
      title: "Create Department",
    });
  };

  return {
    popupOption,
    setPopupOption,
    createNewSubscriptionPlan,
    createNewWorkSite,
    createNewDesignation,
    createNewEmploymentStatus,
    createNewLeaveType,
    createNewDepartment,
  };
}
