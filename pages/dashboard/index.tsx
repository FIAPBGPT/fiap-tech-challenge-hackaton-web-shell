'use client';
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Card,
  CardContent,
  CardHeader,
  CardsGrid,
  Select,
  Subtitle,
  Title,
} from "@/@theme/custom/DashboardStyle";
import { listarMetas } from "@/@core/services/firebase/pages/metasService";
import { listarProducoes } from "@/@core/services/firebase/pages/producoesService";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { listarFazendas } from "@/@core/services/firebase/pages/fazendasService";
import { listarVendas } from "@/@core/services/firebase/pages/vendasService";
import { listarSafras } from "@/@core/services/firebase/pages/safraService";

// Tipos
interface Meta {
  id: string;
  produto: string;
  safra: string;
  fazenda?: string;
  valor: number;
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
  valor: number;
  data: string;
}

interface Fazenda {
  id: string;
  nome: string;
  estado: string;
  latitude: number;
  longitude: number;
}

// Componentes estilizados
// const Header = styled.header`
//   background-color: #97133E;
//   padding: 1.5rem;
//   color: white;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// `;

const Main = styled.main`
  // min-height: calc(100vh - 80px);
  // background: linear-gradient(to bottom, #F2EDDD, #E2C772);
  // padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

type DashboardRemoteProps =
  | { tipo: "mapa"; data: { estado: string; meta: number }[] }
  | { tipo: "lucro"; data: { produto: string; valor: number }[] }
  | {
      tipo: "metas";
      data: { produto: string; meta: number; producao: number }[];
    }
  | {
      tipo: "producao";
      data: { safra: string; produto: string; producao: number }[];
    };

const DashboardRemote = dynamic<DashboardRemoteProps>(
  // @ts-ignore
  () => import("mfe/ChartView"),
  {
    ssr: false,
    loading: () => <p>Carregando gráfico...</p>,
  }
);

export default function DashboardPage() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [fazendaSelecionada, setFazendaSelecionada] = useState<Fazenda | null>(
    null
  );
  const [atingido, setAtingido] = useState(0);
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [safras, setSafras] = useState<any[]>([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const [
          metas,
          producoesRaw,
          produtosRaw,
          fazendasData,
          vendasData,
          safra,
        ] = await Promise.all([
          listarMetas(),
          listarProducoes(),
          listarProdutos(),
          listarFazendas(),
          listarVendas(),
          listarSafras(),
        ]);

        setVendas(
          vendasData.map((v: any) => ({
            id: v.id,
            produto: v.produto ?? "",
            valor: v.valor ?? 0,
            data: v.data ?? "",
          }))
        );
        setMetas(
          metas.map((m: any) => ({
            id: m.id,
            produto: m.produto ?? "",
            safra: m.safra ?? "",
            fazenda: m.fazenda ?? "",
            valor: m.valor ?? 0,
          }))
        );
        setProdutos(produtosRaw);
        const fazendasMapped = fazendasData.map((f: any) => ({
          id: f.id,
          nome: f.nome ?? "",
          estado: f.estado ?? "",
          latitude: f.latitude ?? 0,
          longitude: f.longitude ?? 0,
        }));
        setFazendas(fazendasMapped);
        setSafras(safra);

        const producoes: Producao[] = producoesRaw.map((p: any) => ({
          id: p.id,
          produto: p.produto ?? "",
          safra: p.safra ?? "",
          fazenda: p.fazenda ?? "",
          quantidade: p.quantidade ?? 0,
        }));
        setProducoes(producoes);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  useEffect(() => {
    if (!fazendaSelecionada) return;

    const totalProduzido = producoes
      .filter((p) => p.fazenda === fazendaSelecionada.nome)
      .reduce((acc, p) => acc + p.quantidade, 0);

    setAtingido(totalProduzido);
  }, [fazendaSelecionada, producoes]);

  const getProdutoNome = (id: string) => {
    const produto = produtos.find((p) => p.id === id);
    return produto
      ? `${produto.nome}${produto.categoria ? ` (${produto.categoria})` : ""}`
      : id;
  };

  const calcularSomaMetaPorEstado = () => {
    const estadoMap = new Map<string, number>();

    metas.forEach((meta) => {
      if (fazendaSelecionada && meta.fazenda !== fazendaSelecionada.nome)
        return;

      const fazenda = fazendas.find((f) => f.nome === meta.fazenda);
      if (!fazenda?.estado) return;

      const estado = fazenda.estado;
      const valorAtual = estadoMap.get(estado) || 0;
      estadoMap.set(estado, valorAtual + meta.valor);
    });

    return Array.from(estadoMap.entries()).map(([estado, soma]) => ({
      estado: `BR-${estado}`,
      meta: soma,
    }));
  };

  const getVendasPorProduto = () => {
    if (!vendas || vendas.length === 0) {
      return [];
    }

    // Filtrar vendas pela fazenda selecionada (se houver)
    const vendasFiltradas = fazendaSelecionada
      ? vendas.filter((v) => {
          const producao = producoes.find(
            (p) =>
              p.produto === v.produto && p.fazenda === fazendaSelecionada.nome
          );
          return producao !== undefined;
        })
      : vendas;

    const vendasAgrupadas = vendasFiltradas.reduce((acc, venda) => {
      const nomeProduto = getProdutoNome(venda.produto);
      acc[nomeProduto] = (acc[nomeProduto] || 0) + venda.valor;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(vendasAgrupadas).map(([produto, valor]) => ({
      produto,
      valor,
    }));
  };

  const getMetaPorProduto = () => {
    // Filtra metas e produções conforme seleção
    const metasFiltradas = fazendaSelecionada
      ? metas.filter((m) => m.fazenda === fazendaSelecionada.nome)
      : metas;

    // Pré-filtra produções para melhor performance
    const producoesFiltradas = fazendaSelecionada
      ? producoes.filter((p) => p.fazenda === fazendaSelecionada.nome)
      : producoes;

    // Agrupa usando reduce
    const resultado = metasFiltradas.reduce((acc, meta) => {
      const produto = getProdutoNome(meta.produto);
      const producao = producoesFiltradas
        .filter((p) => p.produto === meta.produto && p.safra === meta.safra)
        .reduce((sum, p) => sum + p.quantidade, 0);

      if (!acc[produto]) {
        acc[produto] = { meta: 0, producao: 0 };
      }

      acc[produto].meta += meta.valor;
      acc[produto].producao += producao;

      return acc;
    }, {} as Record<string, { meta: number; producao: number }>);

    // Converte para array no formato esperado
    return Object.entries(resultado).map(([produto, { meta, producao }]) => ({
      produto,
      meta,
      producao,
    }));
  };

  const getSafraNome = () => {
    const producoesFiltradas = fazendaSelecionada
      ? producoes.filter((p) => p.fazenda === fazendaSelecionada.nome)
      : producoes;

    if (producoesFiltradas.length === 0) {
      return [{ safra: "Nenhuma produção", produto: "N/A", producao: 0 }];
    }

    const agrupado = producoesFiltradas.reduce((acc, p) => {
      const safra = safras.find((s) => s.id === p.safra)?.nome || p.safra;
      const produto =
        produtos.find((pr) => pr.id === p.produto)?.nome || p.produto;

      if (!acc[safra]) acc[safra] = {};
      acc[safra][produto] = (acc[safra][produto] || 0) + p.quantidade;

      return acc;
    }, {} as Record<string, Record<string, number>>);

    return Object.entries(agrupado).flatMap(([safra, produtos]) =>
      Object.entries(produtos).map(([produto, producao]) => ({
        safra,
        produto,
        producao,
      }))
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(to bottom, #F2EDDD, #E2C772)",
        }}
      >
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <Container>
      <Title>Suas Dashboards</Title>
      <Subtitle>Escolha qual quer visualizar</Subtitle>
      <Select
        value={fazendaSelecionada?.id || ""}
        onChange={(e) => {
          const fazenda = fazendas.find((f) => f.id === e.target.value);
          setFazendaSelecionada(fazenda || null);
        }}
      >
        <option value="">Todas as Fazendas</option>
        {fazendas.map((fazenda) => (
          <option key={fazenda.id} value={fazenda.id}>
            {fazenda.nome} - {fazenda.estado}
          </option>
        ))}
      </Select>

      <CardsGrid>
        {/* Card Localidade */}
        <Card>
          <CardHeader>Localidade</CardHeader>
          <CardContent>
            <DashboardRemote tipo="mapa" data={calcularSomaMetaPorEstado()} />
          </CardContent>
        </Card>

        {/* Card Vendas */}
        <Card>
          <CardHeader>Vendas</CardHeader>
          <CardContent>
            <DashboardRemote tipo="lucro" data={getVendasPorProduto()} />
          </CardContent>
        </Card>

        {/* Card Metas */}
        <Card>
          <CardHeader>Metas</CardHeader>
          <CardContent>
            <DashboardRemote tipo="metas" data={getMetaPorProduto()} />
          </CardContent>
        </Card>

        {/* Card Produção */}
        <Card>
          <CardHeader>Produção/Safra Ano</CardHeader>
          <CardContent>
            <DashboardRemote tipo="producao" data={getSafraNome()} />
          </CardContent>
        </Card>
      </CardsGrid>
    </Container>
  );
}
