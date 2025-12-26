"use client";

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
import CustomLoading from "@/components/loader/CustomLoading";
import FormModal from "@/components/form/FormModal";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";

interface EducationContentProps {
  userId: number;
}

export default function EducationContent({ userId }: EducationContentProps) {
  const { hasPermission } = usePermissionGuard();
  const [popupOption, setPopupOption] = useState<IPopupOption>({
    open: false,
    closeOnDocumentClick: true,
    actionType: "create",
    form: "",
    data: null,
    title: "",
  });

  // Fetch education history
  const { data, loading, refetch } = useQuery<{
    educationHistoryByUserId: {
      data: IEducationHistory[];
    };
  }>(GET_EDUCATION_HISTORY_BY_USER_ID, {
    variables: { userId },
  });

  // Delete mutation
  const [deleteEducation] = useMutation(DELETE_EDUCATION_HISTORY, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_EDUCATION_HISTORY_BY_USER_ID,
        variables: { userId },
      },
    ],
  });

  const educationHistory = data?.educationHistoryByUserId?.data || [];

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

  const handleDelete = async ({ id }: { id: number }) => {
    try {
      await deleteEducation({
        variables: { id: Number(id), userId: Number(userId) },
      });
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  const educationDeleteHandler = async (id: number) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: true,
      actionType: "delete",
      form: "",
      deleteHandler: () => handleDelete({ id }),
      title: "",
    });
  };

  if (loading) {
    return <CustomLoading />;
  }

  if (!educationHistory || educationHistory.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <PiGraduationCap size={64} className="text-base-content/30" />
          <p className="text-base-content/60 text-center">
            No education history added yet
          </p>
          {hasPermission(Permissions.EducationHistoryCreate) ? (
            <button
              onClick={() => handleOpenForm("create")}
              className="btn btn-primary btn-sm gap-2"
            >
              <PiPlus size={18} />
              Add Education
            </button>
          ) : null}
        </div>

        {/* Popup Modal */}
        <CustomPopup
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          customWidth="60%"
        >
          {popupOption.form === "education" && (
            <EducationForm
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

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-base-content">
          Education History
        </h3>
        <button
          onClick={() => handleOpenForm("create")}
          className="btn btn-primary btn-sm gap-2"
        >
          <PiPlus size={18} />
          Add Education
        </button>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {educationHistory.map((education) => (
          <div
            key={education.id}
            className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20 relative"
          >
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              {hasPermission(Permissions.EducationHistoryUpdate) ? (
                <button
                  onClick={() => handleOpenForm("update", education)}
                  className="btn btn-sm btn-ghost btn-circle text-primary hover:bg-primary/10"
                  title="Edit Education"
                >
                  <PiPencilSimple size={18} />
                </button>
              ) : null}
              {hasPermission(Permissions.EducationHistoryDelete) ? (
                <button
                  onClick={() => educationDeleteHandler(education.id)}
                  className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/10"
                  title="Delete Education"
                >
                  <PiTrash size={18} />
                </button>
              ) : null}
            </div>

            {/* Education Details */}
            <div className="space-y-3 pr-20">
              {/* Degree and Field */}
              <div>
                <h4 className="text-lg font-semibold text-primary">
                  {education.degree}
                </h4>
                <p className="text-base font-medium text-base-content">
                  {education.fieldOfStudy}
                </p>
              </div>

              {/* Institution and Location */}
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

              {/* Duration */}
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <span>{education.startDate}</span>
                <span>-</span>
                <span>
                  {education.isCurrentlyStudying
                    ? "Present"
                    : education.endDate || "N/A"}
                </span>
                {education.isCurrentlyStudying && (
                  <span className="badge badge-primary badge-sm">
                    Currently Studying
                  </span>
                )}
              </div>

              {/* Grade */}
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

              {/* Description */}
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

      {/* Popup Modal */}
      {popupOption.actionType === "delete" ? (
        <FormModal popupOption={popupOption} setPopupOption={setPopupOption} />
      ) : (
        <CustomPopup
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          customWidth="60%"
        >
          {popupOption.form === "education" && (
            <EducationForm
              userId={userId}
              education={popupOption.data}
              actionType={popupOption.actionType as "create" | "update"}
              onClose={handleCloseForm}
            />
          )}
        </CustomPopup>
      )}
    </div>
  );
}
