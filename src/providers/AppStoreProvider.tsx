"use client";

import appStore from "@/stores/appStore";
import { createContext, ReactNode, useRef } from "react";

export const AppStoreContext = createContext<ReturnType<
  typeof appStore
> | null>(null);

export const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef(appStore);

  if (!storeRef.current) {
    storeRef.current = appStore;
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
};
