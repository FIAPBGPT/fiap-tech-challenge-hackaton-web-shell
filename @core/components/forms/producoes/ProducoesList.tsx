'use client';
import { useEffect, useState } from "react";
import ProducaoForm from "./ProducoesForm";
import { removerProducaoEstoque } from "@/@core/services/firebase/pages/estoqueService";
import {
  excluirProducao,
  listarProducoes,
} from "@/@core/services/firebase/pages/producoesService";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { listarFazendas } from "@/@core/services/firebase/pages/fazendasService";
import { listarSafras } from "@/@core/services/firebase/pages/safraService";
import { Col, Row } from "react-bootstrap";
import GenericTable from "../../ui/GenericTable";

export default function ProducoesList() {
  const [producoes, setProducoes] = useState<any[]>([]);
  const [producaoEditando, setProducaoEditando] = useState<any | null>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [safras, setSafras] = useState<any[]>([]);

  const nomeProdutoFormatado = (produtos: any[], id: string) => {
    const produto = produtos.find((item) => item.id === id);
    if (!produto) return id;
    return produto.categoria
      ? `${produto.nome} (${produto.categoria})`
      : produto.nome;
  };

  const nomePorId = (lista: any[], id: string) => {
    return lista.find((item) => item.id === id)?.nome || id;
  };

  const formatarSafra = (safraValor: string) => {
    if (!safraValor) return "";
    const safraResult =
      safras.find((s) => s.id === safraValor) ||
      console.warn(`Safra não encontrada: ${safraValor}`);
    return safraResult.nome;
  };

  const carregar = async () => {
    const [listaProducoes, listaProdutos, listaFazendas, listaSafras] =
      await Promise.all([
        listarProducoes(),
        listarProdutos(),
        listarFazendas(),
        listarSafras(),
      ]);

    setProducoes(listaProducoes);
    setProdutos(listaProdutos);
    setFazendas(listaFazendas);
    setSafras(listaSafras);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleEditar = (producao: any) => {
    setProducaoEditando(producao);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta produção?")) {
      const producaoExcluida = producoes.find((p) => p.id === id);

      if (producaoExcluida) {
        await removerProducaoEstoque({
          id,
          itens: [
            {
              produtoId: producaoExcluida.produto,
              safraId: producaoExcluida.safra,
              fazendaId: producaoExcluida.fazenda,
              quantidade: producaoExcluida.quantidade,
            },
          ],
        });

        await excluirProducao(id);
        carregar();
      }
    }
  };

  return (
     <div>
      <ProducaoForm
        editarProducao={producaoEditando ?? undefined}
        onSuccess={() => {
          setProducaoEditando(null);
          carregar();
        }}
        onCancelEdit={() => setProducaoEditando(null)}
      />

      <Row>
        <Col>
          <GenericTable
            data={producoes.map((p) => ({
              id: p.id,
              produto: nomeProdutoFormatado(produtos, p.produto),
              quantidade: p.quantidade,
              fazenda: nomePorId(fazendas, p.fazenda),
              safra: formatarSafra(p.safra),
            }))}
            columns={[
              { key: "produto", label: "Produto" },
              { key: "quantidade", label: "Quantidade" },
              { key: "fazenda", label: "Fazenda" },
              { key: "safra", label: "Safra" },
            ]}
            onEdit={(row) => {
              const producao = producoes.find((p) => p.id === row.id);
              if (producao) handleEditar(producao);
            }}
            onDelete={(row) => handleDelete(row.id)}
          />
        </Col>
      </Row>
    </div>
  );
}
