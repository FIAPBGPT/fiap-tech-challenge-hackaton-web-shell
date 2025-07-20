'use client'

import { useEffect, useState } from 'react'
import { listarEstoque } from '@/@core/services/firebase/pages/estoqueService'
import { listarProdutos } from '@/@core/services/firebase/pages/produtosService'
import { listarSafras } from '@/@core/services/firebase/pages/safraService'
import FazendaSelect from '../fazendas/FazendaSelect'
import ButtonComponent from '../../ui/Button'
import { Container } from '@/@theme/custom/Forms.styles'
import SafraSelect from '../safras/SafraSelect'
import ProdutoSelect from '../produtos/ProdutoSelect'
import { Col, Row } from "react-bootstrap";
import GenericTable from "../../ui/GenericTable";

interface EstoqueItem {
  id: string;
  produtoId: string;
  safraId?: string | null;
  fazendaId?: string | null;
  quantidade: number;
  tipo: "Entrada" | "Saída" | "entrada" | "saída";
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
  const [loading, setLoading] = useState(true);

  // Estados dos filtros
  const [filtroProduto, setFiltroProduto] = useState("");
  const [filtroSafra, setFiltroSafra] = useState("");
  const [filtroFazenda, setFiltroFazenda] = useState("");
  const [fazendas, setFazendas] = useState<any[]>([]);

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
          tipo: item.tipo ?? "Entrada",
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
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
      alert("Erro ao carregar os dados.");
      setLoading(false);
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
          return (
            saldo +
            (item.tipo === "Entrada" || item.tipo === "entrada" ? qtd : -qtd)
          );
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
    <Container>
      <Row className="w-100 justify-content-center">
        <Col className="mb-3 form-container">
          <h3 className="title-form" style={{margin: "10px 0"}}>Verifique os estoques</h3>
          <ProdutoSelect value={filtroProduto} onChange={setFiltroProduto} />
          <SafraSelect
            value={filtroSafra}
            valueKey="id"
            labelKey="nome"
            onChange={setFiltroSafra}
            required={false}
          />

          <FazendaSelect
            id="filtro-fazenda"
            value={filtroFazenda}
            onChange={setFiltroFazenda}
            required={false}
          />

          <div id="div-button">
            <ButtonComponent
              label={"Limpar"}
              onClick={limparFiltros}
              aria-label="Limpar filtros"
              variant="buttonGrey"
              textColor="secondary"
            />
          </div>

          {showSaldo && (
            <p id="text-destaque" aria-live="polite">
              Saldo Atual (filtrado): {saldoFiltrado}
            </p>
          )}
        </Col>
        {/* Lista de Estoques Filtrados */}
        <Col md={12}>
          <GenericTable
            data={estoquesFiltrados.map((e) => ({
              id: e.id,
              produto: getNomePorId(e.produtoId, produtos),
              safra: e.safraId ? getNomePorId(e.safraId, safras) : "N/A",
              fazenda: e.fazendaId
                ? getNomePorId(e.fazendaId, fazendas)
                : "N/A",
              tipo: e.tipo,
              quantidade: e.quantidade,
              observacao: e.observacao || "",
            }))}
            columns={[
              { key: "produto", label: "Produto" },
              { key: "safra", label: "Safra" },
              { key: "fazenda", label: "Id ou Nome da Fazenda" },
              { key: "tipo", label: "Tipo" },
              { key: "quantidade", label: "Quantidade" },
              { key: "observacao", label: "Observação" },
            ]}
            loading={loading}
          />
        </Col>
      </Row>
    </Container>
  );
}