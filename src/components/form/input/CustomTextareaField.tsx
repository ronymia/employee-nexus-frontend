import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Controller, useFormContext } from "react-hook-form";
import FieldLabel from "./components/FieldLabel";

interface ICustomTextareaField {
  dataAuto?: string;
  id?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  label?: string;
  disabled?: boolean;
  wrapperClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
  rows?: number;
}

export default function CustomTextareaField({
  dataAuto,
  id,
  name,
  placeholder,
  required = true,
  label,
  disabled = false,
  wrapperClassName = "",
  fieldClassName = "",
  labelClassName = "",
  rows = 5,
}: ICustomTextareaField) {
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
          dataAuto={`${dataAuto}`}
          label={label}
          required={required}
          disabled={disabled}
          labelClassName={labelClassName}
        />
      ) : null}

      {/* INPUT FIELD */}
      <Controller
        rules={{
          required: { value: required, message: `${label} is required` },
        }}
        control={control}
        name={`${name}`}
        render={({ field }) => (
          <textarea
            {...field}
            data-auto={dataAuto}
            disabled={disabled}
            id={id ? id : name}
            value={field.value ?? ""}
            name={name}
            placeholder={`${placeholder ? placeholder : label}${
              required ? "*" : ""
            }`}
            rows={rows}
            className={`bg-base-300 field-sizing-fixed w-full p-2 rounded-field text-base border focus:outline-primary focus:ring-offset-2 focus:ring-1 focus:ring-primary ${fieldClassName} 
            ${errorMessage ? "border-error" : "border-[#d9d9d9]"}`}
          />
        )}
      />
      {/* ERROR MESSAGE */}
      <small className={`text-error font-medium`}>{errorMessage}</small>
    </div>
  );
}
