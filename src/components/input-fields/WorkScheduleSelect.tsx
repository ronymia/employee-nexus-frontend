import { GET_WORK_SCHEDULES } from "@/graphql/work-schedules.api";
import CustomSelect from "@/components/form/input/CustomSelect";
import { useQuery } from "@apollo/client/react";
import { IWorkSchedule } from "@/types/work-schedules.type";

interface WorkScheduleSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  dataAuto?: string;
}

export default function WorkScheduleSelect({
  name,
  label = "Work Schedule",
  required = false,
  placeholder = "Select Schedule",
  dataAuto = "workSchedule",
}: WorkScheduleSelectProps) {
  const { data, loading } = useQuery<{
    workSchedules: { data: IWorkSchedule[] };
  }>(GET_WORK_SCHEDULES, {});

  const options =
    data?.workSchedules?.data?.map((schedule: IWorkSchedule) => ({
      label: schedule.name,
      value: Number(schedule.id),
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
