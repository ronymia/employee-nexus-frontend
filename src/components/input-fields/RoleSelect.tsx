import { GET_ROLES } from "@/graphql/role.api";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";
import { IRole } from "@/types/role.type";

interface IRoleSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
}

export default function RoleSelect({
  name,
  label = "Role",
  required = false,
  placeholder = "Select Role",
  dataAuto = "role",
}: IRoleSelectProps) {
  const { data, loading } = useQuery<{ roles: { data: IRole[] } }>(
    GET_ROLES,
    {}
  );

  const options =
    data?.roles?.data?.map((role: IRole) => {
      const roleName = role.name.split("#")[0];
      const formattedName =
        roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase();
      return {
        label: formattedName,
        value: Number(role.id),
      };
    }) || [];

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
