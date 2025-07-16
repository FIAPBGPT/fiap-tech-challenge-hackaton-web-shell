import { useEffect, useState } from "react";
import VendaForm from "./VendasForm";
import {
  excluirVenda,
  listarVendas,
} from "@/@core/services/firebase/pages/vendasService";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { listarFazendas } from "@/@core/services/firebase/pages/fazendasService";
import { reabastecerEstoqueVenda } from "@/@core/services/firebase/pages/estoqueService";
import { Col, Row } from "react-bootstrap";
import GenericTable from "../../ui/GenericTable";

export default function VendaList() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [vendaEditando, setVendaEditando] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    const [vendasData, produtosData, fazendasData] = await Promise.all([
      listarVendas(),
      listarProdutos(),
      listarFazendas(),
    ]);
    setVendas(vendasData);
    setProdutos(produtosData);
    setFazendas(fazendasData);
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleDelete = async (venda: any) => {
    const confirmacao = confirm(
      "Deseja excluir esta venda? O estoque será reabastecido."
    );
    if (!confirmacao) return;

    const vendaParaRepor = {
      id: venda.id,
      itens: [
        {
          produtoId: venda.produto,
          quantidade: venda.quantidade,
          safraId: venda.safra || null,
          fazendaId: venda.fazenda || null,
        },
      ],
    };

    await reabastecerEstoqueVenda(vendaParaRepor);
    await excluirVenda(venda.id);
    carregar();
  };

  const handleEditar = (venda: any) => setVendaEditando(venda);
  const handleCancelEdit = () => setVendaEditando(null);
  const handleSucesso = () => {
    setVendaEditando(null);
    carregar();
  };

  const getProdutoNome = (id: string) => {
    if (!id || !Array.isArray(produtos)) return "Produto não encontrado";
    const produto = produtos.find((p) => p.id === id);
    return produto?.nome ?? "Produto não encontrado";
  };

  const getFazendaNome = (id: string) =>
    fazendas.find((f) => f.id === id)?.nome || id;

  return (
    <Row className="w-100">
      <Col md={12} className="mb-3">
        {vendaEditando ? (
          <VendaForm
            editarVenda={vendaEditando}
            onSuccess={handleSucesso}
            onCancelEdit={handleCancelEdit}
          />
        ) : (
          <VendaForm onSuccess={handleSucesso} />
        )}
      </Col>
      <Col md={12}>
        <GenericTable
          data={vendas.map((v) => ({
            id: v.id,
            produto: getProdutoNome(v.itens[0].produtoId),
            safra: v.itens[0].safraId ? v.itens[0].safraId : "N/A",
            fazenda: getFazendaNome(v.itens[0].fazendaId),
            quantidade: v.itens[0].quantidade,
            valor: v.itens[0].valor,
            data: new Date(v.data.seconds * 1000).toLocaleDateString(),
          }))}
          columns={[
            { key: "produto", label: "Produto" },
            { key: "safra", label: "Safra" },
            { key: "fazenda", label: "Fazenda" },
            { key: "quantidade", label: "Quantidade" },
            { key: "valor", label: "Valor (R$)" },
            { key: "data", label: "Data" },
          ]}
          onEdit={(row) => handleEditar(row)}
          onDelete={(row) => handleDelete(row)}
          loading={loading}
        />
      </Col>
    </Row>
  );
}
