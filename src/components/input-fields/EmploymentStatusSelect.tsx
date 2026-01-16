import { GET_EMPLOYMENT_STATUSES } from "@/graphql/employment-status.api";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";
import { IEmploymentStatus } from "@/types/employment-status.type";

interface IEmploymentStatusSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
}

export default function EmploymentStatusSelect({
  name,
  label = "Employment Status",
  required = false,
  placeholder = "Select Status",
  dataAuto = "employmentStatus",
}: IEmploymentStatusSelectProps) {
  const { data, loading } = useQuery<{
    employmentStatuses: { data: IEmploymentStatus[] };
  }>(GET_EMPLOYMENT_STATUSES, {});

  const options =
    data?.employmentStatuses?.data?.map((status: IEmploymentStatus) => ({
      label: status.name,
      value: Number(status.id),
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
