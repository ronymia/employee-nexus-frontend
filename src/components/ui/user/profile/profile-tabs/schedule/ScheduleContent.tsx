"use client";

import { useState } from "react";
import { IPopupOption } from "@/types";
import CustomPopup from "@/components/modal/CustomPopup";
import {
  PiPencilSimple,
  PiTrash,
  PiCalendarBlank,
  PiPlus,
  PiCheckCircle,
  PiXCircle,
} from "react-icons/pi";
import ScheduleAssignmentForm from "./components/ScheduleAssignmentForm";

interface IDaySchedule {
  id: number;
  workScheduleId: number;
  day: string;
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
}

interface IWorkSchedule {
  id: number;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  scheduleType: "REGULAR" | "FLEXIBLE" | "SHIFT" | "ROTATIONAL";
  breakType: "PAID" | "UNPAID";
  breakHours: number;
  schedules?: IDaySchedule[];
}

interface IScheduleAssignment {
  id: number;
  userId: number;
  workScheduleId: number;
  workSchedule: IWorkSchedule;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  assignedBy: number;
  assignedByUser?: {
    id: number;
    email: string;
    profile?: {
      fullName: string;
    };
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ScheduleContentProps {
  userId: number;
  scheduleAssignments?: IScheduleAssignment[];
}

export default function ScheduleContent({
  userId,
  scheduleAssignments = [],
}: ScheduleContentProps) {
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
    assignment?: IScheduleAssignment
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
  };

  const handleDelete = (id: number) => {
    // TODO: Implement delete mutation
    console.log("Delete schedule assignment:", id);
  };

  const activeAssignment = scheduleAssignments.find(
    (assignment) => assignment.isActive
  );

  if (!scheduleAssignments || scheduleAssignments.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <PiCalendarBlank size={64} className="text-base-content/30" />
          <p className="text-base-content/60 text-center">
            No work schedule assigned yet
          </p>
          <button
            onClick={() => handleOpenForm("create")}
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlus size={18} />
            Assign Schedule
          </button>
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
        <button
          onClick={() => handleOpenForm("create")}
          className="btn btn-primary btn-sm gap-2"
        >
          <PiPlus size={18} />
          Assign Schedule
        </button>
      </div>

      {/* Active Schedule Card */}
      {activeAssignment && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 shadow-sm border-2 border-primary/30">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <PiCheckCircle size={24} className="text-primary" />
              <h4 className="text-lg font-semibold text-primary">
                Current Schedule
              </h4>
            </div>
            <span className="badge badge-primary">Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Break Type
              </label>
              <p className="text-base font-semibold text-base-content">
                {activeAssignment.workSchedule.breakType} (
                {activeAssignment.workSchedule.breakHours}h)
              </p>
            </div>
            <div>
              <label className="text-sm text-base-content/60 font-medium">
                Start Date
              </label>
              <p className="text-base font-semibold text-base-content">
                {new Date(activeAssignment.startDate).toLocaleDateString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-base-content/60 font-medium">
                Description
              </label>
              <p className="text-base text-base-content">
                {activeAssignment.workSchedule.description}
              </p>
            </div>
            {activeAssignment.notes && (
              <div className="md:col-span-2">
                <label className="text-sm text-base-content/60 font-medium">
                  Notes
                </label>
                <p className="text-sm text-base-content/80">
                  {activeAssignment.notes}
                </p>
              </div>
            )}
          </div>

          {/* Day Schedule */}
          {activeAssignment.workSchedule.schedules &&
            activeAssignment.workSchedule.schedules.length > 0 && (
              <div className="mt-4 pt-4 border-t border-primary/20">
                <h5 className="text-sm font-semibold text-base-content mb-3">
                  Weekly Schedule
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {activeAssignment.workSchedule.schedules.map(
                    (daySchedule) => (
                      <div
                        key={daySchedule.id}
                        className={`p-3 rounded-lg border ${
                          daySchedule.isWorkingDay
                            ? "bg-base-100 border-primary/20"
                            : "bg-base-200 border-base-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">
                            {daySchedule.day}
                          </span>
                          {daySchedule.isWorkingDay ? (
                            <PiCheckCircle size={16} className="text-success" />
                          ) : (
                            <PiXCircle size={16} className="text-error" />
                          )}
                        </div>
                        {daySchedule.isWorkingDay && (
                          <p className="text-xs text-base-content/60 mt-1">
                            {daySchedule.startTime} - {daySchedule.endTime}
                          </p>
                        )}
                      </div>
                    )
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
                  key={assignment.id}
                  className="bg-base-100 rounded-lg p-4 shadow-sm border border-primary/20 relative"
                >
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleOpenForm("update", assignment)}
                      className="btn btn-xs btn-ghost btn-circle text-primary hover:bg-primary/10"
                      title="Edit Assignment"
                    >
                      <PiPencilSimple size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="btn btn-xs btn-ghost btn-circle text-error hover:bg-error/10"
                      title="Delete Assignment"
                    >
                      <PiTrash size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-16">
                    <div>
                      <label className="text-xs text-base-content/60 font-medium">
                        Schedule
                      </label>
                      <p className="text-sm font-semibold text-base-content">
                        {assignment.workSchedule.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-base-content/60 font-medium">
                        Period
                      </label>
                      <p className="text-sm text-base-content">
                        {new Date(assignment.startDate).toLocaleDateString()} -{" "}
                        {assignment.endDate
                          ? new Date(assignment.endDate).toLocaleDateString()
                          : "Present"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-base-content/60 font-medium">
                        Status
                      </label>
                      <p>
                        <span
                          className={`badge badge-xs ${
                            assignment.isActive
                              ? "badge-success"
                              : "badge-ghost"
                          }`}
                        >
                          {assignment.isActive ? "Active" : "Inactive"}
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
