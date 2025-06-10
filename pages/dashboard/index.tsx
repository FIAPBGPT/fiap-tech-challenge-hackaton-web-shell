"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { listarMetas } from "@/@core/services/firebase/pages/metasService";
import { listarProducoes } from "@/@core/services/firebase/pages/producoesService";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { listarSafras } from "@/@core/services/firebase/pages/safraService";

import ProdutoSelect from "@/@core/components/forms/produtos/ProdutoSelect";
import SafraSelect from "@/@core/components/forms/safras/SafraSelect";
import FazendaSelect from "@/@core/components/forms/fazendas/FazendaSelect";
import { listar } from "@/@core/services/firebase/firebaseService";
import { listarVendas } from "@/@core/services/firebase/pages/vendasService";

type ChartViewProps = {
  data?: any;
  tipo?: string;
  tipoMeta?: string;
  meta?: number;
  atingido?: number;
};

// @ts-ignore
const DashboardRemote = dynamic<ChartViewProps>(() => import("mfe/ChartView"), {
  ssr: false,
  loading: () => <p>Carregando gráfico...</p>,
});

interface Meta {
  id: string;
  produto: string;
  safra: string;
  fazenda?: string;
  valor: number;
  tipo: "producao" | "vendas";
}

interface Producao {
  id: string;
  produto: string;
  safra: string;
  fazenda: string;
  quantidade: number;
}

interface Venda {
  id: string;
  produto: string;
  safra: string;
  fazenda: string;
  quantidade: number;
}

export default function DashboardPage() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [safras, setSafras] = useState<any[]>([]);
  const [safraSelected, setSafraSelected] = useState<any>();
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [metaSelecionada, setMetaSelecionada] = useState<Meta | null>(null);
  const [atingido, setAtingido] = useState<number>(0);

  const [filtros, setFiltros] = useState({
    produto: "",
    safra: "",
    fazenda: "",
    tipo: "producao",
  });

  useEffect(() => {
    async function carregarDados() {
      const [metasRaw, producoesRaw, produtosRaw, safrasRaw, vendasRaw] =
        await Promise.all([
          listarMetas(),
          listarProducoes(),
          listarProdutos(),
          listarSafras(),
          listarVendas(),
        ]);

      const metasFormatadas: Meta[] = metasRaw.map((m: any) => ({
        id: m.id,
        produto: m.produto ?? "",
        safra: m.safra ?? "",
        fazenda: m.fazenda,
        valor: m.valor ?? 0,
        tipo: m.tipo ?? "producao",
      }));

      const producoesFormatadas: Producao[] = producoesRaw.map((p: any) => ({
        id: p.id,
        produto: p.produto ?? "",
        safra: p.safra ?? "",
        fazenda: p.fazenda ?? "",
        quantidade: p.quantidade ?? 0,
      }));

      const vendasFormatadas: Producao[] = vendasRaw.map((p: any) => ({
        id: p.id,
        produto: p.produto ?? "",
        safra: p.safra ?? "",
        fazenda: p.fazenda ?? "",
        quantidade: p.quantidade ?? 0,
      }));

      setMetas(metasFormatadas);
      setProducoes(producoesFormatadas);
      setProdutos(produtosRaw);
      setSafras(safrasRaw);
      setVendas(vendasFormatadas);
    }

    carregarDados();
  }, []);

  useEffect(() => {
    const { produto, safra, fazenda, tipo } = filtros;

    const safraSelected: any = safras.find((s: any) => s.id === safra);
    console.log("Safra selecionada:", safraSelected);
    setSafraSelected(safraSelected);

    if (!produto || !safra || !fazenda || !tipo) {
      setMetaSelecionada(null);
      setAtingido(0);
      return;
    }

    const meta = metas.find(
      (m) =>
        m.produto === produto &&
        m.safra === safra &&
        (m.fazenda ?? "") === fazenda &&
        m.tipo === tipo
    );
    console.log("Meta encontrada:", meta);
    setMetaSelecionada(meta ?? null);

    // Calcula o atingido de acordo com o tipo
    if (tipo === "producao") {
      console.log(producoes);
      const total = producoes
        .filter(
          (p) =>
            p.produto === produto && p.safra === safra && p.fazenda === fazenda
        )
        .reduce((acc, p) => acc + Number(p.quantidade || 0), 0);
      console.log("Total atingido:", total);
      console.log("Tipo:", meta && meta.tipo);

      setAtingido(total);
    } else if (tipo === "vendas") {
      const total = vendas
        .filter(
          (p) =>
            p.produto === produto && p.safra === safra && p.fazenda === fazenda
        )
        .reduce((acc, p) => acc + Number(p.quantidade || 0), 0);
      setAtingido(total);
    }
  }, [filtros, metas, producoes, vendas]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const getProdutoNome = (id: string) => {
    const produto = produtos.find((p) => p.id === id);
    return produto
      ? `${produto.nome}${produto.categoria ? ` (${produto.categoria})` : ""}`
      : id;
  };

  const formatarSafra = (safra: string) => {
    if (!safra) return "";
    if (safraSelected && safra === safraSelected.id) {
      return safraSelected.nome || safra;
    }
    const found = safras.find((s: any) => s.id === safra);
    return found?.nome || safra;
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <ProdutoSelect
          value={filtros.produto}
          onChange={handleFiltroChange}
          name="produto"
        />
        <SafraSelect
          value={filtros.safra}
          onChange={handleFiltroChange}
          name="safra"
        />
        <FazendaSelect
          value={filtros.fazenda}
          onChange={handleFiltroChange}
          name="fazenda"
        />
        <select name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
          <option value="producao">Produção</option>
          <option value="vendas">Vendas</option>
        </select>
      </div>

      {metaSelecionada ? (
        <>
          <p>
            Produto: {getProdutoNome(metaSelecionada.produto)} | Safra:{" "}
            {formatarSafra(metaSelecionada.safra)} | Meta:{" "}
            {metaSelecionada.valor} unidades | Tipo:{" "}
            {metaSelecionada.tipo === "producao" ? "Produção" : "Vendas"}
          </p>

          <DashboardRemote
            meta={metaSelecionada.valor}
            atingido={atingido}
            tipo={"metas"}
            tipoMeta={metaSelecionada.tipo}
          />
        </>
      ) : (
        <p style={{ color: "gray" }}>
          Selecione produto, safra, fazenda e tipo para visualizar a meta
        </p>
      )}
    </div>
  );
}
