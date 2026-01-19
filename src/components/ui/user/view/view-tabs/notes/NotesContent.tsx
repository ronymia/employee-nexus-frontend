"use client";

import { useState } from "react";
import { IPopupOption, INote } from "@/types";
import CustomPopup from "@/components/modal/CustomPopup";
import {
  PiPencilSimple,
  PiTrash,
  PiNote,
  PiPlus,
  PiCalendar,
  PiUser,
  PiLockKey,
  PiGlobe,
  PiTag,
} from "react-icons/pi";
import NoteForm from "./components/NoteForm";
import moment from "moment";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_NOTES_BY_USER_ID, DELETE_NOTE } from "@/graphql/note.api";
import CustomLoading from "@/components/loader/CustomLoading";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import useDeleteConfirmation from "@/hooks/useDeleteConfirmation";

interface INotesContentProps {
  userId: number;
  currentUserId?: number; // The logged-in user ID to check permissions
}

export default function NotesContent({
  userId,
  currentUserId,
}: INotesContentProps) {
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

  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());

  // Fetch notes
  const { data, loading } = useQuery<{
    notesByUserId: {
      data: INote[];
    };
  }>(GET_NOTES_BY_USER_ID, {
    variables: { userId },
  });

  // Delete mutation
  const [deleteNote] = useMutation(DELETE_NOTE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_NOTES_BY_USER_ID,
        variables: { userId },
      },
    ],
  });

  const notes = data?.notesByUserId?.data || [];

  const handleOpenForm = (actionType: "create" | "update", note?: INote) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: actionType,
      form: "note",
      data: note || null,
      title: actionType === "create" ? "Add Note" : "Update Note",
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

  // ==================== DELETE HANDLER ====================
  const handleDelete = async (note: INote) => {
    await deleteConfirmation.confirm({
      title: "Delete Note",
      itemName: note.title,
      itemDescription: `Category: ${note.category || "General"} • ${note.isPrivate ? "Private" : "Public"}`,
      confirmButtonText: "Delete Note",
      successMessage: "Note deleted successfully",
      onDelete: async () => {
        await deleteNote({
          variables: { id: Number(note.id), userId: Number(userId) },
        });
      },
    });
  };

  const toggleExpand = (noteId: number) => {
    setExpandedNotes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const getCategoryBadgeClass = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "performance":
        return "badge-success";
      case "incident":
        return "badge-error";
      case "feedback":
        return "badge-info";
      case "general":
        return "badge-ghost";
      default:
        return "badge-ghost";
    }
  };

  // Group notes by category
  const categorizedNotes = notes.reduce(
    (acc, note) => {
      const category = note.category || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(note);
      return acc;
    },
    {} as Record<string, INote[]>,
  );

  if (loading) {
    return <CustomLoading />;
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <PiNote size={64} className="text-base-content/30" />
          <p className="text-base-content/60 text-center">No notes added yet</p>
          {hasPermission(Permissions.NoteCreate) ? (
            <button
              onClick={() => handleOpenForm("create")}
              className="btn btn-primary btn-sm gap-2"
            >
              <PiPlus size={18} />
              Add Note
            </button>
          ) : null}
        </div>

        {/* Popup Modal */}
        <CustomPopup
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          customWidth="60%"
        >
          {popupOption.form === "note" && (
            <NoteForm
              userId={userId}
              note={popupOption.data}
              actionType={popupOption.actionType as "create" | "update"}
              onClose={handleCloseForm}
            />
          )}
        </CustomPopup>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-base-content">Notes</h3>
          <p className="text-sm text-base-content/60">
            Total: {notes.length} note{notes.length !== 1 ? "s" : ""}
          </p>
        </div>
        {hasPermission(Permissions.NoteCreate) ? (
          <button
            onClick={() => handleOpenForm("create")}
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlus size={18} />
            Add Note
          </button>
        ) : null}
      </div>

      {/* Notes by Category */}
      {Object.entries(categorizedNotes).map(([category, categoryNotes]) => (
        <div key={category}>
          <h4 className="text-base font-semibold text-base-content mb-3 flex items-center gap-2">
            <PiTag size={18} />
            {category} ({categoryNotes.length})
          </h4>
          <div className="space-y-3">
            {categoryNotes.map((note) => {
              const isExpanded = expandedNotes.has(note.id);
              const contentPreview =
                note.content.length > 150
                  ? note.content.substring(0, 150) + "..."
                  : note.content;
              const hasMore = note.content.length > 150;

              return (
                <div
                  key={note.id}
                  className="bg-base-100 rounded-lg shadow-sm border border-primary/20 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    {/* Action Buttons */}
                    <div className="absolute top-0 right-0 flex gap-2">
                      {hasPermission(Permissions.NoteUpdate) ? (
                        <button
                          onClick={() => handleOpenForm("update", note)}
                          className="btn btn-xs btn-ghost btn-circle text-primary hover:bg-primary/10"
                          title="Edit"
                        >
                          <PiPencilSimple size={16} />
                        </button>
                      ) : null}
                      {hasPermission(Permissions.NoteDelete) && (
                        <button
                          onClick={() => handleDelete(note)}
                          className="btn btn-xs btn-ghost btn-circle text-error hover:bg-error/10"
                          title="Delete"
                        >
                          <PiTrash size={16} />
                        </button>
                      )}
                    </div>

                    {/* Note Content */}
                    <div className="space-y-3 pr-20">
                      {/* Title and Badges */}
                      <div className="space-y-2">
                        <h5 className="text-base font-semibold text-primary">
                          {note.title}
                        </h5>
                        <div className="flex items-center gap-2 flex-wrap">
                          {note.category && (
                            <span
                              className={`badge badge-sm ${getCategoryBadgeClass(
                                note.category,
                              )}`}
                            >
                              {note.category}
                            </span>
                          )}
                          <span
                            className={`badge badge-sm gap-1 ${
                              note.isPrivate ? "badge-warning" : "badge-info"
                            }`}
                          >
                            {note.isPrivate ? (
                              <>
                                <PiLockKey size={12} />
                                Private
                              </>
                            ) : (
                              <>
                                <PiGlobe size={12} />
                                Public
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-sm text-base-content/80">
                        <p className="whitespace-pre-wrap">
                          {isExpanded ? note.content : contentPreview}
                        </p>
                        {hasMore && (
                          <button
                            onClick={() => toggleExpand(note.id)}
                            className="text-primary hover:underline text-xs mt-1"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="pt-3 border-t border-base-300 space-y-1">
                        {/* Created By */}
                        {note.creator && (
                          <div className="flex items-center gap-2 text-xs text-base-content/60">
                            <PiUser size={14} />
                            <span>
                              Created by:{" "}
                              {note.creator?.profile?.fullName ||
                                note.creator.email}
                            </span>
                          </div>
                        )}

                        {/* Created Date */}
                        <div className="flex items-center gap-2 text-xs text-base-content/60">
                          <PiCalendar size={14} />
                          <span>
                            Created:{" "}
                            {moment(note.createdAt).format(
                              "MMM DD, YYYY HH:mm",
                            )}
                          </span>
                        </div>

                        {/* Updated Date (if different) */}
                        {moment(note.updatedAt).isAfter(
                          moment(note.createdAt).add(1, "minute"),
                        ) && (
                          <div className="flex items-center gap-2 text-xs text-base-content/60">
                            <PiCalendar size={14} />
                            <span>
                              Updated:{" "}
                              {moment(note.updatedAt).format(
                                "MMM DD, YYYY HH:mm",
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Popup Modal */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="60%"
      >
        {popupOption.form === "note" && (
          <NoteForm
            userId={userId}
            note={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={handleCloseForm}
          />
        )}
      </CustomPopup>
    </div>
  );
}
