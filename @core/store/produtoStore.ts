import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Produto = {
  id: string;
  nome: string;
  categoria?: string;
  preco?: number;
};

type ProdutoStore = {
  produtos: Produto[];
  loading: boolean;
  addProduto: (produto: Produto) => void;
  updateProduto: (id: string, produto: Produto) => void;
  removeProduto: (id: string) => void;
  setProdutos: (produtos: Produto[]) => void;
  setLoading: (loading: boolean) => void;
};

export const useProdutoStore = create<ProdutoStore>()(
  persist(
    (set) => ({
      produtos: [],
      loading: false,
      addProduto: (produto) => set((state) => ({ produtos: [...state.produtos, produto] })),
      updateProduto: (id, produto) =>
        set((state) => ({
          produtos: state.produtos.map((p) => (p.id === id ? { ...p, ...produto } : p)),
        })),
      removeProduto: (id) =>
        set((state) => ({
          produtos: state.produtos.filter((p) => p.id !== id),
        })),
      setProdutos: (produtos) => set({ produtos }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "produto-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
// This store manages the state of produtos, allowing for addition, update, removal, and loading of produtos.
