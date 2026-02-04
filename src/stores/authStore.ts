import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Company } from '@/types/auth';

interface AuthState {
  user: User | null;
  company: Company | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setCompany: (company: Company | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, company: Company | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      company: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      setCompany: (company) =>
        set({ company }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      login: (user, company) =>
        set({
          user,
          company,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          company: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'aimana-auth',
      partialize: (state) => ({
        user: state.user,
        company: state.company,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
