import { Controller, useFormContext } from "react-hook-form";
import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { useState } from "react";
import { IoCloudUploadSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import FieldLabel from "./components/FieldLabel";

interface ICustomFileUploaderProps {
  dataAuto?: string;
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  multiple?: boolean;
}

export default function CustomFileUploader({
  dataAuto = "file-uploader",
  id,
  name,
  label,
  required = false,
  disabled = false,
  accept = ".png,.jpg,.jpeg,.pdf",
  labelClassName = "",
  wrapperClassName = "",
  // multiple = false,
}: ICustomFileUploaderProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      data-auto={`${dataAuto}-wrapper`}
      className={`relative flex flex-col justify-start gap-2 ${wrapperClassName}`}
    >
      {/* LABEL */}
      {label ? (
        <FieldLabel
          key={`${name}-fieldLabel`}
          htmlFor={id ? id : name}
          dataAuto={`${dataAuto}`}
          label={label}
          required={required}
          disabled={disabled}
          labelClassName={labelClassName}
        />
      ) : null}

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value = field.value;
          const file: File | null = value instanceof File ? value : null;
          const existingImagePath: string | null =
            typeof value === "string" ? value : null;

          // HANDLE ON CHANGE
          const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0] || null;
            field.onChange(selectedFile);
          };

          // HANDLE ON DROP
          const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            const droppedFile = e.dataTransfer.files?.[0] || null;
            field.onChange(droppedFile);
            setDragOver(false);
          };

          // HANDLE FILE REMOVE
          const handleFileRemove = () => {
            field.onChange(null);
          };

          const getFileType = (file: File) => {
            const mime = file.type;
            if (mime.startsWith("image/")) return "image";
            if (mime === "application/pdf") return "pdf";
            return "unknown";
          };

          const getImagePreviewUrl = () => {
            if (file) {
              return URL.createObjectURL(file);
            }
            if (existingImagePath) {
              const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
              // Handle both absolute paths and relative paths
              if (existingImagePath.startsWith("http")) {
                return existingImagePath;
              }
              return `${apiUrl}${existingImagePath}`;
            }
            return null;
          };

          const hasFile = file || existingImagePath;

          return (
            <div
              className={`border rounded-lg ${
                errorMessage ? "border-error" : "border-primary-content"
              }`}
            >
              {/* MAIN CONTENT */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                className={`${
                  dragOver ? "opacity-70 bg-primary/10" : "opacity-100"
                } flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg py-8 px-5 m-5 transition-all duration-200`}
              >
                {/* FILE INPUT */}
                <input
                  onChange={handleOnChange}
                  id={`file-input-${name}`}
                  className="hidden"
                  type="file"
                  accept={accept}
                  disabled={disabled}
                />

                {!hasFile ? (
                  /* EMPTY STATE */
                  <>
                    <IoCloudUploadSharp className="text-3xl text-gray-600 mb-2" />
                    <span className="text-sm md:text-md font-semibold text-center text-gray-600 mb-1">
                      Choose a file or drag & drop it here
                    </span>
                    <span className="text-xs font-light text-center text-gray-600 mb-4">
                      {`Allowed ${accept} files`}
                    </span>
                    <label
                      htmlFor={`file-input-${name}`}
                      className="border mt-2 px-4 py-2 rounded-md border-gray-500 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      Browse File
                    </label>
                  </>
                ) : (
                  /* FILE DISPLAY */
                  <div className="flex flex-col items-center relative">
                    <div className="relative w-[200px] sm:w-[100px] h-[200px] sm:h-[100px] shadow-md rounded-xl group flex justify-center items-center overflow-hidden">
                      {file && getFileType(file) === "image" && (
                        <img
                          src={getImagePreviewUrl() || ""}
                          alt={file.name}
                          className="h-full w-full object-cover rounded-xl"
                        />
                      )}
                      {existingImagePath && !file && (
                        <img
                          src={getImagePreviewUrl() || ""}
                          alt="Existing"
                          className="h-full w-full object-cover rounded-xl"
                        />
                      )}
                      {file && getFileType(file) === "pdf" && (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl">📄</span>
                          <span className="text-xs mt-1">PDF</span>
                        </div>
                      )}
                      {file && getFileType(file) === "unknown" && (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl">📎</span>
                          <span className="text-xs mt-1">File</span>
                        </div>
                      )}

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 hover:scale-125 duration-200 flex justify-center items-center bg-error w-7 h-7 rounded-full overflow-hidden shadow-md"
                        onClick={handleFileRemove}
                      >
                        <RxCross2 className="text-base-300 text-sm" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-600 mt-1 max-w-[100px] truncate">
                      {file ? file.name : existingImagePath?.split("/").pop()}
                    </span>
                    {/* CHANGE IMAGE BUTTON */}
                    <label
                      htmlFor={`file-input-${name}`}
                      className="text-xs text-primary cursor-pointer hover:underline mt-2"
                    >
                      Change Image
                    </label>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />
      {/* ERROR MESSAGE */}
      <small className="text-error font-medium">{errorMessage}</small>
    </div>
  );
}
