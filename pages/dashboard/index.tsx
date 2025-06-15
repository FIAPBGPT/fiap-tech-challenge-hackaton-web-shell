// 'use client';
// import dynamic from "next/dynamic";

// // Importa dinamicamente o microfrontend
// type ChartViewProps = {
//   data?: { produto: string; lucro: number }[] | { status: string; quantidade: number }[];
//   tipo?: string;
//   meta?: number;
//   atingido?: number;
// };

// // @ts-ignore
// const DashboardRemote = dynamic<ChartViewProps>(() => import("mfe/ChartView"), {
//   ssr: false,
//   loading: () => <p>Carregando gráfico...</p>,
// });

// export default function DashboardPage() {
//   const fakeData = [
//     { produto: "Milho", lucro: 3000 },
//     { produto: "Soja", lucro: 5000 },
//     { produto: "Tomate", lucro: 1500 },
//   ];

//   const fakeProductionData = [
//     { status: "em_producao", quantidade: 12 },
//     { status: "finalizado", quantidade: 8 },
//     { status: "cancelado", quantidade: 2 },
//   ]

//   const fakeMetaData = {
//     meta: 100,
//     atingido: 85,
//   };

//   return (
//     <div>
//       <h2>Dashboard</h2>
//       <DashboardRemote tipo="lucro" data={fakeData} />
// <DashboardRemote tipo="producao" data={fakeProductionData} />
// <DashboardRemote tipo="metas" meta={fakeMetaData.meta} atingido={fakeMetaData.atingido} />
//     </div>
//   );
// }


'use client';
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { listarFazendas, listarMetas, listarProducoes, listarProdutos, listarVendas } from "@/@core/services/firebase/firebaseService";

type ChartViewProps = {
  data?: any;
  tipo?: string;
  meta?: number;
  atingido?: number;
};

//@ts-ignore
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
}

interface Producao {
  id: string;
  produto: string;
  safra: string;
  fazenda: string;
  quantidade: number;
}


export default function DashboardPage() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [metaSelecionada, setMetaSelecionada] = useState<Meta | null>(null);
  const [atingido, setAtingido] = useState(0);
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [vendas, setVendas] = useState<any[]>([]);

  useEffect(() => {
    async function carregarDados() {
      const [metas, producoesRaw, produtosRaw, fazendas, vendasData] = await Promise.all([
        listarMetas(),
        listarProducoes(),
        listarProdutos(),
        listarFazendas(),
        listarVendas(),
      ]);
      setVendas(vendasData);
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

  const calcularSomaMetaPorEstado = () => {
    const estadoMap = new Map<string, number>();

    metas.forEach(meta => {
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


  console.log("Metas:", metas);
  console.log("Produções:", producoes);
  console.log("Produtos:", produtos);
  console.log("Fazendas:", fazendas);
  console.log("Vendas:", vendas);
  return (
    <div>

      <header>
        <h1>Dashboard de Produção e Vendas</h1>
        <p>Selecione uma meta para visualizar os dados correspondentes.</p>


      </header>
      <h2>Dashboard</h2>
      {/* <DashboardRemote tipo="lucro" data={metas.map(m => ({ produto: getProdutoNome(m.produto), lucro: m.valor }))} />
      <DashboardRemote tipo="producao" data={producoes} /> */}
      <select
        value={metaSelecionada?.id || ""}
        onChange={(e) => {
          const meta = metas.find(m => m.id === e.target.value);
          setMetaSelecionada(meta || null);
        }}
      >
        <option value="">Selecione uma meta</option>
        {metas.map(meta => (
          <option key={meta.id} value={meta.id}>
            {getProdutoNome(meta.produto)}
          </option>
        ))}
      </select>
      {metaSelecionada && (
        <>
          <h3>Meta selecionada:</h3>
          <p>
            Produto: {getProdutoNome(metaSelecionada.produto)} |
            Safra: {formatarSafra(metaSelecionada.safra)} |
            Meta: {metaSelecionada.valor} unidades
          </p>

          <DashboardRemote
            tipo="metas"
            meta={metaSelecionada.valor}
            atingido={atingido}
          />
        </>
      )}

      <DashboardRemote tipo="mapa" data={calcularSomaMetaPorEstado()} />
    </div>
  );
}
