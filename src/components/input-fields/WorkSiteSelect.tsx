import { GET_WORK_SITES } from "@/graphql/work-sites.api";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";
import { IWorkSite } from "@/types/work-sites.type";

interface IWorkSiteSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
}

export default function WorkSiteSelect({
  name,
  label = "Work Sites",
  required = false,
  placeholder = "Select Work Site",
  dataAuto = "workSite",
}: IWorkSiteSelectProps) {
  const { data, loading } = useQuery<{ workSites: { data: IWorkSite[] } }>(
    GET_WORK_SITES,
    {}
  );

  const options =
    data?.workSites?.data?.map((site: IWorkSite) => ({
      label: site.name,
      value: Number(site.id),
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
      multipleSelect={true}
    />
  );
}
