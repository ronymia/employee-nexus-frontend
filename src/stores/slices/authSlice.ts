import { type StateCreator } from "zustand";

interface IState {
  user: any;
  permissions: string[];
  modules: string[];
  token: string;
}

interface IActions {
  setUser: (user: any) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setPermissions: (permissions: string[]) => void;
  setModules: (modules: string[]) => void;
}

export type IAuthSlice = IState & IActions;

export const authSlice: StateCreator<IAuthSlice> = (set) => ({
  user: null,
  permissions: [],
  modules: [],
  token: "",
  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),
  setModules: (modules) => set({ modules }),
  setToken: (token) => set({ token }),
  logout: () =>
    set({
      user: null,
      token: "",
      permissions: [],
      modules: [],
    }),
});
