import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { ElementType } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { BiSolidCheckCircle } from "react-icons/bi";

export interface IRadioButtonOption {
  title: string;
  value: any;
  Icon?: ElementType;
}

export default function CustomRadioButton({
  dataAuto,
  name,
  label,
  labelClassName = "",
  inputFieldClassName = "",
  wrapperClassName = "",
  CheckCircleClassName = "",
  radioGroupClassName = "grid-cols-2",
  required = false,
  disabled = false,
  options = [],
}: {
  dataAuto: string;
  name: string;
  label: string;
  defaultChecked?: boolean;
  wrapperClassName?: string;
  CheckCircleClassName?: string;
  radioGroupClassName?: string;
  inputFieldClassName?: string;
  labelClassName?: string;
  required: boolean;
  disabled?: boolean;
  options: IRadioButtonOption[];
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const errorMessage = getErrorMessageByPropertyName(errors, name);
  return (
    <div
      data-auto={`${dataAuto}-container`}
      className={`${
        wrapperClassName ?? ""
      } flex flex-col justify-start gap-y-2`}
    >
      {/* LABEL */}
      {label && (
        <label
          htmlFor={`flex`}
          data-auto={`${dataAuto}_label`}
          className={`text-sm font-medium ${labelClassName}`}
        >
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <Controller
        control={control}
        name={`${name}`}
        rules={{
          required: {
            value: required,
            message: `${label} is required`,
          },
        }}
        render={({ field }) => {
          return (
            <div
              data-auto={`${dataAuto}_options`}
              className={`grid gap-x-2 ${radioGroupClassName}`}
            >
              {options?.map(({ title, value, Icon }, index) => (
                <div key={index} className={`w-full`}>
                  <input
                    data-auto={`${dataAuto}-${value}`}
                    type="radio"
                    id={`${name}${value}`}
                    name={name}
                    onClick={(e) => !disabled && field.onChange(e)}
                    value={value}
                    className={`hidden`}
                    defaultChecked={field.value === value}
                  />

                  <label
                    data-auto={`${dataAuto}_${title}`}
                    htmlFor={`${name}${value}`}
                    className={`${
                      field.value === value
                        ? "relative bg-primary border-primary font-bold text-base-300"
                        : "bg-base-200 border-base-200 text-gray-500 font-medium"
                    } justify-center sm:flex-col lg:flex-row gap-x-1 rounded-field border-2 px-5 input input-md flex items-center cursor-pointer checked:text-primary text-sm ${inputFieldClassName}`}
                  >
                    {field.value === value ? (
                      <BiSolidCheckCircle
                        className={`absolute bg-base-300 rounded-full -right-2 -top-2 text-2xl text-green-500 ${CheckCircleClassName}`}
                      />
                    ) : (
                      ""
                    )}
                    {Icon && <Icon className={`text-2xl`} />}{" "}
                    <span className={`text-sm`}>{title}</span>
                  </label>
                </div>
              ))}
            </div>
          );
        }}
      />
      {/* ERROR MESSAGE */}
      <small className={`text-error font-medium`}>{errorMessage}</small>
    </div>
  );
}
