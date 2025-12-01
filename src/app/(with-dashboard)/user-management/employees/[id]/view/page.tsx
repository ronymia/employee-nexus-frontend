import { use } from "react";
import UserProfile from "@/components/ui/user/profile/UserProfile";

export default function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <UserProfile userId={Number(id)} />;
}
