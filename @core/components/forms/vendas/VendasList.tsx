import { excluirVenda, listarVendas, listarProdutos, listarFazendas } from "@/@core/services/firebase/firebaseService";
import { useEffect, useState } from "react";
import VendaForm from "./VendasForm";

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

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta venda?")) {
      await excluirVenda(id);
      carregar();
    }
  };

  const handleEditar = (venda: any) => setVendaEditando(venda);
  const handleCancelEdit = () => setVendaEditando(null);
  const handleSucesso = () => {
    setVendaEditando(null);
    carregar();
  };

  const getProdutoNome = (id: string) => produtos.find((p) => p.id === id)?.nome || "Produto não encontrado";
  const getFazendaNome = (id: string) => fazendas.find((f) => f.id === id)?.nome || "Fazenda não encontrada";

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
            {new Date(v.data.seconds * 1000).toLocaleDateString()} -{" "}
            {getFazendaNome(v.fazenda)}
            <button onClick={() => handleEditar(v)}>Editar</button>
            <button onClick={() => handleDelete(v.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
