"use client";

import { useState } from "react";
import { IPopupOption } from "@/types";
import CustomPopup from "@/components/modal/CustomPopup";
import CustomLoading from "@/components/loader/CustomLoading";
import {
  PiPencilSimple,
  PiTrash,
  PiCalendarBlank,
  PiPlus,
  PiCheckCircle,
  PiXCircle,
} from "react-icons/pi";
import ScheduleAssignmentForm from "./components/ScheduleAssignmentForm";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_EMPLOYEE_WORK_SCHEDULE,
  UPDATE_EMPLOYEE_WORK_SCHEDULE,
} from "@/graphql/employee-work-schedule.api";
import moment from "moment";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import useDeleteConfirmation from "@/hooks/useDeleteConfirmation";
import { IEmployeeWorkSchedule } from "@/types/employee-work-schedule.type";
import {
  generateWeekDays,
  convertTo12HourFormat,
} from "@/utils/date-time.utils";

interface IScheduleContentProps {
  userId: number;
}

export default function ScheduleContent({ userId }: IScheduleContentProps) {
  // ==================== HOOKS ====================
  const { hasPermission } = usePermissionGuard();
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

  // ==================== API QUERIES ====================
  const { data, loading, refetch } = useQuery<{
    workScheduleHistory: {
      data: IEmployeeWorkSchedule[];
    };
  }>(GET_EMPLOYEE_WORK_SCHEDULE, {
    variables: { userId },
  });

  const scheduleAssignments = data?.workScheduleHistory?.data || [];

  const handleOpenForm = (
    actionType: "create" | "update",
    assignment?: IEmployeeWorkSchedule,
  ) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: actionType,
      form: "scheduleAssignment",
      data: assignment || null,
      title:
        actionType === "create"
          ? "Assign Work Schedule"
          : "Update Schedule Assignment",
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
    refetch();
  };

  // ==================== DELETE HANDLER ====================
  const handleDelete = async (assignment: IEmployeeWorkSchedule) => {
    await deleteConfirmation.confirm({
      title: "Delete Schedule Assignment",
      itemName: assignment.workSchedule.name,
      itemDescription: `Start Date: ${moment(assignment.startDate).format("MMM DD, YYYY")}`,
      confirmButtonText: "Delete Assignment",
      successMessage: "Schedule assignment deleted successfully",
      onDelete: async () => {
        await updateSchedule({
          variables: {
            updateEmployeeScheduleInput: {
              userId: assignment.userId,
              workScheduleId: assignment.workScheduleId,
              startDate: assignment.startDate,
              endDate: new Date().toISOString(),
              notes: assignment.notes,
            },
          },
        });
        refetch();
      },
    });
  };

  const [updateSchedule] = useMutation(UPDATE_EMPLOYEE_WORK_SCHEDULE);

  const activeAssignment = scheduleAssignments.find(
    (assignment) => assignment.isActive,
  );

  if (loading) {
    return <CustomLoading />;
  }

  if (!scheduleAssignments || scheduleAssignments.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <PiCalendarBlank size={64} className="text-base-content/30" />
          <p className="text-base-content/60 text-center">
            No work schedule assigned yet
          </p>
          {hasPermission(Permissions.WorkScheduleUpdate) ? (
            <button
              onClick={() => handleOpenForm("create")}
              className="btn btn-primary btn-sm gap-2"
            >
              <PiPlus size={18} />
              Assign Schedule
            </button>
          ) : null}
        </div>

        {/* Popup Modal */}
        <CustomPopup
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          customWidth="70%"
        >
          {popupOption.form === "scheduleAssignment" && (
            <ScheduleAssignmentForm
              userId={userId}
              assignment={popupOption.data}
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
      {/* Header with Assign Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-base-content">
          Work Schedule Assignments
        </h3>
        {hasPermission(Permissions.WorkScheduleUpdate) ? (
          <button
            onClick={() => handleOpenForm("create")}
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlus size={18} />
            Assign Schedule
          </button>
        ) : null}
      </div>

      {/* Active Schedule Card */}
      {activeAssignment && (
        <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <PiCheckCircle size={24} className="text-success" />
              <h4 className="text-lg font-semibold text-base-content">
                Current Work Schedule
              </h4>
            </div>
            <span className="badge badge-success gap-1">
              <PiCheckCircle size={14} />
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm text-base-content/60 font-medium">
                Schedule Name
              </label>
              <p className="text-base font-semibold text-base-content">
                {activeAssignment.workSchedule.name}
              </p>
            </div>
            <div>
              <label className="text-sm text-base-content/60 font-medium">
                Schedule Type
              </label>
              <p className="text-base font-semibold text-base-content">
                {activeAssignment.workSchedule.scheduleType}
              </p>
            </div>
            <div>
              <label className="text-sm text-base-content/60 font-medium">
                Break Time
              </label>
              <p className="text-base font-semibold text-base-content">
                {activeAssignment.workSchedule.breakType} (
                {activeAssignment.workSchedule.breakMinutes} min)
              </p>
            </div>
            <div>
              <label className="text-sm text-base-content/60 font-medium">
                Start Date
              </label>
              <p className="text-base font-semibold text-base-content">
                {moment(activeAssignment.startDate).format("MMM DD, YYYY")}
              </p>
            </div>
            {activeAssignment.assignedByUser && (
              <div>
                <label className="text-sm text-base-content/60 font-medium">
                  Assigned By
                </label>
                <p className="text-base font-semibold text-base-content">
                  {activeAssignment.assignedByUser.profile?.fullName ||
                    activeAssignment.assignedByUser.email}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm text-base-content/60 font-medium">
                Description
              </label>
              <p className="text-base text-base-content">
                {activeAssignment.workSchedule.description || "No description"}
              </p>
            </div>
          </div>

          {activeAssignment.notes && (
            <div className="mb-4">
              <label className="text-sm text-base-content/60 font-medium">
                Notes
              </label>
              <p className="text-sm text-base-content/80">
                {activeAssignment.notes}
              </p>
            </div>
          )}

          {/* Weekly Schedule */}
          {activeAssignment.workSchedule.schedules &&
            activeAssignment.workSchedule.schedules.length > 0 && (
              <div className="pt-4 border-t border-base-300">
                <h5 className="text-sm font-semibold text-base-content mb-4">
                  Weekly Schedule
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                  {activeAssignment.workSchedule.schedules.map(
                    (daySchedule) => (
                      <div
                        key={daySchedule.id}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          !daySchedule.isWeekend
                            ? "bg-success/5 border-success/30 hover:border-success hover:shadow-sm"
                            : "bg-base-200 border-base-300 opacity-60"
                        }`}
                      >
                        <div className="font-bold text-sm mb-2 text-base-content">
                          {
                            generateWeekDays({ startOfWeekDay: 0 })[
                              daySchedule.dayOfWeek
                            ]?.shortName
                          }
                        </div>
                        {!daySchedule.isWeekend ? (
                          <div className="space-y-2">
                            <PiCheckCircle
                              size={20}
                              className="text-success mx-auto"
                            />
                            {daySchedule.timeSlots &&
                              daySchedule.timeSlots.length > 0 && (
                                <div className="text-xs text-base-content/70 space-y-0.5">
                                  <div className="font-medium">
                                    {convertTo12HourFormat(
                                      daySchedule.timeSlots[0].startTime,
                                    )}
                                  </div>
                                  <div className="text-base-content/40">to</div>
                                  <div className="font-medium">
                                    {convertTo12HourFormat(
                                      daySchedule.timeSlots[0].endTime,
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <PiXCircle
                              size={20}
                              className="text-error mx-auto"
                            />
                            <p className="text-xs text-base-content/50 font-medium mt-1">
                              Weekend
                            </p>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Assignment History */}
      {scheduleAssignments.length > 1 && (
        <div>
          <h4 className="text-base font-semibold text-base-content mb-3">
            Assignment History
          </h4>
          <div className="space-y-3">
            {scheduleAssignments
              .filter((assignment) => !assignment.isActive)
              .map((assignment) => (
                <div
                  key={assignment.userId + assignment.workScheduleId}
                  className="bg-base-100 rounded-lg p-4 shadow-sm border border-primary/20 relative"
                >
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3">
                    {hasPermission(Permissions.WorkScheduleUpdate) && (
                      <button
                        onClick={() => handleDelete(assignment)}
                        className="btn btn-xs btn-ghost btn-circle text-error hover:bg-error/10"
                        title="Delete Assignment"
                      >
                        <PiTrash size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-16">
                    <div>
                      <label className="text-xs text-base-content/60 font-medium">
                        Schedule
                      </label>
                      <p className="text-sm font-semibold text-base-content">
                        {assignment.workSchedule.name}
                      </p>
                      <p className="text-xs text-base-content/60 mt-0.5">
                        {assignment.workSchedule.scheduleType}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-base-content/60 font-medium">
                        Period
                      </label>
                      <p className="text-sm text-base-content">
                        {moment(assignment.startDate).format("MMM DD, YYYY")} -{" "}
                        {assignment.endDate
                          ? moment(assignment.endDate).format("MMM DD, YYYY")
                          : "Present"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-base-content/60 font-medium">
                        Status
                      </label>
                      <p>
                        <span className="badge badge-xs badge-ghost">
                          Inactive
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Popup Modal */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="70%"
      >
        {popupOption.form === "scheduleAssignment" && (
          <ScheduleAssignmentForm
            userId={userId}
            assignment={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={handleCloseForm}
          />
        )}
      </CustomPopup>
    </div>
  );
}
