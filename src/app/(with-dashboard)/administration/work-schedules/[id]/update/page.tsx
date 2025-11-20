import WorkScheduleForm from "../../WorkScheduleForm";
import { use } from "react";

export default function UpdateWorkSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <WorkScheduleForm id={Number(id)} />;
}
