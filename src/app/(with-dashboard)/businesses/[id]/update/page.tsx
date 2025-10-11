"use client";

import { use } from "react";
import BusinessForm from "../../BusinessForm";

export default function BusinessUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  console.log({ id });
  return <BusinessForm id={Number(id)} />;
}
