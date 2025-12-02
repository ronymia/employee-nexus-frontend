import { GET_PROJECTS } from "@/graphql/project.api";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";
import { IProject } from "@/types/project.type";

interface ProjectSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
}

export default function ProjectSelect({
  name,
  label = "Project",
  required = false,
  placeholder = "Select Project",
  dataAuto = "project",
}: ProjectSelectProps) {
  const { data, loading } = useQuery<{ projects: { data: IProject[] } }>(
    GET_PROJECTS,
    {}
  );

  const options =
    data?.projects?.data?.map((project: IProject) => ({
      label: project.name,
      value: Number(project.id),
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
