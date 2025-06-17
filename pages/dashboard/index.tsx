'use client';
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { listarFazendas, listarMetas, listarProducoes, listarProdutos, listarSafras, listarVendas } from "@/@core/services/firebase/firebaseService";
import styled from "styled-components";
import { Card, CardContent, CardHeader, CardsGrid, Select, Title } from "@/@theme/custom/DashboardStyle";

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

// Componentes estilizados
const Header = styled.header`
  background-color: #97133E;
  padding: 1.5rem;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

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
  | { tipo: "metas"; data: { produto: string; meta: number; producao: number }[] }
  | { tipo: "producao"; data: { safra: string; produto: string, producao: number }[] };


//@ts-ignore
const DashboardRemote = dynamic<DashboardRemoteProps>(() => import("mfe/ChartView"), {
  ssr: false,
  loading: () => <p>Carregando gráfico...</p>,
});

export default function DashboardPage() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [metaSelecionada, setMetaSelecionada] = useState<Meta | null>(null);
  const [atingido, setAtingido] = useState(0);
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);

  const [safras, setSafras] = useState<any[]>([]);
  

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const [metas, producoesRaw, produtosRaw, fazendas, vendasData, safra] = await Promise.all([
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
        setMetas(metas);
        setProdutos(produtosRaw);
        setFazendas(fazendas);
        setSafras(safra);

        const producoes: Producao[] = producoesRaw.map((p: any) => ({
          id: p.id,
          produto: p.produto ?? "",
          safra: p.safra ?? "",
          fazenda: p.fazenda ?? "",
          quantidade: p.quantidade ?? 0,
        }));
        setProducoes(producoes);

        if (metas.length > 0) {
          setMetaSelecionada(metas[0]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  useEffect(() => {
    if (!metaSelecionada) return;

    const totalProduzido = producoes
      .filter(p =>
        p.produto === metaSelecionada.produto &&
        p.safra === metaSelecionada.safra &&
        (!metaSelecionada.fazenda || p.fazenda === metaSelecionada.fazenda)
      )
      .reduce((acc, p) => acc + p.quantidade, 0);

    setAtingido(totalProduzido);
  }, [metaSelecionada, producoes]);

  const getProdutoNome = (id: string) => {
    const produto = produtos.find(p => p.id === id);
    return produto ? `${produto.nome}${produto.categoria ? ` (${produto.categoria})` : ""}` : id;
  };

  const formatarSafra = (safra: string) => {
    if (safra?.startsWith("SAF") && safra.length === 8) {
      return `SAF${safra.slice(3, 5)}/${safra.slice(5, 7)}`;
    }
    return safra;
  };

  const calcularSomaMetaPorEstado = (produtoIdFiltrado?: string) => {
    const estadoMap = new Map<string, number>();

    metas.forEach(meta => {
      if (produtoIdFiltrado && meta.produto !== produtoIdFiltrado) return;

      const fazenda = fazendas.find(f => f.nome === meta.fazenda);
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
    return vendas.map(venda => ({
      produto: getProdutoNome(venda.produto),
      valor: venda.valor,
    }));
  };

const getMetaPorProduto = () => {
  // Retorna todas as metas se nenhuma estiver selecionada
  const metasParaExibir = metaSelecionada
    ? metas.filter(meta => 
        meta.produto === metaSelecionada.produto &&
        meta.safra === metaSelecionada.safra &&
        (!metaSelecionada.fazenda || meta.fazenda === metaSelecionada.fazenda)
      )
    : metas;

  return metasParaExibir.map(meta => ({
    produto: getProdutoNome(meta.produto),
    meta: meta.valor,
    producao: producoes
      .filter(p =>
        p.produto === meta.produto &&
        p.safra === meta.safra &&
        (!meta.fazenda || p.fazenda === meta.fazenda)
      )
      .reduce((acc, p) => acc + p.quantidade, 0),
  }));
};

const getSafraNome = () => {
  // Primeiro, criamos um mapa para agrupar por safra e produto
  const producaoAgrupada = new Map<string, Map<string, number>>();

  // Preenchemos o mapa com os dados de produção
  producoes.forEach(p => {
    const nomeSafra = safras.find(s => s.id === p.safra)?.nome || p.safra;
    const nomeProduto = produtos.find(prod => prod.id === p.produto)?.nome || p.produto;

    if (!producaoAgrupada.has(nomeSafra)) {
      producaoAgrupada.set(nomeSafra, new Map());
    }

    const produtosDaSafra = producaoAgrupada.get(nomeSafra)!;
    const producaoAtual = produtosDaSafra.get(nomeProduto) || 0;
    produtosDaSafra.set(nomeProduto, producaoAtual + p.quantidade);
  });

  // Convertemos o mapa para o formato esperado pelo gráfico
  const result: { safra: string; produto: string; producao: number }[] = [];

  producaoAgrupada.forEach((produtos, safra) => {
    produtos.forEach((producao, produto) => {
      result.push({
        safra,
        produto,
        producao
      });
    });
  });

  return result;
};

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #F2EDDD, #E2C772)'
      }}>
        <p>Carregando dados...</p>
      </div>
    );
  }

  console.log("Metas:", metas);
  console.log("Produções:", producoes);
  console.log("Produtos:", produtos);
  console.log("Fazendas:", fazendas);
  console.log("Vendas:", vendas);
  console.log("Meta selecionada:", metaSelecionada);
  console.log("Atingido:", atingido);
  console.log("Safra:", safras);
  return (
    <>
      <Header>
        <Container>
          <h1>Home</h1>
          <p>Bem-vindo!</p>
        </Container>
      </Header>

      <Main>
        <Container>
          <Title>Suas Dashboards</Title>

          <Select
            value={metaSelecionada?.id || ""}
            onChange={(e) => {
              const meta = metas.find(m => m.id === e.target.value);
              setMetaSelecionada(meta || null);
            }}
          >
            <option value="">Selecione uma meta</option>

            {metas.map(meta => (
              <option key={meta.id} value={meta.id}>
                {getProdutoNome(meta.produto)} | {meta.fazenda || "Geral"} | {formatarSafra(meta.safra)}
              </option>
            ))}
          </Select>

          <CardsGrid>
            {/* Card Localidade */}
            <Card>
              <CardHeader>Localidade</CardHeader>
              <CardContent>
                <DashboardRemote
                  tipo="mapa"
                  data={calcularSomaMetaPorEstado(metaSelecionada?.produto)}
                />
              </CardContent>
            </Card>

            {/* Card Vendas */}
            <Card>
              <CardHeader>Vendas</CardHeader>
              <CardContent>
                <DashboardRemote
                  tipo="lucro"
                  data={getVendasPorProduto()}
                />
              </CardContent>
            </Card>

            {/* Card Metas */}
            <Card>
              <CardHeader>Metas</CardHeader>
              <CardContent>
                {metaSelecionada ? (
                  <DashboardRemote
                    tipo="metas"
                    data={getMetaPorProduto()}
                  />
                ) : (
                  <p>Selecione uma meta para visualizar</p>
                )}
              </CardContent>
            </Card>

            {/* Card Produção */}
            <Card>
              <CardHeader>Produção</CardHeader>
              <CardContent>
                <DashboardRemote
                  tipo="producao"
                  data={getSafraNome()}
                />
              </CardContent>
            </Card>
          </CardsGrid>
        </Container>
      </Main>
    </>
  );
}