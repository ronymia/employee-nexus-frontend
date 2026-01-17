// components/WorkScheduleDetails.tsx
import FieldView from "@/components/form/FieldView";
import { IWorkSchedule } from "@/types";

interface WorkScheduleDetailsProps {
  workScheduleData: IWorkSchedule;
}

export default function WorkScheduleDetails({
  workScheduleData,
}: WorkScheduleDetailsProps) {
  return (
    <div className={`max-w-3xl mx-auto p-6 space-y-6`}>
      <div className={`bg-base-300 p-6 rounded-lg shadow`}>
        <h2 className="text-xl font-semibold mb-4">
          Work Schedule Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldView label="Name" value={workScheduleData?.name} />
          <FieldView
            label="Description"
            value={workScheduleData?.description}
          />
          <FieldView
            label="Schedule Type"
            value={workScheduleData?.scheduleType}
          />
          <FieldView label="Break Type" value={workScheduleData?.breakType} />
          <FieldView
            label="Break Hours"
            value={workScheduleData?.breakMinutes?.toString()}
          />
          <FieldView label="Status" value={workScheduleData?.status} />
          <FieldView
            label="Created At"
            value={new Date(workScheduleData?.createdAt).toLocaleDateString()}
          />
          <FieldView
            label="Updated At"
            value={new Date(workScheduleData?.updatedAt).toLocaleDateString()}
          />
        </div>
      </div>
    </div>
  );
}
