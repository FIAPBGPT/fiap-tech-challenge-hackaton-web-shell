import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Safra = {
  id: string;
  nome: string;
  valor: string;
};

type SafraStore = {
  safras: Safra[];
  loading: boolean;
  addSafra: (safra: Safra) => void;
  updateSafra: (id: string, safra: Safra) => void;
  removeSafra: (id: string) => void;
  setSafras: (safras: Safra[]) => void;
  setLoading: (loading: boolean) => void;
};

export const useSafraStore = create<SafraStore>()(
  persist(
    (set) => ({
      safras: [],
      loading: false,
      addSafra: (safra) => set((state) => ({ safras: [...state.safras, safra] })),
      updateSafra: (id, safra) =>
        set((state) => ({
          safras: state.safras.map((s) => (s.id === id ? { ...s, ...safra } : s)),
        })),
      removeSafra: (id) =>
        set((state) => ({
          safras: state.safras.filter((s) => s.id !== id),
        })),
      setSafras: (safras) => set({ safras }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "safra-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
// This store manages the state of safras, allowing for addition, update, removal, and loading of safras.
