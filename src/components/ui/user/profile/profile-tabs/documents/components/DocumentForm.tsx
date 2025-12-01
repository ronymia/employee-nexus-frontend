"use client";

import CustomForm from "@/components/form/CustomForm";
import FormActionButton from "@/components/form/FormActionButton";
import CustomInputField from "@/components/form/input/CustomInputField";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import { useState } from "react";
import { PiUploadSimple, PiFile, PiX } from "react-icons/pi";

interface IDocument {
  id: number;
  userId: number;
  title: string;
  description?: string;
  attachment: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentFormProps {
  userId: number;
  document?: IDocument;
  actionType: "create" | "update";
  onClose: () => void;
}

export default function DocumentForm({
  userId,
  document,
  actionType,
  onClose,
}: DocumentFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>(
    document?.attachment || ""
  );

  const handleSubmit = async (data: any) => {
    console.log("Document Form Submit:", {
      ...data,
      userId,
      actionType,
      file: selectedFile,
    });
    // TODO: Implement GraphQL mutation with file upload
    onClose();
  };

  const defaultValues = {
    title: document?.title || "",
    description: document?.description || "",
    attachment: document?.attachment || "",
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(file.name);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview("");
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <CustomForm submitHandler={handleSubmit} defaultValues={defaultValues}>
      <div className="space-y-4">
        {/* Document Information */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            Document Information
          </h4>
          <div className="space-y-4">
            <CustomInputField
              dataAuto="title"
              name="title"
              label="Document Title"
              placeholder="Enter document title"
              type="text"
              required={true}
            />

            <CustomTextareaField
              dataAuto="description"
              name="description"
              label="Description"
              placeholder="Enter document description (optional)"
              required={false}
              rows={3}
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h4 className="text-base font-semibold mb-3 text-primary">
            File Attachment
          </h4>
          <div className="space-y-4">
            {/* File Input */}
            {!selectedFile && !filePreview && (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <PiUploadSimple size={48} className="text-primary/60 mb-2" />
                  <span className="text-sm font-medium text-base-content mb-1">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-base-content/60">
                    PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (MAX. 10MB)
                  </span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip,.rar"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {/* Selected File Preview */}
            {(selectedFile || filePreview) && (
              <div className="bg-base-200/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PiFile size={32} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-base-content">
                        {selectedFile?.name || filePreview}
                      </p>
                      {selectedFile && (
                        <p className="text-xs text-base-content/60">
                          {formatFileSize(selectedFile.size)} •{" "}
                          {getFileExtension(selectedFile.name)}
                        </p>
                      )}
                      {!selectedFile && filePreview && (
                        <p className="text-xs text-base-content/60">
                          Current file • {getFileExtension(filePreview)}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="btn btn-xs btn-ghost btn-circle text-error"
                    title="Remove file"
                  >
                    <PiX size={16} />
                  </button>
                </div>

                {/* Change File Button */}
                {actionType === "update" && (
                  <div className="mt-3">
                    <label
                      htmlFor="file-change"
                      className="btn btn-sm btn-ghost gap-2 cursor-pointer"
                    >
                      <PiUploadSimple size={16} />
                      Change File
                    </label>
                    <input
                      id="file-change"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip,.rar"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>
            )}

            {/* File Upload Info */}
            <div className="alert alert-info text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                {actionType === "create"
                  ? "Please upload a document file to continue."
                  : "Upload a new file to replace the existing document."}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <FormActionButton isPending={false} cancelHandler={onClose} />
      </div>
    </CustomForm>
  );
}
