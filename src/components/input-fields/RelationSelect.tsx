import CustomSelect from "@/components/form/input/CustomSelect";

interface IRelationSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
}

export default function RelationSelect({
  name,
  label = "Relation",
  required = false,
  placeholder = "Select Relation",
  dataAuto = "relation",
}: IRelationSelectProps) {
  const options = [
    { label: "Father", value: "Father" },
    { label: "Mother", value: "Mother" },
    { label: "Spouse", value: "Spouse" },
    { label: "Brother", value: "Brother" },
    { label: "Sister", value: "Sister" },
    { label: "Son", value: "Son" },
    { label: "Daughter", value: "Daughter" },
    { label: "Guardian", value: "Guardian" },
    { label: "Friend", value: "Friend" },
    { label: "Other", value: "Other" },
  ];

  return (
    <CustomSelect
      name={name}
      label={label}
      options={options}
      placeholder={placeholder}
      dataAuto={dataAuto}
      required={required}
      isLoading={false}
    />
  );
}
