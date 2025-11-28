"use client";

import { use } from "react";
import UserBusinessForm from "../../UserBusinessForm";

export default function BusinessUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  // console.log({ id });
  return <UserBusinessForm id={Number(id)} />;
}
