import { Controller, useFormContext } from "react-hook-form";
import FieldLabel from "./components/FieldLabel";
import FieldError from "./components/FieldError";
import { getErrorMessageByPropertyName } from "@/utils/schema-validator";

interface ICustomEmailFieldProps {
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

export default function CustomEmailField({
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
}: ICustomEmailFieldProps) {
  // GET FORM CONTEXT
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // GET ERROR
  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <div className={`${wrapperClassName} w-full flex flex-col gap-y-1.5`}>
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
        render={({ field }) => {
          return (
            <div
              className={`input input-md bg-base-300 w-full rounded-field focus-within:border-primary focus-within:outline-2 focus-within:outline-primary border ${fieldClassName} 
              ${errorMessage ? "border-error" : "border-[#d9d9d9]"}`}
            >
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
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                {...field}
                id={id ? id : name}
                name={name}
                type={`email`}
                inputMode={`email`}
                placeholder={`${placeholder ? placeholder : label}`}
                disabled={disabled}
                readOnly={readOnly}
                aria-invalid={!!errorMessage}
                aria-required={required}
                autoComplete={`email`}
                aria-label={label}
                aria-placeholder={`${placeholder ? placeholder : label}`}
                aria-autocomplete={`inline`}
                className={`bg-base-300`}
              />
            </div>
          );
        }}
      />
      {/* ERROR MESSAGE */}
      {errorMessage ? (
        <FieldError key={`${name}-field_error`} errorMessage={errorMessage} />
      ) : null}
    </div>
  );
}
