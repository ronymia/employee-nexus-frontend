"use client";

import { useRouter } from "next/navigation";
import EmployeesForm from "../EmployeesForm";

export default function CreateEmployeePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Employee</h1>
        <p className="text-gray-600">Fill in the employee information below</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <EmployeesForm />
      </div>
    </div>
  );
}
