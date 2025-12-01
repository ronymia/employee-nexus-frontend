"use client";

import { useState } from "react";
import { IPopupOption } from "@/types";
import CustomPopup from "@/components/modal/CustomPopup";
import { PiPencilSimple, PiTrash, PiBriefcase, PiPlus } from "react-icons/pi";
import ExperienceForm from "./components/ExperienceForm";

interface IJobHistory {
  id: number;
  userId: number;
  jobTitle: string;
  companyName: string;
  employmentType: string;
  country: string;
  city?: string;
  startDate: string;
  endDate?: string;
  responsibilities?: string;
  achievements?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExperienceContentProps {
  userId: number;
  jobHistory?: IJobHistory[];
}

export default function ExperienceContent({
  userId,
  jobHistory = [],
}: ExperienceContentProps) {
  const [popupOption, setPopupOption] = useState<IPopupOption>({
    open: false,
    closeOnDocumentClick: true,
    actionType: "create",
    form: "",
    data: null,
    title: "",
  });

  const handleOpenForm = (
    actionType: "create" | "update",
    job?: IJobHistory
  ) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: actionType,
      form: "experience",
      data: job || null,
      title: actionType === "create" ? "Add Experience" : "Update Experience",
    });
  };

  const handleCloseForm = () => {
    setPopupOption({
      open: false,
      closeOnDocumentClick: true,
      actionType: "create",
      form: "",
      data: null,
      title: "",
    });
  };

  const handleDelete = (id: number) => {
    // TODO: Implement delete mutation
    console.log("Delete job history:", id);
  };

  if (!jobHistory || jobHistory.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <PiBriefcase size={64} className="text-base-content/30" />
          <p className="text-base-content/60 text-center">
            No work experience added yet
          </p>
          <button
            onClick={() => handleOpenForm("create")}
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlus size={18} />
            Add Experience
          </button>
        </div>

        {/* Popup Modal */}
        <CustomPopup
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          customWidth="60%"
        >
          {popupOption.form === "experience" && (
            <ExperienceForm
              userId={userId}
              jobHistory={popupOption.data}
              actionType={popupOption.actionType as "create" | "update"}
              onClose={handleCloseForm}
            />
          )}
        </CustomPopup>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-base-content">
          Work Experience
        </h3>
        <button
          onClick={() => handleOpenForm("create")}
          className="btn btn-primary btn-sm gap-2"
        >
          <PiPlus size={18} />
          Add Experience
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {jobHistory.map((job) => {
          const isCurrentJob = !job.endDate;

          return (
            <div
              key={job.id}
              className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20 relative"
            >
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleOpenForm("update", job)}
                  className="btn btn-sm btn-ghost btn-circle text-primary hover:bg-primary/10"
                  title="Edit Experience"
                >
                  <PiPencilSimple size={18} />
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/10"
                  title="Delete Experience"
                >
                  <PiTrash size={18} />
                </button>
              </div>

              {/* Job Details */}
              <div className="space-y-3 pr-20">
                {/* Job Title and Employment Type */}
                <div>
                  <h4 className="text-lg font-semibold text-primary">
                    {job.jobTitle}
                  </h4>
                  <p className="text-base font-medium text-base-content">
                    {job.companyName}
                  </p>
                  <span className="badge badge-outline badge-sm mt-1">
                    {job.employmentType}
                  </span>
                </div>

                {/* Location */}
                <div>
                  <p className="text-sm text-base-content/60">
                    {job.city ? `${job.city}, ${job.country}` : job.country}
                  </p>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-base-content/60">
                  <span>{job.startDate}</span>
                  <span>-</span>
                  <span>{isCurrentJob ? "Present" : job.endDate}</span>
                  {isCurrentJob && (
                    <span className="badge badge-primary badge-sm">
                      Current Job
                    </span>
                  )}
                </div>

                {/* Responsibilities */}
                {job.responsibilities && (
                  <div className="mt-3">
                    <h5 className="text-sm font-semibold text-base-content mb-1">
                      Responsibilities:
                    </h5>
                    <p className="text-sm text-base-content/80 whitespace-pre-line">
                      {job.responsibilities}
                    </p>
                  </div>
                )}

                {/* Achievements */}
                {job.achievements && (
                  <div className="mt-3">
                    <h5 className="text-sm font-semibold text-base-content mb-1">
                      Achievements:
                    </h5>
                    <p className="text-sm text-base-content/80 whitespace-pre-line">
                      {job.achievements}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Popup Modal */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="60%"
      >
        {popupOption.form === "experience" && (
          <ExperienceForm
            userId={userId}
            jobHistory={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={handleCloseForm}
          />
        )}
      </CustomPopup>
    </div>
  );
}
