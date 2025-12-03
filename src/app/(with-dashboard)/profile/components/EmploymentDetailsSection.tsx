"use client";

import dayjs from "dayjs";

interface EmploymentDetailsSectionProps {
  user: any;
  refetch: () => void;
}

export default function EmploymentDetailsSection({
  user,
}: EmploymentDetailsSectionProps) {
  const employee = user?.employee;

  if (!employee) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No employment details available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Employment Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem label="Employee ID" value={employee?.employeeId} />
        <InfoItem
          label="Joining Date"
          value={
            employee?.joiningDate
              ? dayjs(employee.joiningDate).format("DD MMM YYYY")
              : "N/A"
          }
        />
        <InfoItem label="Department" value={employee?.department?.name} />
        <InfoItem label="Designation" value={employee?.designation?.name} />
        <InfoItem
          label="Employment Status"
          value={employee?.employmentStatus?.name}
        />
        <InfoItem label="Work Site" value={employee?.workSite?.name} />
        <InfoItem label="Work Schedule" value={employee?.workSchedule?.name} />
        <InfoItem label="NID Number" value={employee?.nidNumber} />
        <InfoItem
          label="Working Days/Week"
          value={employee?.workingDaysPerWeek?.toString()}
        />
        <InfoItem
          label="Working Hours/Week"
          value={employee?.workingHoursPerWeek?.toString()}
        />
        <InfoItem label="Rota Type" value={employee?.rotaType} />
        <InfoItem
          label="Salary/Month"
          value={
            employee?.salaryPerMonth
              ? `$${employee.salaryPerMonth.toLocaleString()}`
              : "N/A"
          }
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Employment details can only be updated by HR or
          administrators. Please contact your HR department for any changes.
        </p>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-base font-medium text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}
