"use client";

import { useState } from "react";
import { IPopupOption, IDocument } from "@/types";
import CustomPopup from "@/components/modal/CustomPopup";
import {
  PiPencilSimple,
  PiTrash,
  PiFileText,
  PiPlus,
  PiCalendar,
  PiDownload,
  PiFilePdf,
  PiFileDoc,
  PiFileXls,
  PiFileImage,
  PiFileZip,
  PiFile,
} from "react-icons/pi";
import DocumentForm from "./components/DocumentForm";
import moment from "moment";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_DOCUMENTS_BY_USER_ID,
  DELETE_DOCUMENT,
} from "@/graphql/document.api";
import CustomLoading from "@/components/loader/CustomLoading";
import usePermissionGuard from "@/guards/usePermissionGuard";
import { Permissions } from "@/constants/permissions.constant";
import useDeleteConfirmation from "@/hooks/useDeleteConfirmation";

interface IDocumentsContentProps {
  userId: number;
}

export default function DocumentsContent({ userId }: IDocumentsContentProps) {
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

  // Fetch documents
  const { data, loading } = useQuery<{
    documentsByUserId: {
      data: IDocument[];
    };
  }>(GET_DOCUMENTS_BY_USER_ID, {
    variables: { userId },
  });

  // Delete mutation
  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_DOCUMENTS_BY_USER_ID,
        variables: { userId },
      },
    ],
  });

  const documents = data?.documentsByUserId?.data || [];

  const handleOpenForm = (
    actionType: "create" | "update",
    document?: IDocument,
  ) => {
    setPopupOption({
      open: true,
      closeOnDocumentClick: false,
      actionType: actionType,
      form: "document",
      data: document || null,
      title: actionType === "create" ? "Upload Document" : "Update Document",
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
  const handleDelete = async (document: IDocument) => {
    await deleteConfirmation.confirm({
      title: "Delete Document",
      itemName: document.title,
      itemDescription: `Type: ${getFileExtension(document.attachment)}`,
      confirmButtonText: "Delete Document",
      successMessage: "Document deleted successfully",
      onDelete: async () => {
        await deleteDocument({
          variables: { id: Number(document.id), userId: Number(userId) },
        });
      },
    });
  };

  const handleDownload = (attachment: string, title: string) => {
    const fileUrl = `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }${attachment}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = title;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <PiFilePdf size={40} className="text-error" />;
      case "doc":
      case "docx":
        return <PiFileDoc size={40} className="text-info" />;
      case "xls":
      case "xlsx":
        return <PiFileXls size={40} className="text-success" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <PiFileImage size={40} className="text-warning" />;
      case "zip":
      case "rar":
        return <PiFileZip size={40} className="text-secondary" />;
      default:
        return <PiFile size={40} className="text-base-content/60" />;
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return <CustomLoading />;
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-primary/20">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <PiFileText size={64} className="text-base-content/30" />
          <p className="text-base-content/60 text-center">
            No documents uploaded yet
          </p>
          {hasPermission(Permissions.DocumentCreate) ? (
            <button
              onClick={() => handleOpenForm("create")}
              className="btn btn-primary btn-sm gap-2"
            >
              <PiPlus size={18} />
              Upload Document
            </button>
          ) : null}
        </div>

        {/* Popup Modal */}
        <CustomPopup
          popupOption={popupOption}
          setPopupOption={setPopupOption}
          customWidth="60%"
        >
          {popupOption.form === "document" && (
            <DocumentForm
              userId={userId}
              document={popupOption.data}
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
      {/* Header with Upload Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-base-content">Documents</h3>
          <p className="text-sm text-base-content/60">
            Total: {documents.length} document
            {documents.length !== 1 ? "s" : ""}
          </p>
        </div>
        {hasPermission(Permissions.DocumentCreate) ? (
          <button
            onClick={() => handleOpenForm("create")}
            className="btn btn-primary btn-sm gap-2"
          >
            <PiPlus size={18} />
            Upload Document
          </button>
        ) : null}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="bg-base-100 rounded-lg shadow-sm border border-primary/20 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5 relative">
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() =>
                    handleDownload(document.attachment, document.title)
                  }
                  className="btn btn-xs btn-ghost btn-circle text-success hover:bg-success/10"
                  title="Download"
                >
                  <PiDownload size={16} />
                </button>
                {hasPermission(Permissions.DocumentUpdate) ? (
                  <button
                    onClick={() => handleOpenForm("update", document)}
                    className="btn btn-xs btn-ghost btn-circle text-primary hover:bg-primary/10"
                    title="Edit"
                  >
                    <PiPencilSimple size={16} />
                  </button>
                ) : null}
                {hasPermission(Permissions.DocumentDelete) && (
                  <button
                    onClick={() => handleDelete(document)}
                    className="btn btn-xs btn-ghost btn-circle text-error hover:bg-error/10"
                    title="Delete"
                  >
                    <PiTrash size={16} />
                  </button>
                )}
              </div>

              {/* Document Content */}
              <div className="space-y-4">
                {/* File Icon */}
                <div className="flex justify-center py-4">
                  {getFileIcon(document.attachment)}
                </div>

                {/* Document Info */}
                <div className="space-y-2">
                  {/* Title */}
                  <h4 className="text-base font-semibold text-primary pr-20 line-clamp-2">
                    {document.title}
                  </h4>

                  {/* File Type Badge */}
                  <div>
                    <span className="badge badge-sm badge-ghost">
                      {getFileExtension(document.attachment)}
                    </span>
                  </div>

                  {/* Description */}
                  {document.description && (
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {document.description}
                    </p>
                  )}

                  {/* Upload Date */}
                  <div className="flex items-center gap-2 text-xs text-base-content/60 pt-2 border-t border-base-300">
                    <PiCalendar size={14} />
                    <span>
                      Uploaded:{" "}
                      {moment(document.createdAt).format("MMM DD, YYYY")}
                    </span>
                  </div>

                  {/* Updated Date (if different from created) */}
                  {moment(document.updatedAt).isAfter(
                    moment(document.createdAt).add(1, "minute"),
                  ) && (
                    <div className="flex items-center gap-2 text-xs text-base-content/60">
                      <PiCalendar size={14} />
                      <span>
                        Updated:{" "}
                        {moment(document.updatedAt).format("MMM DD, YYYY")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        customWidth="60%"
      >
        {popupOption.form === "document" && (
          <DocumentForm
            userId={userId}
            document={popupOption.data}
            actionType={popupOption.actionType as "create" | "update"}
            onClose={handleCloseForm}
          />
        )}
      </CustomPopup>
    </div>
  );
}
