'use client';

import { useEffect, useState } from "react";
import { listarEstoque } from "@/@core/services/firebase/pages/estoqueService";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { listarSafras } from "@/@core/services/firebase/pages/safraService";
import FazendaSelect from "../fazendas/FazendaSelect";

interface EstoqueItem {
  id: string;
  produtoId: string;
  safraId?: string | null;
  fazendaId?: string | null;
  quantidade: number;
  tipo: "entrada" | "saida";
  observacao?: string;
}

interface ItemLista {
  id: string;
  nome: string;
}

function getNomePorId(id: string | null | undefined, lista: ItemLista[]) {
  if (!id) return "";
  const item = lista.find((i) => i.id === id);
  return item ? item.nome : id;
}

export default function EstoqueList() {
  const [estoques, setEstoques] = useState<EstoqueItem[]>([]);
  const [produtos, setProdutos] = useState<ItemLista[]>([]);
  const [safras, setSafras] = useState<ItemLista[]>([]);
  const [showSaldo, setShowSaldo] = useState(false);

  // Estados dos filtros
  const [filtroProduto, setFiltroProduto] = useState("");
  const [filtroSafra, setFiltroSafra] = useState("");
  const [filtroFazenda, setFiltroFazenda] = useState("");

  const carregar = async () => {
    try {
      const [e, p, s] = await Promise.all([
        listarEstoque(),
        listarProdutos(),
        listarSafras(),
      ]);
      setEstoques(
        e.map((item: any) => ({
          id: item.id,
          produtoId: item.produtoId ?? "",
          safraId: item.safraId ?? null,
          fazendaId: item.fazendaId ?? null,
          quantidade: item.quantidade ?? 0,
          tipo: item.tipo ?? "entrada",
          observacao: item.observacao ?? "",
        }))
      );
      setProdutos(
        p.map((item: any) => ({
          id: item.id,
          nome: item.nome ?? "",
        }))
      );
      setSafras(
        s.map((item: any) => ({
          id: item.id,
          nome: item.nome ?? "",
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
      alert("Erro ao carregar os dados.");
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  // Filtra os registros
  const estoquesFiltrados = estoques.filter((e) => {
    return (
      (filtroProduto === "" || e.produtoId === filtroProduto) &&
      (filtroSafra === "" || e.safraId === filtroSafra) &&
      (filtroFazenda === "" || e.fazendaId === filtroFazenda)
    );
  });

  // Calcula saldo apenas se algum filtro estiver ativo
  const saldoFiltrado =
    filtroProduto || filtroSafra || filtroFazenda
      ? estoquesFiltrados.reduce((saldo, item) => {
          const qtd = Number(item.quantidade) || 0;
          return saldo + (item.tipo === "entrada" ? qtd : -qtd);
        }, 0)
      : 0;

  // Atualiza a exibição do saldo conforme filtros
  useEffect(() => {
    setShowSaldo(!!(filtroProduto || filtroSafra || filtroFazenda));
  }, [filtroProduto, filtroSafra, filtroFazenda]);

  const limparFiltros = () => {
    setFiltroProduto("");
    setFiltroSafra("");
    setFiltroFazenda("");
  };

  return (
    <div>
      <h3>Controle de Estoque</h3>

      {/* Filtros */}
      <div className="flex gap-4 mb-4">
        <select
          value={filtroProduto}
          onChange={(e) => setFiltroProduto(e.target.value)}
          aria-label="Filtrar por produto"
        >
          <option value="">Todos os produtos</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <select
          value={filtroSafra}
          onChange={(e) => setFiltroSafra(e.target.value)}
          aria-label="Filtrar por safra"
        >
          <option value="">Todas as safras</option>
          {safras.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </select>

        <FazendaSelect
          value={filtroFazenda}
          onChange={(e) => setFiltroFazenda(e.target.value)}
          name="fazenda"
        />

        <button
          onClick={limparFiltros}
          className="btn btn-secondary"
          type="button"
          aria-label="Limpar filtros"
        >
          Limpar Filtros
        </button>
      </div>

      {showSaldo && (
        <p
          style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: 10 }}
          aria-live="polite"
        >
          Saldo Atual (filtrado): {saldoFiltrado}
        </p>
      )}

      <ul className="space-y-2 mt-4">
        {estoquesFiltrados.map((e) => (
          <li
            key={e.id}
            className="border p-2 rounded-md bg-white flex justify-between items-center"
          >
            <div>
              <strong>{getNomePorId(e.produtoId, produtos)}</strong>
              {e.safraId && <> - Safra: {getNomePorId(e.safraId, safras)}</>}
              <br />
              Tipo: {e.tipo} | Quantidade: {e.quantidade}
              {e.observacao && (
                <>
                  <br />
                  Obs: {e.observacao}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
