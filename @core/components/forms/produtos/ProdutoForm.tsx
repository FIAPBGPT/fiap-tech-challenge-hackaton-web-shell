"use client";

import {
  adicionarProduto,
  atualizarProduto,
} from "@/@core/services/firebase/pages/produtosService";
import { useEffect, useState } from "react";

interface ProdutoFormProps {
  onSuccess: () => void;
  editarProduto?: {
    id: string;
    nome: string;
    categoria?: string;
    preco?: number;
  };
  onCancelEdit?: () => void;
}

// Categorias válidas para seleção
const categorias = ["C1", "C2", "S1", "S2", "Genética", "Básica"];

export default function ProdutoForm({
  onSuccess,
  editarProduto,
  onCancelEdit,
}: ProdutoFormProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [error, setError] = useState<string | null>(null); // Estado de erro

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

    // Validação de campos obrigatórios
    if (!nome.trim()) {
      return setError("Nome do produto é obrigatório.");
    }

    if (preco && isNaN(Number(preco))) {
      return setError("Preço deve ser um valor numérico válido.");
    }

    setError(null); // Limpa o erro anterior

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

      // Limpa o formulário após envio
      setNome("");
      setCategoria("");
      setPreco("");
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setError("Erro ao salvar produto. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>
          {editarProduto ? "Editar Produto" : "Cadastrar Produto"}
        </legend>

        <label htmlFor="nome">Nome do Produto:</label>
        <input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do produto"
          required
        />

        <label htmlFor="categoria">Categoria:</label>
        <select
          id="categoria"
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

        <label htmlFor="preco">Preço:</label>
        <input
          id="preco"
          type="number"
          step="0.01"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          placeholder="Preço (opcional)"
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">{editarProduto ? "Salvar" : "Cadastrar"}</button>
        {editarProduto && (
          <button type="button" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </fieldset>
    </form>
  );
}
