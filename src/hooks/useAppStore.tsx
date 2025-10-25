"use client";

import { AppStoreContext } from "@/providers/AppStoreProvider";
import { IAuthSlice } from "@/stores/slices/authSlice";
import { useContext } from "react";
import { useStore } from "zustand";

const useAppStore = <T,>(selector: (state: IAuthSlice) => T): T => {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppContext must be used within AppStoreProvider");
  }

  return useStore(store as any, selector as any);
};

export default useAppStore;
