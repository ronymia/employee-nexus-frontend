import { EmployeeSelect } from "@/components/input-fields";
import CustomDatePicker from "@/components/form/input/CustomDatePicker";

// ==================== BASIC INFO FIELDS COMPONENT ====================
/**
 * Renders employee and date selection fields
 * Employee field is disabled in update mode to prevent changes
 *
 * @param actionType - create or update mode
 */
interface IBasicInfoFieldsProps {
  actionType: "create" | "update";
}

export default function BasicInfoFields({ actionType }: IBasicInfoFieldsProps) {
  return (
    <div className="border border-primary/20 rounded-lg p-4">
      <h4 className="text-base font-semibold mb-3 text-primary">
        Basic Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EMPLOYEE SELECTION */}
        <EmployeeSelect
          dataAuto="userId"
          name="userId"
          label="Employee"
          placeholder="Select Employee"
          required={true}
          disabled={actionType === "update"}
        />

        {/* DATE SELECTION */}
        <CustomDatePicker
          dataAuto="date"
          name="date"
          label="Date"
          placeholder="Select Date"
          required={true}
          disabled={actionType === "update"}
          formatDate="DD-MM-YYYY"
        />
      </div>
    </div>
  );
}
