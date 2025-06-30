import { useEffect, useState } from "react";
import VendaForm from "./VendasForm";
import {
  excluirVenda,
  listarVendas,
} from "@/@core/services/firebase/pages/vendasService";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { listarFazendas } from "@/@core/services/firebase/pages/fazendasService";
import { reabastecerEstoqueVenda } from "@/@core/services/firebase/pages/estoqueService";

export default function VendaList() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [vendaEditando, setVendaEditando] = useState<any | null>(null);

  const carregar = async () => {
    const [vendasData, produtosData, fazendasData] = await Promise.all([
      listarVendas(),
      listarProdutos(),
      listarFazendas(),
    ]);
    setVendas(vendasData);
    setProdutos(produtosData);
    setFazendas(fazendasData);
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
    <div>
      <h3>Vendas</h3>

      <VendaForm
        editarVenda={vendaEditando ?? undefined}
        onSuccess={handleSucesso}
        onCancelEdit={handleCancelEdit}
      />

      <ul className="space-y-2 mt-4">
        {vendas.map((v) => (
          <li
            key={v.id}
            className="border p-2 rounded-md bg-white flex justify-between items-center"
          >
            <div>
              <strong>{getProdutoNome(v.itens[0].produtoId)}</strong> -{" "}
              {v.itens[0].quantidade} un - R${v.itens[0].valor} -{" "}
              {new Date(v.data.seconds * 1000).toLocaleDateString()} -{" "}
              {getFazendaNome(v.itens[0].fazendaId)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditar(v)}
                className="btn btn-sm btn-primary"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(v)}
                className="btn btn-sm btn-danger"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
