// "use client";

// import { use } from "react";
// import { useQuery } from "@apollo/client/react";
// import { GET_EMPLOYEE_BY_ID } from "@/graphql/employee.api";
// import CustomLoading from "@/components/loader/CustomLoading";
// import { IUser } from "@/types";
// import EmployeesForm from "../../EmployeesForm";
// import { IEmployeeFormData } from "@/schemas";
// import dayjs from "dayjs";
// import EmployeeNotFound from "@/components/error/EmployeeNotFound";

// export default function UpdateEmployeePage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = use(params);

//   // Fetch employee data
//   const { data: employeeData, loading: employeeLoading } = useQuery<{
//     employeeById: { data: IUser };
//   }>(GET_EMPLOYEE_BY_ID, {
//     variables: { id: Number(id) },
//   });

//   if (employeeLoading) {
//     return <CustomLoading />;
//   }

//   const data = employeeData?.employeeById?.data;

//   const defaultValues: IEmployeeFormData = {
//     id: Number(id),
//     user: {
//       email: data?.email || "",
//       password: "",
//       roleId: Number(data?.roleId) as number,
//     },
//     profile: {
//       fullName: data?.profile?.fullName || "",
//       dateOfBirth: data?.profile?.dateOfBirth
//         ? dayjs(data?.profile?.dateOfBirth).format("DD-MM-YYYY")
//         : "",
//       gender: data?.profile?.gender || "",
//       maritalStatus: data?.profile?.maritalStatus || "",
//       phone: data?.profile?.phone || "",
//       address: data?.profile?.address || "",
//       city: data?.profile?.city || "",
//       country: data?.profile?.country || "",
//       postcode: data?.profile?.postcode || "",
//       profilePicture: data?.profile?.profilePicture || "",
//     },
//     emergencyContact: {
//       name: data?.profile?.emergencyContact?.name || "",
//       phone: data?.profile?.emergencyContact?.phone || "",
//       relation: data?.profile?.emergencyContact?.relation || "",
//     },
//     departmentId: data?.employee?.departmentId as number,
//     designationId: data?.employee?.designationId as number,
//     employmentStatusId: data?.employee?.employmentStatusId as number,
//     workSiteIds:
//       (data?.employee?.workSites?.map((site) =>
//         Number(site.workSite.id)
//       ) as number[]) || [],
//     workScheduleId: data?.employee?.workScheduleId as number,
//     joiningDate: data?.employee?.joiningDate
//       ? dayjs(data?.employee?.joiningDate).format("DD-MM-YYYY")
//       : "",
//     employeeId: data?.employee?.employeeId || "",
//     nidNumber: data?.employee?.nidNumber || "",
//     salaryPerMonth: data?.employee?.salaryPerMonth as number,
//     workingDaysPerWeek: data?.employee?.workingDaysPerWeek as number,
//     workingHoursPerWeek: data?.employee?.workingHoursPerWeek as number,
//     rotaType: data?.employee?.rotaType || "",
//   };

//   // EMPLOYEE NOT FOUND STATE
//   if (!data) {
//     return <EmployeeNotFound />;
//   }

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">Update Employee</h1>
//         <p className="text-gray-600">Update employee information below</p>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <EmployeesForm data={defaultValues} />
//       </div>
//     </div>
//   );
// }

export default function UpdateEmployeePage() {
  return <div>page</div>;
}
