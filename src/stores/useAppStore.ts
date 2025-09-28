import { create } from "zustand";
import { authSlice, type IAuthSlice } from "./slices/authSlice";
import { persist } from "zustand/middleware";

const useAppStore = create<IAuthSlice>()(
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
    }
  )
);

export default useAppStore;
