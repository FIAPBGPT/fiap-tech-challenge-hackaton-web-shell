'use client';
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { listarFazendas, listarMetas, listarProducoes, listarProdutos, listarVendas } from "@/@core/services/firebase/firebaseService";
import styled from "styled-components";

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
  min-height: calc(100vh - 80px);
  background: linear-gradient(to bottom, #F2EDDD, #E2C772);
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-family: 'Jura', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #97133E;
  margin-bottom: 1.5rem;
`;

const Select = styled.select`
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  background-color: #97133E;
  color: white;
  padding: 0.75rem 1rem;
  font-family: 'Jura', sans-serif;
`;

const CardContent = styled.div`
  padding: 1rem;
  min-height: 300px;
`;

type DashboardRemoteProps =
  | { tipo: "mapa"; data: { estado: string; meta: number }[] }
  | { tipo: "lucro"; data: { produto: string; valor: number }[] }
  | { tipo: "metas"; meta: number; atingido: number }
  | { tipo: "producao"; data: Producao[] };


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

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const [metas, producoesRaw, produtosRaw, fazendas, vendasData] = await Promise.all([
          listarMetas(),
          listarProducoes(),
          listarProdutos(),
          listarFazendas(),
          listarVendas(),
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
                    meta={metaSelecionada.valor}
                    atingido={atingido}
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
                  data={producoes}
                />
              </CardContent>
            </Card>
          </CardsGrid>
        </Container>
      </Main>
    </>
  );
}