import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Controller, useFormContext } from "react-hook-form";
import FieldLabel from "./components/FieldLabel";

export interface IImageRadioOption {
  name: string;
  image: string;
}

export default function CustomImageRadioButton({
  dataAuto,
  name,
  label,
  labelClassName = "",
  wrapperClassName = "",
  required = false,
  options = [],
}: {
  dataAuto: string;
  name: string;
  label: string;
  wrapperClassName?: string;
  labelClassName?: string;
  required: boolean;
  options: IImageRadioOption[];
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <div
      data-auto={`${dataAuto}-container`}
      className={`${wrapperClassName ?? ""}`}
    >
      <FieldLabel
        dataAuto={dataAuto}
        htmlFor={name}
        label={label}
        required={required}
        labelClassName={labelClassName}
      />
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <div className="grid grid-cols-2 gap-4 mt-2">
            {options.map((cover, index) => (
              <button
                type="button"
                data-auto={`${dataAuto}-${cover?.name}`}
                onClick={() => onChange(cover?.name)}
                className={`w-full h-20 overflow-hidden rounded-lg group outline ${
                  value === cover?.name
                    ? "outline-primary"
                    : "outline-transparent"
                } relative`}
                key={index}
              >
                {value === cover?.name && (
                  <div className="absolute z-10 h-full w-full bg-black bg-opacity-50 flex justify-center items-center text-white font-bold">
                    Selected
                  </div>
                )}
                <img
                  className="object-cover h-full w-full group-hover:scale-110 transition-all duration-300 ease-in-out"
                  src={cover?.image}
                  alt={cover?.name}
                />
              </button>
            ))}
          </div>
        )}
      />
      {errorMessage && (
        <p
          className="text-red-500 text-sm mt-1"
          data-auto={`${dataAuto}-error`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
