// import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import FieldLabel from "./components/FieldLabel";
import FieldError from "./components/FieldError";
import { getErrorMessageByPropertyName } from "@/utils/schema-validator";

interface ICustomPasswordFieldProps {
  dataAuto?: string;
  name: string;
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
  wrapperClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
}

export default function CustomPasswordField({
  dataAuto = "",
  name,
  id,
  placeholder,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  wrapperClassName = "",
  fieldClassName = "",
  labelClassName = "",
  maxLength,
  minLength,
  pattern,
}: ICustomPasswordFieldProps) {
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
      {label ? (
        <FieldLabel
          key={`${name}-fieldLabel`}
          htmlFor={id ? id : name}
          dataAuto={dataAuto}
          label={label}
          required={required}
          disabled={disabled}
          labelClassName={labelClassName}
        />
      ) : null}

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
          ...(pattern
            ? {
                pattern: {
                  value: new RegExp(pattern),
                  message: `${label} is not valid`,
                },
              }
            : {}),
        }}
        render={({ field }) => (
          <div
            className={`relative z-50 input input-md bg-base-300 w-full focus:outline-primary focus:border-primary rounded-field focus-within:border-primary focus-within:outline-2 focus-within:outline-primary border ${fieldClassName} 
                ${errorMessage ? " border-error" : "border-[#d9d9d9]"}`}
          >
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
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              {...field}
              id={id ? id : name}
              type={isVisible ? "text" : "password"}
              placeholder={`${placeholder ? placeholder : label}`}
              disabled={disabled}
              required={required}
              autoComplete={`new-password`}
              aria-invalid={!!errorMessage}
              aria-required={required}
              aria-label={label}
              aria-placeholder={`${placeholder ? placeholder : label}`}
              aria-autocomplete={`inline`}
            />
          </div>
        )}
      />
      {/* ERROR MESSAGE */}
      {errorMessage ? (
        <FieldError key={`${name}-field_error`} errorMessage={errorMessage} />
      ) : null}
    </div>
  );
}
