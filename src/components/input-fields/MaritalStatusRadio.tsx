import CustomRadioButton from "@/components/form/input/CustomRadioButton";

const MARITAL_STATUS_OPTIONS = [
  { title: "Single", value: "SINGLE" },
  { title: "Married", value: "MARRIED" },
];

interface MaritalStatusRadioProps {
  name: string;
  label?: string;
  required?: boolean;
  dataAuto?: string;
  radioGroupClassName?: string;
}

export default function MaritalStatusRadio({
  name,
  label = "Marital Status",
  required = false,
  dataAuto = "maritalStatus",
  radioGroupClassName = "grid-cols-2",
}: MaritalStatusRadioProps) {
  return (
    <CustomRadioButton
      dataAuto={dataAuto}
      name={name}
      label={label}
      required={required}
      options={MARITAL_STATUS_OPTIONS}
      radioGroupClassName={radioGroupClassName}
    />
  );
}
