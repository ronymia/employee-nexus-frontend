// import { Controller, useFormContext } from "react-hook-form";
// import TimePicker from "./TimePicker";
// import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
// import { RefObject, useState } from "react";
// import useClickOutside from "@/hooks/useClickOutside";
// import FieldLabel from "./components/FieldLabel";

// export default function CustomTimePicker({
//   id,
//   name,
//   label,
//   placeholder = "Pick Time",
//   isLoading = false,
//   position = "bottom left",
//   required = false,
//   disabled = false,
//   minTimeName,
//   maxTimeName,
//   dataAuto = "",
//   labelClassName = "",
// }: {
//   id?: string;
//   name: string;
//   dataAuto: string;
//   label?: string;
//   labelClassName?: string;
//   placeholder?: string;
//   isLoading?: boolean;
//   position?: "top left" | "top right" | "bottom left" | "bottom right";
//   required?: boolean;
//   disabled?: boolean;
//   minTimeName?: string;
//   maxTimeName?: string;
// }) {
//   const {
//     watch,
//     control,
//     formState: { errors },
//   } = useFormContext();
//   const errorMessage = getErrorMessageByPropertyName(errors, name);
//   const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
//   const timeRef = useClickOutside(() => setIsTimePickerOpen(false));

//   return (
//     <div
//       ref={timeRef as RefObject<HTMLDivElement>}
//       className={`w-full flex flex-col justify-start gap-y-1.5 relative`}
//     >
//       {/* LABEL */}
//       {label ? (
//         <FieldLabel
//           key={`${name}-fieldLabel`}
//           htmlFor={id ? id : name}
//           dataAuto={`${dataAuto}`}
//           label={label}
//           required={required}
//           disabled={disabled}
//           labelClassName={labelClassName}
//         />
//       ) : null}

//       {/* REACT HOOK FORM CONTROLLER */}
//       <Controller
//         control={control}
//         name={name}
//         rules={{
//           ...(required
//             ? {
//                 required: {
//                   value: required,
//                   message: `${label} is required`,
//                 },
//               }
//             : {}),
//         }}
//         render={({ field }) => (
//           <TimePicker
//             {...field}
//             isTimePickerOpen={isTimePickerOpen}
//             setIsTimePickerOpen={setIsTimePickerOpen}
//             isLoading={isLoading}
//             position={position}
//             placeholder={placeholder ? placeholder : label}
//             min={minTimeName ? watch(minTimeName) : ""}
//             max={maxTimeName ? watch(maxTimeName) : ""}
//             errorMessage={errorMessage}
//             disabled={disabled}
//           />
//         )}
//       />
//       {/* {errorMessage ? (
//                 <small className={`text-error font-medium`}>{errorMessage}</small>
//             ) : null} */}
//     </div>
//   );
// }
