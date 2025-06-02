'use client';
import { useEffect, useState } from "react";
import { adicionarProduto, atualizarProduto } from "@/@core/services/firebase/firebaseService";

interface ProdutoFormProps {
  onSuccess: () => void;
  editarProduto?: { id: string; nome: string; categoria?: string; preco?: number };
  onCancelEdit?: () => void;
}

// Categorias válidas para seleção
const categorias = ["C1", "C2", "S1", "S2", "Genética", "Básica"];

export default function ProdutoForm({ onSuccess, editarProduto, onCancelEdit }: ProdutoFormProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");

  // Preenche campos ao editar
  useEffect(() => {
    if (editarProduto) {
      setNome(editarProduto.nome);
      setCategoria(editarProduto.categoria || "");
      setPreco(editarProduto.preco?.toString() || "");
    } else {
      setNome("");
      setCategoria("");
      setPreco("");
    }
  }, [editarProduto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return alert("Nome é obrigatório");

    const dados = {
      nome,
      categoria: categoria || undefined,
      preco: preco ? Number(preco) : undefined,
    };

    try {
      if (editarProduto) {
        await atualizarProduto(editarProduto.id, dados);
      } else {
        await adicionarProduto(dados);
      }

      // Limpa formulário
      setNome("");
      setCategoria("");
      setPreco("");
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={nome}
        onChange={e => setNome(e.target.value)}
        placeholder="Nome do produto"
        required
      />

      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        required
      >
        <option value="">Selecione a categoria</option>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="number"
        step="0.01"
        value={preco}
        onChange={e => setPreco(e.target.value)}
        placeholder="Preço (opcional)"
      />

      <button type="submit">{editarProduto ? "Salvar" : "Cadastrar"}</button>
      {editarProduto && <button type="button" onClick={onCancelEdit}>Cancelar</button>}
    </form>
  );
}
