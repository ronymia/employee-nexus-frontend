"use client";

import useAppStore from "@/stores/appStore";
import OwnerDashboard from "./owner/OwnerDashboard";
import EmployeeDashboard from "./employee/EmployeeDashboard";

export default function DashboardContainer() {
  const { user } = useAppStore((state) => state);

  // Check user role - assuming role is stored in user object
  const isOwner =
    user?.role?.name?.toLowerCase().includes("owner") ||
    user?.role?.name?.toLowerCase().includes("admin");

  if (isOwner) {
    return <OwnerDashboard />;
  }

  // Show Employee Dashboard for employees
  return <EmployeeDashboard />;

  // Fallback dashboard for other roles (optional)
  // return (
  // <div className={`relative`}>
  //   <Image
  //     loading="eager"
  //     src={underConstructionImage}
  //     alt="Under Construction"
  //   />
  //   <h1 className={`absolute top-3 left-1/2 text-2xl font-medium`}>
  //     Under Construction
  //   </h1>
  // </div>
  // <OwnerDashboard />
  // );
}
