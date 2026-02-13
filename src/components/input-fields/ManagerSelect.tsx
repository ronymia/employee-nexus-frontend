import CustomSelect from "../form/input/CustomSelect";
import { GET_MANAGERS } from "@/graphql/departments.api";
import { useQuery } from "@apollo/client/react";
import { IUserArrayResponse } from "@/types";

interface IManagerSelectProps {
  dataAuto?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  wrapperClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
  position?: "top" | "bottom";
}

export default function ManagerSelect({
  dataAuto = "managerId",
  name = "managerId",
  id,
  placeholder = "Select manager",
  label = "Manager",
  required = false,
  disabled = false,
  wrapperClassName = "",
  fieldClassName = "",
  labelClassName = "",
  position = "bottom",
}: IManagerSelectProps) {
  // GET USERS FOR MANAGER DROPDOWN
  const { data, loading } = useQuery<IUserArrayResponse>(GET_MANAGERS, {
    variables: {
      query: {
        role: `manager`,
      },
    },
  });

  // USERS OPTIONS FOR MANAGER DROPDOWN
  const managersOptions =
    data?.users?.data?.map((user) => ({
      label: user.profile?.fullName,
      value: Number(user.id),
    })) || [];

  return (
    <div className={`${wrapperClassName} w-full`}>
      <CustomSelect
        dataAuto={dataAuto}
        name={name}
        id={id}
        label={label}
        required={required}
        disabled={disabled}
        isLoading={loading}
        options={managersOptions}
        placeholder={placeholder}
        position={position}
        wrapperClassName={wrapperClassName}
        fieldClassName={fieldClassName}
        labelClassName={labelClassName}
        multipleSelect={false}
      />
    </div>
  );
}
