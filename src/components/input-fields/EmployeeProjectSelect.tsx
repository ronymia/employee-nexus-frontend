import { GET_USER_PROJECTS } from "@/graphql/project.api";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";
import { IUserProjectMember } from "@/types/project.type";

interface IProjectSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
  query: {
    userId: number;
  };
}

export default function EmployeeProjectSelect({
  name,
  label = "Project",
  required = false,
  placeholder = "Select Project",
  dataAuto = "project",
  query,
}: IProjectSelectProps) {
  // Query to get user projects
  const { data, loading } = useQuery<{
    userProjects: {
      data: IUserProjectMember[];
    };
  }>(GET_USER_PROJECTS, {
    variables: { userId: Number(query?.userId) },
    skip: !query?.userId,
  });

  const options =
    data?.userProjects?.data?.map((project: IUserProjectMember) => ({
      label: project.project.name,
      value: Number(project.project.id),
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
