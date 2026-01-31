import { create } from "zustand";
import { authSlice, type IAuthSlice } from "./slices/authSlice";
import { persist } from "zustand/middleware";

type IAppState = IAuthSlice;

// Create the Zustand store with persistence

const appStore = create<IAppState>()(
  persist(
    (...a) => ({
      ...authSlice(...a),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
        modules: state.modules,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // ✅ trigger re-render properly
          state.setHydrated(true);
        }
      },
    },
  ),
);

export default appStore;
