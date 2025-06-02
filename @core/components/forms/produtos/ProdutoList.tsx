import { useEffect, useState } from "react";
import { listarProdutos, excluirProduto } from "@/@core/services/firebase/firebaseService";
import ProdutoForm from "./ProdutoForm";

const categorias = [
  { code: "SG", label: "Semente Genética" },
  { code: "SB", label: "Semente Básica" },
  { code: "C1", label: "Semente Certificada 1ª Geração (C1)" },
  { code: "C2", label: "Semente Certificada 2ª Geração (C2)" },
  { code: "S1", label: "Semente 1ª Geração da Certificada (S1)" },
  { code: "S2", label: "Semente 2ª Geração da Certificada (S2)" },
];

// Função para buscar label pelo código da categoria
function getCategoriaLabel(code: string | undefined) {
  if (!code) return "";
  const categoria = categorias.find(c => c.code === code);
  return categoria ? categoria.label : code; // Se não encontrar, mostra o código mesmo
}

export default function ProdutoList() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtoEditando, setProdutoEditando] = useState<any | null>(null);

  const carregar = async () => {
    const lista = await listarProdutos();
    setProdutos(lista);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir este produto?")) {
      await excluirProduto(id);
      carregar();
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
    <div>
      <h3>Produtos</h3>

      {produtoEditando ? (
        <ProdutoForm
          editarProduto={produtoEditando}
          onSuccess={handleSucesso}
          onCancelEdit={handleCancelEdit}
        />
      ) : (
        <ProdutoForm onSuccess={handleSucesso} />
      )}

      <ul>
        {produtos.map(p => (
          <li key={p.id}>
            {p.nome}{" "}
            {p.categoria && `- ${getCategoriaLabel(p.categoria)}`}{" "}
            <button onClick={() => handleEditar(p)}>Editar</button>
            <button onClick={() => handleDelete(p.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
