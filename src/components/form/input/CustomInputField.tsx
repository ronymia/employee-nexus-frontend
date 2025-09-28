// import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { getErrorMessageByPropertyName } from "../../../utils/schema-validator";

interface ICustomInputFieldProps {
  dataAuto?: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  inputMode?: "text" | "numeric" | "email" | "search" | "url" | "tel";
  size?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
  wrapperClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
}

export default function CustomInputField({
  dataAuto,
  type = "text",
  inputMode = "text",
  name,
  id,
  placeholder,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  wrapperClassName,
  fieldClassName,
  labelClassName,
  maxLength,
  minLength,
  max,
  min,
  pattern,
}: ICustomInputFieldProps) {
  // STE TO MANAGE PASSWORD VISIBILITY
  const [isVisible, setIsVisible] = useState(false);

  const {
    control,
    formState: { errors },
  } = useFormContext();
  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <div
      className={`${
        wrapperClassName && wrapperClassName
      } w-full flex flex-col gap-y-1.5`}
    >
      {/* LABEL */}
      {label && (
        <label
          data-auto={`label-${dataAuto}`}
          htmlFor={id}
          className="text-sm "
        >
          <span className={`font-semibold ${labelClassName}`}>
            {label}{" "}
            {label && required && !disabled && (
              <span className="text-error font-bold text-md">*</span>
            )}
          </span>
        </label>
      )}

      {/* INPUT FIELD */}
      <Controller
        control={control}
        name={`${name}`}
        rules={{
          // VALIDATION RULES
          required: {
            value: required,
            message: `${label} is required`,
          },
          ...(typeof maxLength === "number"
            ? {
                maxLength: {
                  value: maxLength,
                  message: `${label} must be at most ${maxLength} characters long`,
                },
              }
            : {}),
          ...(typeof minLength === "number"
            ? {
                minLength: {
                  value: minLength,
                  message: `${label} must be at least ${minLength} characters long`,
                },
              }
            : {}),
          ...(typeof max === "number"
            ? {
                max: {
                  value: max,
                  message: `${label} must be at most ${max}`,
                },
              }
            : {}),
          min: {
            value: min ?? 0,
            message: `${label} must be at least ${min}`,
          },
          ...(pattern
            ? {
                pattern: {
                  value: new RegExp(pattern),
                  message: `${label} is not valid`,
                },
              }
            : {}),
        }}
        render={({ field }) =>
          type === "password" ? (
            <div className={`w-full relative z-50`}>
              {isVisible ? (
                <AiOutlineEyeInvisible
                  onClick={() => {
                    setIsVisible(!isVisible);
                  }}
                  className="absolute right-3 text-xl top-1/2 -translate-y-1/2 z-10"
                />
              ) : (
                <AiOutlineEye
                  onClick={() => {
                    setIsVisible(!isVisible);
                  }}
                  className="absolute right-3 text-xl top-1/2 -translate-y-1/2 z-10"
                />
              )}
              <input
                {...field}
                disabled={disabled}
                id={id ? id : name}
                type={isVisible ? "text" : "password"}
                value={field.value ?? ""}
                placeholder={`${placeholder ? placeholder : label}`}
                aria-invalid={!!errorMessage}
                aria-required={required}
                autoComplete="new-password"
                className={`input input-md bg-base-300 w-full p-2 focus:outline-primary focus:border-primary rounded-field ${
                  fieldClassName ? fieldClassName : ""
                } 
                ${
                  errorMessage
                    ? "border border-error"
                    : "border border-[#d9d9d9]"
                }`}
              />
            </div>
          ) : (
            <input
              {...field}
              disabled={disabled}
              readOnly={readOnly}
              id={id ? id : name}
              value={field.value ?? ""}
              type={`${type}`}
              inputMode={inputMode}
              name={name}
              placeholder={`${placeholder ? placeholder : label}`}
              aria-invalid={!!errorMessage}
              aria-required={required}
              autoComplete="on"
              className={`input input-md bg-base-300 w-full p-2 focus:outline-primary focus:border-primary rounded-field ${
                fieldClassName ? fieldClassName : ""
              } 
              ${
                errorMessage
                  ? " border border-error"
                  : "border border-[#d9d9d9]"
              }`}
            />
          )
        }
      />
      {/* ERROR MESSAGE */}
      {!!errorMessage && (
        <small className={`text-error font-medium`}>{errorMessage}</small>
      )}
    </div>
  );
}
