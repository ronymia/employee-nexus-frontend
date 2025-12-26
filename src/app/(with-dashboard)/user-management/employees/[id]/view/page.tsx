import { use } from "react";
import { Metadata } from "next";
import UserView from "@/components/ui/user/view/UserView";

export const metadata: Metadata = {
  title: "Employee View | Employee Nexus",
};

export default function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <UserView userId={Number(id)} />;
}
