import { GET_LEAVE_TYPES } from "@/graphql/leave-types.api";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";

// ==================== INTERFACE ====================
interface ILeaveTypeSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
  disabled?: boolean;
}

// ==================== LEAVE TYPE SELECT COMPONENT ====================
export default function LeaveTypeSelect({
  name,
  label = "Leave Type",
  required = false,
  placeholder = "Select Leave Type",
  dataAuto = "leaveTypeId",
  disabled = false,
}: ILeaveTypeSelectProps) {
  // ==================== FETCH LEAVE TYPES ====================
  const { data, loading } = useQuery<{
    leaveTypes: { data: any[] };
  }>(GET_LEAVE_TYPES, {});

  // ==================== MAP TO OPTIONS ====================
  const options =
    data?.leaveTypes?.data?.map((type: any) => ({
      label: type.name,
      value: Number(type.id),
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
