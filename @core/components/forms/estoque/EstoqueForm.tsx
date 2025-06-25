'use client';

import { useEffect, useState } from "react";
import { adicionarEstoque, atualizarEstoque } from "@/@core/services/firebase/pages/estoqueService";
import ProdutoSelect from "../produtos/ProdutoSelect";
import SafraSelect from "../safras/SafraSelect";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/@core/services/firebase/firebase";

interface EstoqueFormProps {
  onSuccess: () => void;
  editarEstoque?: {
    id: string;
    produtoId: string;
    safraId?: string | null;
    quantidade: number;
    tipo: "entrada" | "saida";
    observacao?: string;
  };
  onCancelEdit?: () => void;
}

export default function EstoqueForm({
  onSuccess,
  editarEstoque,
  onCancelEdit,
}: EstoqueFormProps) {
  const [form, setForm] = useState({
    produto: "",
    safra: "",
    quantidade: "",
    tipo: "entrada",
    observacao: "",
  });

  // Carrega os dados ao editar um estoque existente
  useEffect(() => {
    if (editarEstoque) {
      setForm({
        produto: editarEstoque.produtoId,
        safra: editarEstoque.safraId || "",
        quantidade: editarEstoque.quantidade.toString(),
        tipo: editarEstoque.tipo,
        observacao: editarEstoque.observacao || "",
      });
    } else {
      setForm({
        produto: "",
        safra: "",
        quantidade: "",
        tipo: "entrada",
        observacao: "",
      });
    }
  }, [editarEstoque]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.produto || !form.quantidade || Number(form.quantidade) <= 0) {
      return alert("Preencha todos os campos obrigatórios.");
    }

    // Dados da movimentação de estoque
    const estoqueData = {
      produtoId: form.produto,
      safraId: form.safra || null,
      quantidade: Number(form.quantidade),
      tipo: form.tipo as "entrada" | "saida",
      observacao: form.observacao,
      data: new Date(),
    };

    try {
      // Valida a quantidade disponível caso seja uma saída
      if (form.tipo === "saida") {
        const saldoRef = doc(
          firestore,
          "estoque_saldos",
          `${form.produto}_${form.safra || ""}`
        );
        const saldoSnap = await getDoc(saldoRef);
        const saldoAtual = saldoSnap.exists()
          ? saldoSnap.data()?.quantidade || 0
          : 0;

        if (saldoAtual < estoqueData.quantidade) {
          return alert("Estoque insuficiente para a saída.");
        }
      }

      // Se editando, chamamos a função de atualização
      if (editarEstoque) {
        await atualizarEstoque(editarEstoque.id, estoqueData);
      } else {
        await adicionarEstoque(estoqueData);
      }

      // Limpa o formulário após sucesso
      setForm({
        produto: "",
        safra: "",
        quantidade: "",
        tipo: "entrada",
        observacao: "",
      });

      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro desconhecido.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-md bg-white"
    >
      <h2 className="text-lg font-bold">
        {editarEstoque ? "Editar Estoque" : "Registrar Estoque"}
      </h2>

      <ProdutoSelect
        value={form.produto}
        onChange={handleChange}
        name="produto"
        required
      />

      <SafraSelect value={form.safra} onChange={handleChange} name="safra" />

      <div>
        <label>Quantidade:</label>
        <input
          type="number"
          name="quantidade"
          value={form.quantidade}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Tipo:</label>
        <select name="tipo" value={form.tipo} onChange={handleChange} required>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
      </div>

      <div>
        <label>Observação:</label>
        <input
          type="text"
          name="observacao"
          value={form.observacao}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">
          {editarEstoque ? "Salvar" : "Cadastrar"}
        </button>
        {editarEstoque && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelEdit}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
