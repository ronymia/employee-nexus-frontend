"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAppStore from "@/stores/useAppStore";

export default function useAuthGuard() {
  const router = useRouter();
  const { user, token } = useAppStore();

  const isAuthenticated = !!(user && token);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated };
}
