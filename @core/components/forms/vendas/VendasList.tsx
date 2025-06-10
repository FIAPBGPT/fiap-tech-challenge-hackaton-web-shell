import { useEffect, useState } from "react";
import VendaForm from "./VendasForm";
import {
  excluirVenda,
  listarVendas,
} from "@/@core/services/firebase/pages/vendasService";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { listarFazendas } from "@/@core/services/firebase/pages/fazendasService";
import { registrarVendaEstoque } from "@/@core/services/firebase/pages/estoqueService";

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
    console.log("vendas", vendasData);
    console.log("produtos", produtosData);
    console.log("fazendas", fazendasData);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleDelete = async (
    id: string,
    produtoId: string,
    quantidade: number
  ) => {
    if (confirm("Deseja excluir esta venda?")) {
      await excluirVenda(id);

      // Restaurar o estoque quando a venda for excluída
      await registrarVendaEstoque({
        id: id,
        itens: [
          {
            produtoId: produtoId,
            quantidade: quantidade, // quantidade da venda excluída
          },
        ],
      });

      carregar();
    }
  };

  const handleEditar = (venda: any) => setVendaEditando(venda);
  const handleCancelEdit = () => setVendaEditando(null);
  const handleSucesso = () => {
    setVendaEditando(null);
    carregar();
  };

  const getProdutoNome = (id: string) =>
    produtos.find((p) => p.id === id)?.nome || "Produto não encontrado";

  return (
    <div>
      <h3>Vendas</h3>

      <VendaForm
        editarVenda={vendaEditando ?? undefined}
        onSuccess={handleSucesso}
        onCancelEdit={handleCancelEdit}
      />

      <ul>
        {vendas.map((v) => (
          <li key={v.id}>
            {getProdutoNome(v.produto)} - {v.quantidade} un - R${v.valor} -{" "}
            {new Date(v.data.seconds * 1000).toLocaleDateString()} - {v.fazenda}
            <button onClick={() => handleEditar(v)}>Editar</button>
            <button onClick={() => handleDelete(v.id, v.produto, v.quantidade)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
