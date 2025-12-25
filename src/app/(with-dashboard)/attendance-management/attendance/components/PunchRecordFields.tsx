import { useFormContext } from "react-hook-form";
import { PiClock, PiTrash } from "react-icons/pi";
import CustomDateTimeInput from "@/components/form/input/CustomDateTimeInput";
import CustomTextareaField from "@/components/form/input/CustomTextareaField";
import EmployeeProjectSelect from "@/components/input-fields/EmployeeProjectSelect";
import EmployeeWorkSiteSelect from "@/components/input-fields/EmployeeWorkSiteSelect";
import dayjs from "dayjs";

// ==================== HELPER FUNCTIONS ====================

/**
 * Format work hours to  "Xh Ym" format
 */
function formatWorkHours(hours: number | undefined): string {
  if (!hours || hours === 0) return "0h 0m";

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h ${minutes}m`;
  }
}

/**
 * Calculate work hours from punch in/out (for display only)
 */
function calculateWorkHours(punchIn: string, punchOut: string): number {
  if (!punchIn || !punchOut) return 0;

  const totalMinutes = dayjs(punchOut).diff(dayjs(punchIn), "minute");
  return totalMinutes / 60;
}

// ==================== PUNCH RECORD FIELDS COMPONENT ====================
/**
 * Individual punch record form fields
 * Displays project, work site, punch times, notes, and calculated work hours
 *
 * @param index - Record index in array
 * @param onRemove - Callback to remove this record
 * @param canRemove - Whether this record can be removed
 */
interface IPunchRecordFieldsProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

export default function PunchRecordFields({
  index,
  onRemove,
  canRemove,
}: IPunchRecordFieldsProps) {
  const { watch } = useFormContext();

  // WATCH PUNCH TIMES FOR REAL-TIME CALCULATION
  const punchIn = watch(`punchRecords.${index}.punchIn`);
  const punchOut = watch(`punchRecords.${index}.punchOut`);
  const workHours = calculateWorkHours(punchIn, punchOut);

  return (
    <div className="border border-base-300 rounded-lg p-4 bg-base-200/30">
      {/* HEADER WITH REMOVE BUTTON */}
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-sm font-semibold text-base-content">
          Record #{index + 1}
        </h5>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="btn btn-sm btn-ghost btn-circle text-error"
          >
            <PiTrash size={16} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* PROJECT & WORK SITE SELECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmployeeProjectSelect
            name={`punchRecords.${index}.projectId`}
            required={false}
            query={{ userId: watch("userId") }}
          />
          <EmployeeWorkSiteSelect
            name={`punchRecords.${index}.workSiteId`}
            required={false}
            query={{ userId: watch("userId") }}
          />
        </div>

        {/* PUNCH IN/OUT TIMES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomDateTimeInput
            dataAuto={`punchRecords.${index}.punchIn`}
            name={`punchRecords.${index}.punchIn`}
            label="Punch In"
            placeholder="Select punch in time"
            required={true}
          />
          <CustomDateTimeInput
            dataAuto={`punchRecords.${index}.punchOut`}
            name={`punchRecords.${index}.punchOut`}
            label="Punch Out"
            placeholder="Select punch out time"
            required={false}
          />
        </div>

        {/* NOTES FIELD */}
        <CustomTextareaField
          dataAuto={`punchRecords.${index}.notes`}
          name={`punchRecords.${index}.notes`}
          label="Notes"
          placeholder="Add notes for this punch record..."
          required={false}
          rows={2}
        />

        {/* CALCULATED WORK HOURS DISPLAY */}
        {workHours > 0 && (
          <div className="bg-info/10 border border-info/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <PiClock size={16} className="text-info" />
              <div>
                <p className="text-xs text-base-content/60">
                  Calculated Work Hours
                </p>
                <p className="text-sm font-semibold text-info">
                  {formatWorkHours(workHours)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
