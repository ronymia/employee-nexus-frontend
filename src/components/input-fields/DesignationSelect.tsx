import { GET_DESIGNATIONS } from "@/graphql/designation.api";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";
import { IDesignation } from "@/types/designation.type";

interface IDesignationSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
}

export default function DesignationSelect({
  name,
  label = "Designation",
  required = false,
  placeholder = "Select Designation",
  dataAuto = "designation",
}: IDesignationSelectProps) {
  const { data, loading } = useQuery<{
    designations: { data: IDesignation[] };
  }>(GET_DESIGNATIONS, {});

  const options =
    data?.designations?.data?.map((des: IDesignation) => ({
      label: des.name,
      value: Number(des.id),
    })) || [];

  return (
    <CustomSelect
      name={name}
      label={label}
      options={options}
      placeholder={placeholder}
      dataAuto={dataAuto}
      required={required}
      isLoading={loading}
    />
  );
}
