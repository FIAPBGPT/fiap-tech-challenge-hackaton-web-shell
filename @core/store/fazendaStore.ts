import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Fazenda = {
      id: string;
  nome: string;
  estado: string;
  latitude?: number | null;
  longitude?: number | null;
};

type FazendaStore = {
  fazendas: Fazenda[];
  loading: boolean;
  addFazenda: (fazenda: Fazenda) => void;
  updateFazenda: (id: string, fazenda: Fazenda) => void;
  removeFazenda: (id: string) => void;
  setFazendas: (fazendas: Fazenda[]) => void;
  setLoading: (loading: boolean) => void;
};

export const useFazendaStore = create<FazendaStore>()(
  persist(
    (set) => ({
      fazendas: [],
      loading: false,
      addFazenda: (fazenda) => set((state) => ({ fazendas: [...state.fazendas, fazenda] })),
      updateFazenda: (id, fazenda) =>
        set((state) => ({
          fazendas: state.fazendas.map((f) => (f.id === id ? { ...f, ...fazenda } : f)),
        })),
      removeFazenda: (id) =>
        set((state) => ({
          fazendas: state.fazendas.filter((f) => f.id !== id),
        })),
      setFazendas: (fazendas) => set({ fazendas }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "fazenda-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
// This store manages the state of fazendas, allowing for addition, update, removal, and loading of fazendas.
