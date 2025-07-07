"use client";

import {
  adicionarProduto,
  atualizarProduto,
} from "@/@core/services/firebase/pages/produtosService";
import { useEffect, useState } from "react";
import SelectComponent from "../../ui/select/Select.component";
import InputComponent from "../../ui/input/Input.component";
import { Container } from "@/@theme/custom/ProdutoForm.styles";
import ButtonComponent from "../../ui/Button";

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
    <Container>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div id="containers-legend">
            <legend>
              {editarProduto ? "Editar Produto" : "Cadastrar Produto"}
            </legend>
          </div>

          <InputComponent
            id="nome"
            type="text"
            value={nome}
            onChange={(value) => setNome(value)}
            placeholder="Nome do produto"
            required
          />

          <InputComponent
            id="preco"
            type="number"
            value={preco}
            step="0.01"
            onChange={(value) => setPreco(value)}
            placeholder="Preço (opcional)"
            required
          />

          <SelectComponent
            id={"categoria2"}
            value={categoria}
            options={categorias}
            onChange={(value) => setCategoria(value)}
            placeholder={"Selecione a categoria"}
            required={true}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
          <div id="div-buttons">
            <ButtonComponent
              type="submit"
              id="btn-cadastrar"
              variant="secondary"
              label={editarProduto ? "Salvar" : "Cadastrar"}
              onClick={() => {}}
            />

            {editarProduto && (
              <ButtonComponent
                type="button"
                id="btn-cancelar"
                variant="buttonGrey"
                label={"Cancelar"}
                onClick={onCancelEdit ?? (() => {})}
              />
            )}
          </div>
        </fieldset>
      </form>
    </Container>
  );
}
