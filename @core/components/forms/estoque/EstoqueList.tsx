'use client';

import { useEffect, useState } from "react";
import { listarEstoque, excluirEstoque } from "@/@core/services/firebase/pages/estoqueService";
import EstoqueForm from "./EstoqueForm";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { listarSafras } from "@/@core/services/firebase/pages/safraService";

// Função para encontrar o nome do produto ou safra dado um ID
function getNomePorId(id: string, lista: any[]) {
  const item = lista.find((i) => i.id === id);
  return item ? item.nome : id;
}

export default function EstoqueList() {
  const [estoques, setEstoques] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [safras, setSafras] = useState<any[]>([]);
  const [estoqueEditando, setEstoqueEditando] = useState<any | null>(null);

  // Carregar os dados de estoque, produtos e safras
  const carregar = async () => {
    try {
      const [e, p, s] = await Promise.all([
        listarEstoque(),
        listarProdutos(),
        listarSafras(),
      ]);

      setEstoques(e);
      setProdutos(p);
      setSafras(s);
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
      alert("Erro ao carregar os dados.");
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir este registro de estoque?")) {
      try {
        await excluirEstoque(id);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir estoque:", error);
        alert("Erro ao excluir estoque.");
      }
    }
  };

  const handleEditar = (registro: any) => {
    setEstoqueEditando(registro);
  };

  const handleCancelEdit = () => {
    setEstoqueEditando(null);
  };

  const handleSucesso = () => {
    setEstoqueEditando(null);
    carregar();
  };

  return (
    <div>
      <h3>Controle de Estoque</h3>

      {estoqueEditando ? (
        <EstoqueForm
          editarEstoque={estoqueEditando}
          onSuccess={handleSucesso}
          onCancelEdit={handleCancelEdit}
        />
      ) : (
        <EstoqueForm onSuccess={handleSucesso} />
      )}

      <ul className="space-y-2 mt-4">
        {estoques.map((e) => (
          <li
            key={e.id}
            className="border p-2 rounded-md bg-white flex justify-between items-center"
          >
            <div>
              <strong>{getNomePorId(e.produtoId, produtos)}</strong>
              {e.safraId && <> - Safra: {getNomePorId(e.safraId, safras)}</>}
              <br />
              Tipo: {e.tipo} | Quantidade: {e.quantidade}
              {e.observacao && (
                <>
                  <br />
                  Obs: {e.observacao}
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditar(e)}
                className="btn btn-sm btn-primary"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(e.id)}
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
