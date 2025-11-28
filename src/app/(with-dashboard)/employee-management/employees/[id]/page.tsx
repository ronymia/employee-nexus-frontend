"use client";

import { use } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_EMPLOYEE_BY_ID } from "@/graphql/employee.api";
import CustomLoading from "@/components/loader/CustomLoading";
import { IEmployee } from "@/types";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/button/CustomButton";

export default function ViewEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data, loading } = useQuery<{
    employeeById: { data: IEmployee };
  }>(GET_EMPLOYEE_BY_ID, {
    variables: { id: Number(id) },
  });

  if (loading) {
    return <CustomLoading />;
  }

  const employee = data?.employeeById?.data;

  if (!employee) {
    return (
      <div className="p-6">
        <p>Employee not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {employee.profile?.fullName || "Employee Details"}
          </h1>
          <p className="text-gray-600">View employee information</p>
        </div>
        <div className="flex gap-2">
          <CustomButton
            variant="secondary"
            clickHandler={() => router.back()}
            className="px-4 py-2"
          >
            Back
          </CustomButton>
          <CustomButton
            variant="primary"
            clickHandler={() =>
              router.push(`/employee-management/employees/${id}/update`)
            }
            className="px-4 py-2"
          >
            Edit
          </CustomButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* User Account Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            User Account
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="font-medium">{employee.email || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Role</label>
              <p className="font-medium">{employee.role?.name || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <p className="font-medium">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    employee.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {employee.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <p className="font-medium">{employee.profile?.fullName || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <p className="font-medium">{employee.profile?.phone || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Date of Birth</label>
              <p className="font-medium">
                {employee.profile?.dateOfBirth
                  ? new Date(employee.profile.dateOfBirth).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <p className="font-medium">{employee.profile?.gender || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Marital Status</label>
              <p className="font-medium">
                {employee.profile?.maritalStatus || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="text-sm text-gray-600">Address</label>
              <p className="font-medium">{employee.profile?.address || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">City</label>
              <p className="font-medium">{employee.profile?.city || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Country</label>
              <p className="font-medium">{employee.profile?.country || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Postcode</label>
              <p className="font-medium">{employee.profile?.postcode || "-"}</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Emergency Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">Contact Name</label>
              <p className="font-medium">
                {employee.profile?.emergencyContact?.name || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Contact Phone</label>
              <p className="font-medium">
                {employee.profile?.emergencyContact?.phone || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Relation</label>
              <p className="font-medium">
                {employee.profile?.emergencyContact?.relation || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Employment Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Employment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">Employee ID</label>
              <p className="font-medium">
                {employee.employee?.employeeId || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Department</label>
              <p className="font-medium">
                {employee.employee?.department?.name || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Designation</label>
              <p className="font-medium">
                {employee.employee?.designation?.name || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Employment Status</label>
              <p className="font-medium">
                {employee.employee?.employmentStatus?.name || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Work Site</label>
              <p className="font-medium">
                {employee.employee?.workSite?.name || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Work Schedule</label>
              <p className="font-medium">
                {employee.employee?.workSchedule?.name || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Joining Date</label>
              <p className="font-medium">
                {employee.employee?.joiningDate
                  ? new Date(employee.employee.joiningDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">NID Number</label>
              <p className="font-medium">
                {employee.employee?.nidNumber || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Salary (Monthly)</label>
              <p className="font-medium">
                {employee.employee?.salaryPerMonth || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">
                Working Days per Week
              </label>
              <p className="font-medium">
                {employee.employee?.workingDaysPerWeek || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">
                Working Hours per Week
              </label>
              <p className="font-medium">
                {employee.employee?.workingHoursPerWeek || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Rota Type</label>
              <p className="font-medium">
                {employee.employee?.rotaType || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
