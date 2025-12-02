import { use } from "react";
import UserProfile from "@/components/ui/user/profile/UserProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employee View | Employee Nexus",
};

export default function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <UserProfile userId={Number(id)} />;
}
