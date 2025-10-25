// import { Controller, useFormContext } from "react-hook-form";
// import FormModalV3 from "@/components/modals/FormModalV3";
// import { useEffect, useState } from "react";
// import useModalOption from "@/hooks/useModalOption";
// import { IoCloudUploadSharp } from "react-icons/io5";
// import { getFullImageLink } from "@/utils/getFullImageLink";
// import { RxCross2 } from "react-icons/rx";
// import { FiPlus } from "react-icons/fi";
// import FieldLabel from "./components/FieldLabel";

// export default function CustomFileUploader({
//   dataAuto,
//   id,
//   name,
//   label,
//   required,
//   disabled,
//   accept = ".png,.jpg,.jpeg,.pdf",
//   labelClassName,
//   wrapperClassName,
//   isFileUploading,
//   multiple = false,
// }: any) {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();

//   //   const errorMessage = getErrorMessageByPropertyName(errors, name);
//   const errorMessage = "";

//   const [dragOver, setDragOver] = useState(false);
//   const { modalOptions, setModalOptions } = useModalOption();

//   // Reset drag state when files change
//   useEffect(() => {
//     setDragOver(false);
//   }, []);

//   return (
//     <>
//       <FormModalV3
//         modalOptions={modalOptions}
//         setModalOptions={setModalOptions}
//       />

//       <div
//         data-auto={`${dataAuto}-date_picker_wrapper`}
//         className={`relative flex flex-col justify-start gap-2 ${
//           wrapperClassName ?? ""
//         }`}
//       >
//         {/* LABEL */}
//         {label ? (
//           <FieldLabel
//             key={`${name}-fieldLabel`}
//             htmlFor={id ? id : name}
//             dataAuto={`${dataAuto}`}
//             label={label}
//             required={required}
//             disabled={disabled}
//             labelClassName={labelClassName}
//           />
//         ) : null}

//         <Controller
//           control={control}
//           name={name}
//           render={({ field }) => {
//             const files: string[] = field.value || [];
//             // console.log({ files });

//             // HANDLE ON CHANGE
//             const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//               const selectedFiles = Array.from(e.target.files || []);
//               //   console.log({ selectedFiles });
//               const selected = Array.from(e.target.files || []).map((f) =>
//                 URL.createObjectURL(f)
//               );

//               if (multiple) {
//                 field.onChange([...(selectedFiles || []), ...selected]);
//               } else {
//                 field.onChange(selectedFiles);
//               }
//             };

//             // HANDLE ON DROP
//             const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//               e.preventDefault();
//               e.stopPropagation();
//               const dropped = Array.from(e.dataTransfer.files || []).map((f) =>
//                 URL.createObjectURL(f)
//               );
//               if (multiple) {
//                 field.onChange([...(files || []), ...dropped]);
//               } else {
//                 field.onChange(dropped);
//               }
//               setDragOver(false);
//             };

//             // HANDLE FILE REMOVE
//             const handleFileRemove = (file: string) => {
//               field.onChange(files.filter((f) => f !== file));
//             };

//             // HANDLE VIEW FILES
//             const handleViewFiles = (files: string[]) => {
//               setModalOptions((prev) => ({
//                 ...prev,
//                 open: true,
//                 data: files,
//                 title: "View Files",
//                 type: "view",
//                 form: "viewFiles",
//               }));
//             };

//             const getFileType = (file: string | File) => {
//               let ext = "";

//               if (file instanceof File) {
//                 ext = file.name?.split(".").pop()?.toLowerCase() || "";
//                 const mime = file.type;

//                 if (mime.startsWith("image/")) return "image";
//                 if (mime === "application/pdf") return "pdf";
//                 if (mime.includes("word") || ["doc", "docx"].includes(ext))
//                   return "docx";
//                 if (
//                   mime.includes("spreadsheet") ||
//                   ["xls", "xlsx", "csv"].includes(ext)
//                 )
//                   return "excel";
//                 if (
//                   mime.includes("presentation") ||
//                   ["ppt", "pptx"].includes(ext)
//                 )
//                   return "ppt";
//               } else {
//                 ext = file?.split(".").pop()?.toLowerCase() || "";

//                 if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext))
//                   return "image";
//                 if (ext === "pdf") return "pdf";
//                 if (["doc", "docx"].includes(ext)) return "docx";
//                 if (["xls", "xlsx", "csv"].includes(ext)) return "excel";
//                 if (["ppt", "pptx"].includes(ext)) return "ppt";
//               }

//               return "unknown";
//             };

//             return (
//               <div
//                 className={`border rounded-lg ${
//                   errorMessage ? "border-error" : "border-primary-content"
//                 }`}
//               >
//                 {/* BODY */}
//                 <div className="relative">
//                   {/* LOADING OVERLAY */}
//                   {isFileUploading && (
//                     <div className="absolute bg-opacity-70 top-0 left-[1.25rem]  h-full flex gap-2 flex-col justify-center items-center w-[calc(100%-2.5rem)] rounded-xl z-40 bg-primary-content">
//                       <span className="loading loading-spinner text-primary loading-lg"></span>
//                       <h1 className="text-primary">Uploading...</h1>
//                     </div>
//                   )}

//                   {/* MAIN CONTENT */}
//                   <div
//                     onDrop={handleDrop}
//                     onDragOver={(e) => {
//                       e.preventDefault();
//                       setDragOver(true);
//                     }}
//                     onDragLeave={() => setDragOver(false)}
//                     className={`${
//                       dragOver ? "opacity-70" : "opacity-100"
//                     } flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg py-8 px-5 m-5`}
//                   >
//                     {/* FILE INPUT */}
//                     <input
//                       onChange={handleOnChange}
//                       multiple={multiple}
//                       id={`file-input-${name}`}
//                       className="hidden"
//                       type="file"
//                       accept={accept}
//                     />

//                     {files.length === 0 ? (
//                       /* EMPTY STATE */
//                       <>
//                         <IoCloudUploadSharp className="text-3xl text-gray-600" />
//                         <span className="text-sm md:text-md font-semibold text-center text-gray-600">
//                           Choose a file or drag & drop it here
//                         </span>
//                         <span className="text-xs font-light text-center text-gray-600">
//                           {`Allowed ${accept} files under 5MB`}
//                         </span>
//                         <label
//                           htmlFor={`file-input-${name}`}
//                           className=" border mt-5 opacity-50 px-2 md:px-10 py-1 md:py-2 rounded-md border-gray-500 text-gray-600 cursor-pointer"
//                         >
//                           Browse File
//                         </label>
//                       </>
//                     ) : (
//                       /* FILES GRID */
//                       <div className="w-full flex flex-wrap items-center justify-center gap-4">
//                         {files?.map((file, index) => {
//                           const isFileInstance = file instanceof File;
//                           const type = getFileType(file);

//                           const fileURL = isFileInstance
//                             ? URL.createObjectURL(file)
//                             : file.startsWith("/")
//                             ? getFullImageLink(file)
//                             : file;

//                           const fileName = isFileInstance
//                             ? file.name
//                             : file?.split("/").pop();

//                           return (
//                             <div
//                               key={index}
//                               className="flex flex-col items-center"
//                             >
//                               <div className="relative w-[200px] sm:w-[100px] h-[200px] sm:h-[100px] shadow-md rounded-xl group flex justify-center items-center">
//                                 {file && (
//                                   <>
//                                     {type === "image" && (
//                                       <div
//                                         onClick={() =>
//                                           handleViewFiles([fileURL])
//                                         }
//                                       >
//                                         <img
//                                           src={fileURL}
//                                           alt={fileName}
//                                           className="h-full w-full duration-200 absolute top-0 cursor-pointer rounded-xl right-0 object-cover group-hover:opacity-20"
//                                         />
//                                       </div>
//                                     )}

//                                     {type === "pdf" && (
//                                       <div className="relative w-full h-full">
//                                         <iframe
//                                           data-auto="file-viewer-iframe-all-page"
//                                           src={fileURL}
//                                           className="w-full h-full rounded-xl"
//                                         />
//                                         {/* Transparent overlay to catch click */}
//                                         <div
//                                           className="absolute inset-0 cursor-pointer group-hover:bg-black/10 rounded-xl"
//                                           onClick={() =>
//                                             handleViewFiles([fileURL])
//                                           }
//                                         />
//                                       </div>
//                                     )}

//                                     {(type === "docx" || type === "csv") && (
//                                       <div className="relative w-full h-full">
//                                         <iframe
//                                           data-auto="file-viewer-iframe-docx-csv-all-page"
//                                           src={`https://docs.google.com/gview?url=${encodeURIComponent(
//                                             fileURL
//                                           )}&embedded=true`}
//                                           className="w-full h-full rounded-xl"
//                                         />
//                                         {/* Transparent overlay */}
//                                         <div
//                                           className="absolute inset-0 cursor-pointer group-hover:bg-black/10 rounded-xl"
//                                           onClick={() =>
//                                             handleViewFiles([fileURL])
//                                           }
//                                         />
//                                       </div>
//                                     )}
//                                   </>
//                                 )}

//                                 {/* REMOVE BUTTON */}
//                                 <button
//                                   type="button"
//                                   className="absolute -top-2 -right-2 hover:scale-125 duration-200 flex justify-center items-center bg-error w-7 h-7 rounded-full overflow-hidden shadow-md"
//                                   onClick={() => handleFileRemove(file)}
//                                 >
//                                   <RxCross2 className="text-base-300" />
//                                 </button>
//                               </div>
//                             </div>
//                           );
//                         })}

//                         {/* ADD MORE */}
//                         {multiple && (
//                           <label
//                             data-tip="Add more"
//                             htmlFor={`file-input-${name}`}
//                             className="flex flex-col items-center tooltip tooltip-right tooltip-primary"
//                           >
//                             <div className="w-[200px] sm:w-[100px] h-[200px] sm:h-[100px] bg-base-300  shadow-md rounded-xl border-2 border-dashed group flex justify-center items-center  hover:border-primary cursor-pointer text-gray-500 hover:text-primary">
//                               <FiPlus className="text-5xl md:text-3xl" />
//                             </div>
//                           </label>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           }}
//         />
//         {/* ERROR MESSAGE */}
//         <small className="text-error font-medium">{errorMessage}</small>
//       </div>
//     </>
//   );
// }
