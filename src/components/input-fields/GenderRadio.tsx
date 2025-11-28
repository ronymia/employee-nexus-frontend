import CustomRadioButton from "@/components/form/input/CustomRadioButton";

const GENDER_OPTIONS = [
  { title: "Male", value: "MALE" },
  { title: "Female", value: "FEMALE" },
];

interface GenderRadioProps {
  name: string;
  label?: string;
  required?: boolean;
  dataAuto?: string;
  radioGroupClassName?: string;
}

export default function GenderRadio({
  name,
  label = "Gender",
  required = false,
  dataAuto = "gender",
  radioGroupClassName = "grid-cols-3",
}: GenderRadioProps) {
  return (
    <CustomRadioButton
      dataAuto={dataAuto}
      name={name}
      label={label}
      required={required}
      options={GENDER_OPTIONS}
      radioGroupClassName={radioGroupClassName}
    />
  );
}
