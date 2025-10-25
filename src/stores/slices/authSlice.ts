import { type StateCreator } from "zustand";

interface IState {
  user: any;
  permissions: string[];
  modules: string[];
  token: string;
  hydrated: boolean;
}

interface IActions {
  setUser: (user: any) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setPermissions: (permissions: string[]) => void;
  setModules: (modules: string[]) => void;
  setHydrated: (hydrated: boolean) => void;
}

export type IAuthSlice = IState & IActions;

export const authSlice: StateCreator<IAuthSlice> = (set) => ({
  user: null,
  permissions: [],
  modules: [],
  token: "",
  hydrated: false,

  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),
  setModules: (modules) => set({ modules }),
  setToken: (token) => set({ token }),
  setHydrated: (hydrated) => set({ hydrated }),

  // Logout action
  logout: () =>
    set({
      user: null,
      token: "",
      permissions: [],
      modules: [],
      hydrated: true,
    }),
});
