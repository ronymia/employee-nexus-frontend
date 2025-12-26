"use client";

// ==================== EXTERNAL IMPORTS ====================
import { useState } from "react";
import { IPopupOption, IJobHistory } from "@/types";
import CustomPopup from "@/components/modal/CustomPopup";
import { PiPencilSimple, PiTrash, PiBriefcase, PiPlus } from "react-icons/pi";
import ExperienceForm from "./components/ExperienceForm";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_JOB_HISTORY_BY_USER_ID,
  DELETE_JOB_HISTORY,
} from "@/graphql/job-history.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import useDeleteConfirmation from "@/hooks/useDeleteConfirmation";
import dayjs from "dayjs";
import { motion } from "motion/react";

// ==================== INTERFACES ====================
interface IExperienceContentProps {
  userId: number;
}

// ==================== SUB-COMPONENTS ====================

// SKELETON LOADING COMPONENT WITH ANIMATION
function ExperienceLoading() {
  // SHIMMER ANIMATION KEYFRAMES
  const shimmer = {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  };

  // SKELETON CARD
  const SkeletonCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20"
    >
      <div className="space-y-3 pr-20">
        {/* JOB TITLE SKELETON */}
        <div className="space-y-2">
          <motion.div
            {...shimmer}
            className="h-6 w-3/4 rounded animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--b2)) 25%, hsl(var(--b3)) 50%, hsl(var(--b2)) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <motion.div
            {...shimmer}
            className="h-5 w-1/2 rounded animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--b2)) 25%, hsl(var(--b3)) 50%, hsl(var(--b2)) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>

        {/* COMPANY SKELETON */}
        <div className="space-y-2">
          <motion.div
            {...shimmer}
            className="h-5 w-2/3 rounded animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--b2)) 25%, hsl(var(--b3)) 50%, hsl(var(--b2)) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <motion.div
            {...shimmer}
            className="h-4 w-1/3 rounded animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--b2)) 25%, hsl(var(--b3)) 50%, hsl(var(--b2)) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>

        {/* DURATION SKELETON */}
        <motion.div
          {...shimmer}
          className="h-4 w-1/4 rounded animate-pulse"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--b2)) 25%, hsl(var(--b3)) 50%, hsl(var(--b2)) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      {/* HEADER SKELETON */}
      <div className="flex justify-between items-center">
        <motion.div
          {...shimmer}
          className="h-7 w-48 rounded animate-pulse"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--b2)) 25%, hsl(var(--b3)) 50%, hsl(var(--b2)) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
        <motion.div
          {...shimmer}
          className="h-9 w-32 rounded animate-pulse"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--b2)) 25%, hsl(var(--b3)) 50%, hsl(var(--b2)) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* SKELETON CARDS */}
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

// EMPTY STATE COMPONENT
function EmptyExperienceState({
  hasPermission,
  onAddClick,
}: {
  hasPermission: boolean;
  onAddClick: () => void;
}) {
  return (
    <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <PiBriefcase size={64} className="text-base-content/30" />
        <p className="text-base-content/60 text-center">
          No work experience added yet
        </p>
        {hasPermission && (
          <button onClick={onAddClick} className="btn btn-primary btn-sm gap-2">
            <PiPlus size={18} />
            Add Experience
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function ExperienceContent({ userId }: IExperienceContentProps) {
  // ==================== PERMISSIONS ====================
  const { hasPermission } = usePermissionGuard();

  // ==================== HOOKS ====================
  const deleteConfirmation = useDeleteConfirmation();

  // ==================== LOCAL STATE ====================
  const [popupOption, setPopupOption] = useState<IPopupOption>({
    open: false,
    closeOnDocumentClick: true,
    actionType: "create",
    form: "",
    data: null,
    title: "",
  });

  // ==================== GRAPHQL QUERIES ====================
  // FETCH JOB HISTORY
  const { data, loading } = useQuery<{
    jobHistoryByUserId: {
      data: IJobHistory[];
    };
  }>(GET_JOB_HISTORY_BY_USER_ID, {
    variables: { userId },
  });

  // ==================== GRAPHQL MUTATIONS ====================
  // DELETE JOB HISTORY MUTATION
  const [deleteJobHistory] = useMutation(DELETE_JOB_HISTORY, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_JOB_HISTORY_BY_USER_ID,
        variables: { userId },
      },
    ],
  });

  // ==================== DATA PROCESSING ====================
  const jobHistory = data?.jobHistoryByUserId?.data || [];

  // ==================== FORM HANDLERS ====================
  // OPEN FORM HANDLER
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

  // CLOSE FORM HANDLER
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

  // ==================== DELETE HANDLER ====================
  // DELETE EXPERIENCE HANDLER
  const handleDelete = async (job: IJobHistory) => {
    await deleteConfirmation.confirm({
      title: "Delete Experience",
      itemName: job.jobTitle,
      itemDescription: `${job.companyName} (${job.employmentType})`,
      confirmButtonText: "Delete Experience",
      successMessage: "Work experience deleted successfully",
      onDelete: async () => {
        await deleteJobHistory({
          variables: { id: Number(job.id), userId: Number(userId) },
        });
      },
    });
  };

  // ==================== RENDER CONDITIONS ====================
  // LOADING STATE
  if (loading) {
    return <ExperienceLoading />;
  }

  // EMPTY STATE
  if (!jobHistory || jobHistory.length === 0) {
    return (
      <>
        <EmptyExperienceState
          hasPermission={hasPermission(Permissions.JobHistoryCreate)}
          onAddClick={() => handleOpenForm("create")}
        />

        {/* POPUP MODAL */}
        <CustomPopup
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          customWidth="60%"
        >
          {popupOption.form === "experience" && (
            <ExperienceForm
              key="experience-form-create"
              userId={userId}
              jobHistory={popupOption.data}
              actionType={popupOption.actionType as "create" | "update"}
              onClose={handleCloseForm}
            />
          )}
        </CustomPopup>
      </>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="space-y-4">
      {/* HEADER WITH ADD BUTTON */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-base-content">
          Work Experience
        </h3>
        {hasPermission(Permissions.JobHistoryCreate) && (
          <button
            onClick={() => handleOpenForm("create")}
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlus size={18} />
            Add Experience
          </button>
        )}
      </div>

      {/* EXPERIENCE LIST */}
      <div className="space-y-4">
        {jobHistory.map((job) => {
          const isCurrentJob = !job.endDate;

          return (
            <div
              key={job.id}
              className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20 relative hover:border-primary/40 transition-colors"
            >
              {/* ACTION BUTTONS */}
              <div className="absolute top-4 right-4 flex gap-2">
                {/* EDIT BUTTON */}
                {hasPermission(Permissions.JobHistoryUpdate) && (
                  <button
                    onClick={() => handleOpenForm("update", job)}
                    className="btn btn-sm btn-ghost btn-circle text-primary hover:bg-primary/10"
                    title="Edit Experience"
                  >
                    <PiPencilSimple size={18} />
                  </button>
                )}

                {/* DELETE BUTTON */}
                {hasPermission(Permissions.JobHistoryDelete) && (
                  <button
                    onClick={() => handleDelete(job)}
                    className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/10"
                    title="Delete Experience"
                  >
                    <PiTrash size={18} />
                  </button>
                )}
              </div>

              {/* JOB DETAILS */}
              <div className="space-y-3 pr-20">
                {/* JOB TITLE AND COMPANY */}
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

                {/* LOCATION */}
                <div>
                  <p className="text-sm text-base-content/60">
                    {job.city ? `${job.city}, ${job.country}` : job.country}
                  </p>
                </div>

                {/* DURATION */}
                <div className="flex items-center gap-2 text-sm text-base-content/60">
                  <span>
                    {job.startDate
                      ? dayjs(job.startDate).format("MMM YYYY")
                      : "N/A"}
                  </span>
                  <span>-</span>
                  <span>
                    {isCurrentJob
                      ? "Present"
                      : job.endDate
                      ? dayjs(job.endDate).format("MMM YYYY")
                      : "N/A"}
                  </span>
                  {isCurrentJob && (
                    <span className="badge badge-primary badge-sm">
                      Current Job
                    </span>
                  )}
                </div>

                {/* RESPONSIBILITIES */}
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

                {/* ACHIEVEMENTS */}
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

      {/* POPUP MODAL */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="60%"
      >
        {popupOption.form === "experience" && (
          <ExperienceForm
            key={`experience-form-${popupOption.actionType}`}
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
