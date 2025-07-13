'use client';
import { useEffect, useState } from "react";
import MetaForm from "./MetaForm";
import {
  excluirMeta,
  listarMetas,
} from "@/@core/services/firebase/pages/metasService";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { listarSafras } from "@/@core/services/firebase/pages/safraService";

export default function MetaList() {
  const [metas, setMetas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [safras, setSafras] = useState<any[]>([]);
  const [metaEditando, setMetaEditando] = useState<any | null>(null);

  const carregar = async () => {
    const [listaMetas, listaProdutos, listaSafras] = await Promise.all([
      listarMetas(),
      listarProdutos(),
      listarSafras(),
    ]);
    console.log("Safras carregadas:", listaSafras);
    setMetas(listaMetas);
    setProdutos(listaProdutos);
    setSafras(listaSafras);
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
    console.log(safra);
    console.log(safras);
    const safraSelected = safras.find((s) => s.id === safra);
    if (!safraSelected) {
      console.warn(`Safra não encontrada: ${safra}`);
      return safraSelected.nome; 
    }// Retorna o ID se a safra não for encontrada

    return safraSelected.nome;
  };

  const nomeProduto = (produtoId: string) => {
    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto) return produtoId;
    return `${produto.nome}${
      produto.categoria ? ` (${produto.categoria})` : ""
    }`;
  };

  // Traduz o tipo para exibição
  const tipoTexto = (tipo?: string) => {
    switch (tipo) {
      case "producao":
        return "Meta de Produção";
      case "vendas":
        return "Meta de Vendas";
      default:
        return "Tipo não definido";
    }
  };

  return (
    <div>

      <MetaForm
        editarMeta={metaEditando ?? undefined}
        onSuccess={handleSucesso}
        onCancelEdit={handleCancelEdit}
      />

      <ul>
        {metas.map((m) => (
          <li key={m.id} style={{ marginBottom: "1rem" }}>
            <strong>{nomeProduto(m.produto)}</strong> - {m.valor} unidades -{" "}
            {formatarSafra(m.safra)} - {m.fazenda || "Fazenda não definida"} -{" "}
            <em>{tipoTexto(m.tipo)}</em>
            <br />
            <button onClick={() => handleEditar(m)}>Editar</button>{" "}
            <button onClick={() => handleDelete(m.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
