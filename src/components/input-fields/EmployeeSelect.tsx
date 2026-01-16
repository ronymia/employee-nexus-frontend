import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";
import { IUser } from "@/types";
import { GET_USERS } from "@/graphql/user.api";

// ==================== INTERFACE ====================
interface IEmployeeSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
  disabled?: boolean;
}

// ==================== EMPLOYEE SELECT COMPONENT ====================
export default function EmployeeSelect({
  name,
  label = "Employee",
  required = false,
  placeholder = "Select Employee",
  dataAuto = "userId",
  disabled = false,
}: IEmployeeSelectProps) {
  // ==================== FETCH EMPLOYEES ====================
  const { data, loading } = useQuery<{
    users: { data: IUser[] };
  }>(GET_USERS, {});

  // ==================== MAP TO OPTIONS ====================
  const options =
    data?.users?.data?.map((emp) => ({
      label: emp.profile?.fullName || emp.email,
      value: Number(emp.id),
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
      disabled={disabled}
    />
  );
}
