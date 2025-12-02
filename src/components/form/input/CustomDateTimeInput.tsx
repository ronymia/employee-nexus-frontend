import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Controller, useFormContext } from "react-hook-form";
import FieldLabel from "./components/FieldLabel";
import FieldError from "./components/FieldError";

interface ICustomDateTimeInputProps {
  dataAuto?: string;
  name: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  wrapperClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
}

export default function CustomDateTimeInput({
  dataAuto = "",
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
}: ICustomDateTimeInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <div className={`w-full ${wrapperClassName || ""}`}>
      {label && (
        <FieldLabel
          dataAuto={dataAuto || name}
          htmlFor={id || name}
          label={label}
          required={required}
          labelClassName={labelClassName}
        />
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <input
            {...field}
            id={id || name}
            type="datetime-local"
            data-auto={dataAuto || name}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className={`input input-bordered w-full ${
              errorMessage ? "input-error" : ""
            } ${fieldClassName || ""}`}
          />
        )}
      />
      {errorMessage && <FieldError errorMessage={errorMessage} />}
    </div>
  );
}
