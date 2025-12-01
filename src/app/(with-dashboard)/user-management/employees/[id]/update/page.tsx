"use client";

import { use } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_EMPLOYEE_BY_ID } from "@/graphql/employee.api";
import CustomLoading from "@/components/loader/CustomLoading";
import { IEmployee } from "@/types";
import EmployeesForm from "../../EmployeesForm";
import { IEmployeeFormData } from "@/schemas";
import dayjs from "dayjs";

export default function UpdateEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Fetch employee data
  const { data: employeeData, loading: employeeLoading } = useQuery<{
    employeeById: { data: IEmployee };
  }>(GET_EMPLOYEE_BY_ID, {
    variables: { id: Number(id) },
  });

  if (employeeLoading) {
    return <CustomLoading />;
  }

  const data = employeeData?.employeeById?.data;

  const defaultValues: IEmployeeFormData = {
    id: Number(id),
    user: {
      email: data?.email || "",
      password: "",
      roleId: Number(data?.roleId) as number,
    },
    profile: {
      fullName: data?.profile?.fullName || "",
      dateOfBirth: data?.profile?.dateOfBirth
        ? dayjs(data?.profile?.dateOfBirth).format("YYYY-MM-DD")
        : "",
      gender: data?.profile?.gender || "",
      maritalStatus: data?.profile?.maritalStatus || "",
      phone: data?.profile?.phone || "",
      address: data?.profile?.address || "",
      city: data?.profile?.city || "",
      country: data?.profile?.country || "",
      postcode: data?.profile?.postcode || "",
      profilePicture: data?.profile?.profilePicture || "",
    },
    emergencyContact: {
      name: data?.profile?.emergencyContact?.name || "",
      phone: data?.profile?.emergencyContact?.phone || "",
      relation: data?.profile?.emergencyContact?.relation || "",
    },
    departmentId: data?.employee?.departmentId as number,
    designationId: data?.employee?.designationId as number,
    employmentStatusId: data?.employee?.employmentStatusId as number,
    workSiteId: data?.employee?.workSiteId as number,
    workScheduleId: data?.employee?.workScheduleId as number,
    joiningDate: data?.employee?.joiningDate
      ? dayjs(data?.employee?.joiningDate).format("YYYY-MM-DD")
      : "",
    employeeId: data?.employee?.employeeId || "",
    nidNumber: data?.employee?.nidNumber || "",
    salaryPerMonth: data?.employee?.salaryPerMonth as number,
    workingDaysPerWeek: data?.employee?.workingDaysPerWeek as number,
    workingHoursPerWeek: data?.employee?.workingHoursPerWeek as number,
    rotaType: data?.employee?.rotaType || "",
  };

  if (!data) {
    return (
      <div className="p-6">
        <p>Employee not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Update Employee</h1>
        <p className="text-gray-600">Update employee information below</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <EmployeesForm data={defaultValues} />
      </div>
    </div>
  );
}
