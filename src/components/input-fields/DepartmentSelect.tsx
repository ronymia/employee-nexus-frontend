import { GET_DEPARTMENTS } from "@/graphql/departments.api";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";
import { IDepartment } from "@/types/departments.type";

interface DepartmentSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
  position?: "top" | "bottom";
}

export default function DepartmentSelect({
  name,
  label = "Department",
  required = false,
  placeholder = "Select Department",
  dataAuto = "department",
  position = "bottom",
}: DepartmentSelectProps) {
  const { data, loading } = useQuery<{ departments: { data: IDepartment[] } }>(
    GET_DEPARTMENTS,
    {}
  );

  const options =
    data?.departments?.data?.map((dept: IDepartment) => ({
      label: dept.name,
      value: Number(dept.id),
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
      position={position}
    />
  );
}
