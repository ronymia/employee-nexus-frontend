"use client";

// ==================== EXTERNAL IMPORTS ====================
import { useState } from "react";
import { IPopupOption, IEducationHistory } from "@/types";
import CustomPopup from "@/components/modal/CustomPopup";
import {
  PiPencilSimple,
  PiTrash,
  PiGraduationCap,
  PiPlus,
} from "react-icons/pi";
import EducationForm from "./components/EducationForm";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_EDUCATION_HISTORY_BY_USER_ID,
  DELETE_EDUCATION_HISTORY,
} from "@/graphql/education-history.api";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import useDeleteConfirmation from "@/hooks/useDeleteConfirmation";
import dayjs from "dayjs";
import { motion } from "framer-motion";

// ==================== INTERFACES ====================
interface IEducationContentProps {
  userId: number;
}

// ==================== SUB-COMPONENTS ====================

// SKELETON LOADING COMPONENT WITH ANIMATION
function EducationLoading() {
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
        {/* DEGREE SKELETON */}
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

        {/* INSTITUTION SKELETON */}
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
function EmptyEducationState({
  hasPermission,
  onAddClick,
}: {
  hasPermission: boolean;
  onAddClick: () => void;
}) {
  return (
    <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <PiGraduationCap size={64} className="text-base-content/30" />
        <p className="text-base-content/60 text-center">
          No education history added yet
        </p>
        {hasPermission && (
          <button onClick={onAddClick} className="btn btn-primary btn-sm gap-2">
            <PiPlus size={18} />
            Add Education
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function EducationContent({ userId }: IEducationContentProps) {
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
  // FETCH EDUCATION HISTORY
  const { data, loading } = useQuery<{
    educationHistoryByUserId: {
      data: IEducationHistory[];
    };
  }>(GET_EDUCATION_HISTORY_BY_USER_ID, {
    variables: { userId },
  });

  // ==================== GRAPHQL MUTATIONS ====================
  // DELETE EDUCATION MUTATION
  const [deleteEducation] = useMutation(DELETE_EDUCATION_HISTORY, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_EDUCATION_HISTORY_BY_USER_ID,
        variables: { userId },
      },
    ],
  });

  // ==================== DATA PROCESSING ====================
  const educationHistory = data?.educationHistoryByUserId?.data || [];

  // ==================== FORM HANDLERS ====================
  // OPEN FORM HANDLER
  const handleOpenForm = (
    actionType: "create" | "update",
    education?: IEducationHistory
  ) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: actionType,
      form: "education",
      data: education || null,
      title: actionType === "create" ? "Add Education" : "Update Education",
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
  // DELETE EDUCATION HANDLER
  const handleDelete = async (education: IEducationHistory) => {
    await deleteConfirmation.confirm({
      title: "Delete Education",
      itemName: education.degree,
      itemDescription: `${education.fieldOfStudy} at ${education.institution}`,
      confirmButtonText: "Delete Education",
      successMessage: "Education history deleted successfully",
      onDelete: async () => {
        await deleteEducation({
          variables: { id: Number(education.id), userId: Number(userId) },
        });
      },
    });
  };

  // ==================== RENDER CONDITIONS ====================
  // LOADING STATE
  if (loading) {
    return <EducationLoading />;
  }

  // EMPTY STATE
  if (!educationHistory || educationHistory.length === 0) {
    return (
      <>
        <EmptyEducationState
          hasPermission={hasPermission(Permissions.EducationHistoryCreate)}
          onAddClick={() => handleOpenForm("create")}
        />

        {/* POPUP MODAL */}
        <CustomPopup
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          customWidth="60%"
        >
          {popupOption.form === "education" && (
            <EducationForm
              key="education-form-create"
              userId={userId}
              education={popupOption.data}
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
          Education History
        </h3>
        {hasPermission(Permissions.EducationHistoryCreate) && (
          <button
            onClick={() => handleOpenForm("create")}
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlus size={18} />
            Add Education
          </button>
        )}
      </div>

      {/* EDUCATION LIST */}
      <div className="space-y-4">
        {educationHistory.map((education) => (
          <div
            key={education.id}
            className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20 relative hover:border-primary/40 transition-colors"
          >
            {/* ACTION BUTTONS */}
            <div className="absolute top-4 right-4 flex gap-2">
              {/* EDIT BUTTON */}
              {hasPermission(Permissions.EducationHistoryUpdate) && (
                <button
                  onClick={() => handleOpenForm("update", education)}
                  className="btn btn-sm btn-ghost btn-circle text-primary hover:bg-primary/10"
                  title="Edit Education"
                >
                  <PiPencilSimple size={18} />
                </button>
              )}

              {/* DELETE BUTTON */}
              {hasPermission(Permissions.EducationHistoryDelete) && (
                <button
                  onClick={() => handleDelete(education)}
                  className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/10"
                  title="Delete Education"
                >
                  <PiTrash size={18} />
                </button>
              )}
            </div>

            {/* EDUCATION DETAILS */}
            <div className="space-y-3 pr-20">
              {/* DEGREE AND FIELD OF STUDY */}
              <div>
                <h4 className="text-lg font-semibold text-primary">
                  {education.degree}
                </h4>
                <p className="text-base font-medium text-base-content">
                  {education.fieldOfStudy}
                </p>
              </div>

              {/* INSTITUTION AND LOCATION */}
              <div>
                <p className="text-base font-medium text-base-content">
                  {education.institution}
                </p>
                <p className="text-sm text-base-content/60">
                  {education.city
                    ? `${education.city}, ${education.country}`
                    : education.country}
                </p>
              </div>

              {/* DURATION */}
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <span>
                  {education.startDate
                    ? dayjs(education.startDate).format("MMM YYYY")
                    : "N/A"}
                </span>
                <span>-</span>
                <span>
                  {education.isCurrentlyStudying
                    ? "Present"
                    : education.endDate
                    ? dayjs(education.endDate).format("MMM YYYY")
                    : "N/A"}
                </span>
                {education.isCurrentlyStudying && (
                  <span className="badge badge-primary badge-sm">
                    Currently Studying
                  </span>
                )}
              </div>

              {/* GRADE */}
              {education.grade && (
                <div>
                  <span className="text-sm font-medium text-base-content/60">
                    Grade:{" "}
                  </span>
                  <span className="text-sm font-semibold text-base-content">
                    {education.grade}
                  </span>
                </div>
              )}

              {/* DESCRIPTION */}
              {education.description && (
                <div>
                  <p className="text-sm text-base-content/80 mt-2">
                    {education.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* POPUP MODAL */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="60%"
      >
        {popupOption.form === "education" && (
          <EducationForm
            key={`education-form-${popupOption.actionType}`}
            userId={userId}
            education={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={handleCloseForm}
          />
        )}
      </CustomPopup>
    </div>
  );
}
