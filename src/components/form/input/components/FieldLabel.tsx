"use client";

export default function FieldLabel({
  dataAuto,
  htmlFor = "",
  label,
  required = true,
  disabled = false,
  labelClassName = "",
}: {
  dataAuto: string;
  htmlFor: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  labelClassName?: string;
}) {
  return (
    <label
      data-auto={`label-${dataAuto}`}
      htmlFor={htmlFor}
      className="text-sm "
    >
      <span className={`font-semibold ${labelClassName}`}>
        {label}{" "}
        {label && required && !disabled && (
          <span className="text-error font-bold text-md">*</span>
        )}
      </span>
    </label>
  );
}
