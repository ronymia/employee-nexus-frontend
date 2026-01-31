import CustomSelect from "@/components/form/input/CustomSelect";

interface IAssetStatusSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
}

export default function AssetStatusSelect({
  name,
  label = "Assignment Status",
  required = true,
  placeholder = "Select status",
  dataAuto = "status",
}: IAssetStatusSelectProps) {
  const options = [
    { label: "Assigned", value: "assigned" },
    { label: "Returned", value: "returned" },
    { label: "Damaged", value: "damaged" },
    { label: "Lost", value: "lost" },
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
