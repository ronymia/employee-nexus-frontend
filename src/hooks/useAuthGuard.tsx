"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAppStore from "./useAppStore";

export default function useAuthGuard() {
  const router = useRouter();
  const { token, hydrated } = useAppStore((state) => state);

  const isAuthenticated = !!token;

  useEffect(() => {
    if (!hydrated) return; // wait for rehydration

    if (token) {
      router.prefetch("/dashboard"); // optional
    } else {
      router.replace("/auth/login");
    }
  }, [hydrated, token, router]);

  return { isAuthenticated, hydrated };
}
