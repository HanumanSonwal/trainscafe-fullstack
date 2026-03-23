import { create } from "zustand";
import { User } from "@/types/user.types";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      loading: false,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    }),
}));