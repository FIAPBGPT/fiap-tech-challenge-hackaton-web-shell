import { useEffect, useState } from "react";
import ProdutoForm from "./ProdutoForm";
import { useProdutoStore } from "@/@core/store/produtoStore";
import {
  excluirProduto,
  listarProdutos,
} from "@/@core/services/firebase/pages/produtosService";
import GenericTable from "../../ui/GenericTable";
import { Col, Row } from "react-bootstrap";

const categorias = [
  { code: "SG", label: "Semente Genética" },
  { code: "SB", label: "Semente Básica" },
  { code: "C1", label: "Semente Certificada 1ª Geração (C1)" },
  { code: "C2", label: "Semente Certificada 2ª Geração (C2)" },
  { code: "S1", label: "Semente 1ª Geração da Certificada (S1)" },
  { code: "S2", label: "Semente 2ª Geração da Certificada (S2)" },
];

export default function ProdutoList() {
  const { produtos, setProdutos, loading, setLoading, removeProduto } =
    useProdutoStore();
  const [produtoEditando, setProdutoEditando] = useState<any | null>(null);

  // Função utilitária para exibir o nome da categoria
  function getCategoriaLabel(code: string | undefined) {
    if (!code) return "";
    const categoria = categorias.find((c) => c.code === code);
    return categoria ? categoria.label : code; // Se não encontrar, retorna o próprio código
  }

  const carregar = async () => {
    setLoading(true);
    const lista = await listarProdutos();
    // Garantir que cada produto tenha as propriedades obrigatórias
    const produtosCompletos = lista.map((p: any) => ({
      id: p.id,
      nome: p.nome ?? "",
      categoria: p.categoria,
      preco: p.preco,
    }));
    setProdutos(produtosCompletos);
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir este produto?")) {
      await excluirProduto(id);
      setProdutos(produtos.filter((p) => p.id !== id));
    }
  };

  const handleEditar = (produto: any) => {
    setProdutoEditando(produto);
  };

  const handleCancelEdit = () => {
    setProdutoEditando(null);
  };

  const handleSucesso = () => {
    setProdutoEditando(null);
    carregar();
  };

  return (
    <Row className="w-100">
      <Col>
        <GenericTable
          data={produtos.map((p) => ({
            id: p.id,
            nome: p.nome,
            categoria: getCategoriaLabel(p.categoria),
          }))}
          columns={[
            { key: "nome", label: "Nome" },
            { key: "categoria", label: "Categoria" },
          ]}
          onEdit={(row) => {
            const produto = produtos.find((p) => p.id === row.id);
            if (produto) handleEditar(produto);
          }}
          onDelete={(row) => handleDelete(row.id)}
        />
      </Col>
    </Row>
  );
}
