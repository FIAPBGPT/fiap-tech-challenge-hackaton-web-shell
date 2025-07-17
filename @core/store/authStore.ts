import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = { uid: string; email: string };

type AuthStore = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
};

import { StateCreator } from "zustand";

export const useAuthStore = create<AuthStore>()(
  persist(
    ((set): AuthStore => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
    })) as StateCreator<AuthStore, [], [["zustand/persist", unknown]]>,
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
