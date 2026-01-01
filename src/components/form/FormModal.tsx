"use client";

import type { IPopupOption } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import Popup from "reactjs-popup";
import { motion } from "motion/react";
import React from "react";
import CustomPopup from "../modal/CustomPopup";
import CustomLoading from "../loader/CustomLoading";

import type { Variants } from "motion/react";
import SubscriptionPlanForm from "@/app/(with-dashboard)/subscription-plans/SubscriptionPlanForm";
import JobTypeForm from "@/app/(with-dashboard)/recruitment/job-types/JobTypesForm";
import RecruitmentProcessForm from "@/app/(with-dashboard)/recruitment/recruitment-processes/RecruitmentProcessesForm";
import OnboardingProcessForm from "@/app/(with-dashboard)/recruitment/onboarding-processes/OnboardingProcessesForm";
import WorkSiteForm from "@/app/(with-dashboard)/administration/work-sites/WorkSitesForm";
import DesignationForm from "@/app/(with-dashboard)/administration/designations/DesignationForm";
import JobPlatformsForm from "@/app/(with-dashboard)/recruitment/job-platforms/JobPlatformsForm";
import EmploymentStatusForm from "@/app/(with-dashboard)/administration/employment-status/EmploymentStatusForm";
import LeaveTypesForm from "@/app/(with-dashboard)/administration/leave-types/LeaveTypesForm";
import DepartmentsForm from "@/app/(with-dashboard)/administration/departments/DepartmentsForm";
import AssetTypeForm from "@/app/(with-dashboard)/asset-management/asset-types/AssetTypesForm";
import AssetsForm from "@/app/(with-dashboard)/asset-management/assets/AssetsForm";
import ProjectsForm from "@/app/(with-dashboard)/projects/ProjectsForm";

const popupVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 150,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

export default function FormModal({
  popupOption,
  setPopupOption,
  customHeight,
  customWidth,
}: {
  popupOption: IPopupOption;
  setPopupOption: Dispatch<SetStateAction<IPopupOption>>;
  customHeight?: string;
  customWidth?: string;
}) {
  const handleClosePopup = () =>
    setPopupOption((prev) => ({ ...prev, open: false }));

  // FORM CONTENT
  const FormContent = () => {
    if (!popupOption?.form) {
      return (
        <div className="p-4">
          <h2 className="text-lg font-semibold">No Form Available</h2>
          <p>Please select a valid form to display.</p>
        </div>
      );
    }
    if (
      popupOption?.actionType === "create" ||
      popupOption?.actionType === "update"
    ) {
      if (popupOption?.form === "SubscriptionPlanForm") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <SubscriptionPlanForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "job_type") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <JobTypeForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "recruitment_process") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <RecruitmentProcessForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "onboarding_process") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <OnboardingProcessForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "work_site") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <WorkSiteForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "designation") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <DesignationForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "employment_status") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <EmploymentStatusForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "leave_type") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <LeaveTypesForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "asset_type") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <AssetTypeForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "asset") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <AssetsForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "project") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <ProjectsForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "department") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <DepartmentsForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      } else if (popupOption?.form === "job_platforms") {
        return (
          <React.Suspense fallback={<CustomLoading />}>
            <JobPlatformsForm
              handleClosePopup={handleClosePopup}
              data={popupOption.data}
            />
          </React.Suspense>
        );
      }
    }
  };

  return popupOption?.actionType === "delete" ? (
    <Popup
      open={popupOption?.open}
      overlayStyle={{
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(2px)",
      }}
      closeOnDocumentClick={false}
      contentStyle={{
        display: "flex",
        flexDirection: "column",
        width: "500px",
        // height: customHeight || "auto",
        maxHeight: "90vh",
        borderRadius: "10px",
        background: "#fff",
        // margin: isMobile ? "10px" : undefined,
        // ...(isMobile && {
        //   width: "calc(100% - 20px)",
        //   // maxWidth: "400px",
        //   // position: "relative",
        //   // overflow: "hidden",
        // }),
      }}
      className={`relative overflow-hidden rounded-box`}
    >
      {/* <motion.div
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`relative bg-base-300 shadow-xl rounded-xl border-2 w-96 md:w-[512px] border-error`}
      >
        {<FormContent />}
      </motion.div> */}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="mx-auto text-center my-4 w-full"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="96"
          height="96"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-trash-2 mx-auto text-red-500"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 10,
            duration: 0.4,
          }}
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </motion.svg>
        <div className="mx-auto my-4 w-full">
          <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
          <p className="text-sm text-gray-600 font-medium">
            Are you sure you want to delete this{" "}
            <span className="text-error font-bold">
              {/* {formatRole(modalOptions?.form ? modalOptions?.form : "")} */}
            </span>
            ?
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => handleClosePopup?.()}
            className="btn btn-outline border-primary text-primary rounded-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            data-auto="delete_confirmation_button"
            onClick={() => {
              popupOption?.deleteHandler?.();
              handleClosePopup?.();
            }}
            className="btn btn-primary text-base-300 bg-red-500 hover:bg-red-600 rounded-sm"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </Popup>
  ) : (
    <CustomPopup
      popupOption={popupOption}
      setPopupOption={setPopupOption}
      customHeight={customHeight}
      customWidth={customWidth}
    >
      {/* FORM CONTENT */}

      <FormContent />
    </CustomPopup>
  );
}
