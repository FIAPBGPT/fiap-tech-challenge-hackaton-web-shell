'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { listar } from '@/@core/services/firebase/firebaseService'
import {
  Card,
  CardContent,
  CardHeader,
  CardsGrid,
  Select,
  Subtitle,
  Title,
} from '@/@theme/custom/DashboardStyle'
import { NotificationBell } from '@/@core/components/NotificationBell/NotificationBell'

// Tipos
interface Meta {
  id: string
  produto: string
  safra: string
  fazenda?: string
  valor: number
}

interface Producao {
  id: string
  produto: string
  safra: string
  fazenda: string
  quantidade: number
}

interface Venda {
  id: string
  produto: string
  valor: number
  data: string
}

interface Fazenda {
  id: string
  nome: string
  estado: string
  latitude: number
  longitude: number
}

type DashboardRemoteProps =
  | { tipo: 'mapa'; data: { estado: string; meta: number }[] }
  | { tipo: 'lucro'; data: { produto: string; valor: number }[] }
  | {
      tipo: 'metas'
      data: { produto: string; meta: number; producao: number }[]
    }
  | {
      tipo: 'producao'
      data: { safra: string; produto: string; producao: number }[]
    }

// @ts-ignore
const DashboardRemote = dynamic<DashboardRemoteProps>(
  () => import('mfe/ChartView'),
  {
    ssr: false,
    loading: () => <p>Carregando gráfico...</p>,
  }
)

export default function DashboardPage() {
  const [metas, setMetas] = useState<Meta[]>([])
  const [producoes, setProducoes] = useState<Producao[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [fazendaSelecionada, setFazendaSelecionada] = useState<Fazenda | null>(
    null
  )
  const [atingido, setAtingido] = useState(0)
  const [fazendas, setFazendas] = useState<Fazenda[]>([])
  const [vendas, setVendas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [safras, setSafras] = useState<any[]>([])

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true)
        const [
          metas,
          producoesRaw,
          produtosRaw,
          fazendasData,
          vendasData,
          safra,
        ] = await Promise.all([
          listar('metas'),
          listar('producoes'),
          listar('produtos'),
          listar('fazendas'),
          listar('vendas'),
          listar('safras'),
        ])

        setVendas(vendasData)

        console.log('Vendas carregadas:', vendasData)
        setMetas(
          metas.map((m: any) => ({
            id: m.id,
            produto: m.produto ?? '',
            safra: m.safra ?? '',
            fazenda: m.fazenda ?? '',
            valor: m.valor ?? 0,
          }))
        )
        setProdutos(produtosRaw)
        const fazendasMapped = fazendasData.map((f: any) => ({
          id: f.id,
          nome: f.nome ?? '',
          estado: f.estado ?? '',
          latitude: f.latitude ?? 0,
          longitude: f.longitude ?? 0,
        }))
        setFazendas(fazendasMapped)
        setSafras(safra)

        const producoes: Producao[] = producoesRaw.map((p: any) => ({
          id: p.id,
          produto: p.produto ?? '',
          safra: p.safra ?? '',
          fazenda: p.fazenda ?? '',
          quantidade: p.quantidade ?? 0,
        }))
        setProducoes(producoes)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  useEffect(() => {
    if (!fazendaSelecionada) return

    const totalProduzido = producoes
      .filter((p) => p.fazenda === fazendaSelecionada.nome)
      .reduce((acc, p) => acc + p.quantidade, 0)

    setAtingido(totalProduzido)
  }, [fazendaSelecionada, producoes])

  const getProdutoNome = (id: string) => {
    const produto = produtos.find((p) => p.id === id)
    return produto
      ? `${produto.nome}${produto.categoria ? ` (${produto.categoria})` : ''}`
      : id
  }

  const calcularSomaMetaPorEstado = () => {
    const estadoMap = new Map<string, number>()

    // 1. Primeiro processamos todas as metas (como antes)
    metas.forEach((meta) => {
      const fazenda = fazendas.find((f) => f.id === meta.fazenda)
      if (!fazenda) return

      if (fazendaSelecionada && fazenda.id !== fazendaSelecionada.id) return

      const estado = fazenda.estado
      const valorAtual = estadoMap.get(estado) || 0
      estadoMap.set(estado, valorAtual + meta.valor)
    })

    // 2. Se houver fazenda selecionada mas sem metas, garantimos que apareça
    if (fazendaSelecionada && estadoMap.size === 0) {
      return [
        {
          estado: `BR-${fazendaSelecionada.estado}`,
          meta: 0, // Valor zero para aparecer no mapa
        },
      ]
    }

    // 3. Para o caso sem filtro, incluímos todos os estados com fazendas
    if (!fazendaSelecionada) {
      const estadosComFazendas = new Set(fazendas.map((f) => `BR-${f.estado}`))

      estadosComFazendas.forEach((estado) => {
        if (!estadoMap.has(estado.replace('BR-', ''))) {
          estadoMap.set(estado.replace('BR-', ''), 0)
        }
      })
    }

    // 4. Formatamos o resultado final
    return Array.from(estadoMap.entries()).map(([estado, soma]) => ({
      estado: `BR-${estado}`,
      meta: soma,
    }))
  }
  const getVendasPorProduto = () => {
    if (!vendas || vendas.length === 0) {
      return []
    }

    // Primeiro, achatar todos os itens de todas as vendas em um único array
    const todosItens = vendas.flatMap((venda) =>
      venda.itens.map((item: any) => ({
        ...item,
        dataVenda: venda.data, // Podemos incluir a data da venda se necessário
      }))
    )

    // Filtrar itens pela fazenda selecionada (se houver)
    const itensFiltrados = fazendaSelecionada
      ? todosItens.filter((item) => {
          // Encontrar a fazenda correspondente ao item.fazendaId
          const fazendaItem = fazendas.find((f) => f.id === item.fazendaId)

          // Comparar com a fazenda selecionada
          return fazendaItem?.id === fazendaSelecionada.id
        })
      : todosItens

    // Agrupar por produto e somar os valores
    const vendasAgrupadas = itensFiltrados.reduce((acc, item) => {
      const nomeProduto = getProdutoNome(item.produtoId)
      acc[nomeProduto] = (acc[nomeProduto] || 0) + item.valor
      return acc
    }, {} as Record<string, number>)

    return Object.entries(vendasAgrupadas).map(([produto, valor]) => ({
      produto,
      valor: Number(valor),
    }))
  }

  const getMetaPorProduto = () => {
    // Filtra metas conforme seleção
    const metasFiltradas = fazendaSelecionada
      ? metas.filter((m) => m.fazenda === fazendaSelecionada.id) // Comparar por ID
      : metas

    // Agrupa metas e produções por produto e safra
    const resultado = metasFiltradas.reduce((acc, meta) => {
      const produto = getProdutoNome(meta.produto)
      const key = `${produto}-${meta.safra}` // Chave única por produto e safra

      if (!acc[key]) {
        acc[key] = {
          produto,
          safra: meta.safra,
          meta: 0,
          producao: 0,
        }
      }

      acc[key].meta += meta.valor

      // Calcula produção correspondente
      const producoesCorrespondentes = producoes.filter(
        (p) =>
          p.produto === meta.produto &&
          p.safra === meta.safra &&
          (!fazendaSelecionada || p.fazenda === fazendaSelecionada.id)
      )

      acc[key].producao += producoesCorrespondentes.reduce(
        (sum, p) => sum + p.quantidade,
        0
      )

      return acc
    }, {} as Record<string, { produto: string; safra: string; meta: number; producao: number }>)

    // Converte para array e formata para o gráfico
    return Object.values(resultado).map((item) => ({
      produto: `${item.produto} (${item.safra})`, // Inclui safra no nome
      meta: item.meta,
      producao: item.producao,
    }))
  }

  const getSafraNome = () => {
    const producoesFiltradas = fazendaSelecionada
      ? producoes.filter((p) => p.fazenda === fazendaSelecionada.id)
      : producoes

    if (producoesFiltradas.length === 0) {
      return [{ safra: 'Nenhuma produção', produto: 'N/A', producao: 0 }]
    }

    const agrupado = producoesFiltradas.reduce((acc, p) => {
      const safra = safras.find((s) => s.id === p.safra)?.nome || p.safra
      const produto =
        produtos.find((pr) => pr.id === p.produto)?.nome || p.produto

      if (!acc[safra]) acc[safra] = {}
      acc[safra][produto] = (acc[safra][produto] || 0) + p.quantidade

      return acc
    }, {} as Record<string, Record<string, number>>)

    return Object.entries(agrupado).flatMap(([safra, produtos]) =>
      Object.entries(produtos).map(([produto, producao]) => ({
        safra,
        produto,
        producao,
      }))
    )
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(to bottom, #F2EDDD, #E2C772)',
        }}
      >
        <p>Carregando dados...</p>
      </div>
    )
  }

  return (
    <>
      <NotificationBell products={produtos} fazendas={fazendas} />

      <Title>Suas Dashboards</Title>
      <Subtitle>Escolha qual quer visualizar</Subtitle>
      <Select
        value={fazendaSelecionada?.id || ''}
        onChange={(e) => {
          const fazenda = fazendas.find((f) => f.id === e.target.value)
          setFazendaSelecionada(fazenda || null)
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
    </>
  )
}
