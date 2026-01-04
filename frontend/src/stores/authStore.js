import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      userId: null,
      username: null,
      email: null,
      isAuthenticated: false,
      hasHydrated: false,

      setAuth: ({ userId, username, email }) =>
        set({
          userId,
          username,
          email,
          isAuthenticated: true,
          hasHydrated: true, 
        }),

      logout: () =>
        set({
          userId: null,
          username: null,
          email: null,
          isAuthenticated: false,
          hasHydrated: true,
        }),

      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "auth-state",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        userId: state.userId,
        username: state.username,
        email: state.email,
        isAuthenticated: state.isAuthenticated,
        hasHydrated: state.hasHydrated
      }),

      onRehydrateStorage: () => (state) => {
        return state?.setHydrated();
        // state?.hasHydrated === false && set({ hasHydrated: true });
      },
    }
  )
);

export default useAuthStore;
