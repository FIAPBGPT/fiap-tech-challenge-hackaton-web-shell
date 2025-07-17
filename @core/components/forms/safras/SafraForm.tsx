'use client';

import {
  adicionarSafra,
  atualizarSafra,
} from "@/@core/services/firebase/pages/safraService";
import { Container } from "@/@theme/custom/Forms.styles";
import { useEffect, useState } from "react";
import InputComponent from "../../ui/input";
import ButtonComponent from "../../ui/Button";

interface SafraFormProps {
  onSuccess: () => void;
  editarSafra?: { id: string; nome: string; valor: string };
  onCancelEdit?: () => void;
}

export default function SafraForm({
  onSuccess,
  editarSafra,
  onCancelEdit,
}: SafraFormProps) {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");

  useEffect(() => {
    if (editarSafra) {
      setNome(editarSafra.nome);
      setValor(editarSafra.valor);
    } else {
      setNome("");
      setValor("");
    }
  }, [editarSafra]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se o nome e valor são válidos
    if (!nome.trim() || !valor.trim()) {
      return alert("Preencha todos os campos corretamente");
    }

    const dados = { nome, valor };

    try {
      if (editarSafra) {
        await atualizarSafra(editarSafra.id, dados);
      } else {
        await adicionarSafra(dados);
      }

      setNome("");
      setValor("");
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar a safra:", error);
      alert("Ocorreu um erro ao salvar a safra. Tente novamente.");
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div id="containers-legend">
            <legend className="title-form">
              {editarSafra ? "Editar Safra" : "Cadastrar Safra"}
            </legend>
          </div>

          <InputComponent
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: SAF23/24"
            required
            name={"nome"}
          />

          <InputComponent
            id="valor"
            type="text"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ex: SAF2324"
            required
            name={"valor"}
          />

          <div className="div-buttons">
            <ButtonComponent
              type="submit"
              id="btn-cadastrar"
              variant="secondary"
              label={editarSafra ? "Salvar" : "Cadastrar"}
              onClick={() => {}}
            />

            {editarSafra && (
              <ButtonComponent
                type="button"
                id="btn-cancelar"
                variant="buttonGrey"
                label={"Cancelar"}
                className="ms-2"
                onClick={onCancelEdit ?? (() => {})}
              />
            )}
          </div>
        </fieldset>
      </form>
    </Container>
  );
}
