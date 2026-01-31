import { GET_ACTIVE_EMPLOYEE_WORK_SITES } from "@/graphql/employee-work-site.api";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";
import { IEmployeeWorkSite } from "@/types/employee-work-site.type";

interface IWorkSiteSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
  query: {
    userId: number;
  };
}

export default function EmployeeWorkSiteSelect({
  name,
  label = "Work Site",
  required = false,
  placeholder = "Select Work Site",
  dataAuto = "workSite",
  query,
}: IWorkSiteSelectProps) {
  const { data, loading } = useQuery<{
    getActiveWorkSites: {
      data: IEmployeeWorkSite[];
    };
  }>(GET_ACTIVE_EMPLOYEE_WORK_SITES, {
    variables: {
      userId: Number(query?.userId),
    },
    skip: !query?.userId,
  });

  const options =
    data?.getActiveWorkSites?.data?.map((site: IEmployeeWorkSite) => ({
      label: site.workSite.name,
      value: Number(site.workSiteId),
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
