'use client';
import { useEffect, useState } from "react";
import { listarMetas, excluirMeta, listarProdutos } from "@/@core/services/firebase/firebaseService";
import MetaForm from "./MetaForm";

export default function MetaList() {
  const [metas, setMetas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [metaEditando, setMetaEditando] = useState<any | null>(null);

  const carregar = async () => {
    const [listaMetas, listaProdutos] = await Promise.all([
      listarMetas(),
      listarProdutos(),
    ]);
    setMetas(listaMetas);
    setProdutos(listaProdutos);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta meta?")) {
      await excluirMeta(id);
      carregar();
    }
  };

  const handleEditar = (meta: any) => {
    setMetaEditando(meta);
  };

  const handleCancelEdit = () => {
    setMetaEditando(null);
  };

  const handleSucesso = () => {
    setMetaEditando(null);
    carregar();
  };

  const formatarSafra = (safra: string) => {
    if (safra?.startsWith("SAF") && safra.length === 8) {
      return `SAF${safra.slice(3, 5)}/${safra.slice(5, 7)}`;
    }
    return safra;
  };

  const nomeProduto = (produtoId: string) => {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return produtoId;
    return `${produto.nome}${produto.categoria ? ` (${produto.categoria})` : ""}`;
  };

  return (
    <div>
      <h3>Metas</h3>

      <MetaForm
        editarMeta={metaEditando ?? undefined}
        onSuccess={handleSucesso}
        onCancelEdit={handleCancelEdit}
      />

      <ul>
        {metas.map(m => (
          <li key={m.id}>
            <strong>{nomeProduto(m.produto)}</strong> - {m.valor} - {formatarSafra(m.safra)} - {m.fazenda}
            <button onClick={() => handleEditar(m)}>Editar</button>
            <button onClick={() => handleDelete(m.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
