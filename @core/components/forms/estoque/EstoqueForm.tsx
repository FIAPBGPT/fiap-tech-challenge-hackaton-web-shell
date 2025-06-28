'use client';

import { useEffect, useState } from "react";
import { adicionarEstoque, atualizarEstoque } from "@/@core/services/firebase/pages/estoqueService";
import ProdutoSelect from "../produtos/ProdutoSelect";
import SafraSelect from "../safras/SafraSelect";

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

  // Preenche formulário ao editar
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
      alert("Preencha os campos obrigatórios corretamente.");
      return;
    }

    const estoqueData = {
      produtoId: form.produto,
      safraId: form.safra || null,
      quantidade: Number(form.quantidade),
      tipo: form.tipo as "entrada" | "saida",
      observacao: form.observacao.trim() || undefined,
      data: new Date(),
    };

    try {
      // Não validar saldo aqui pois é movimentação manual (entrada ou saída arbitrária)
      if (editarEstoque) {
        await atualizarEstoque(editarEstoque.id, estoqueData);
      } else {
        await adicionarEstoque(estoqueData);
      }

      setForm({
        produto: "",
        safra: "",
        quantidade: "",
        tipo: "entrada",
        observacao: "",
      });

      onSuccess();
    } catch (error) {
      alert("Erro ao salvar movimentação de estoque.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-md bg-white"
    >
      <h2 className="text-lg font-bold">
        {editarEstoque ? "Editar Movimentação" : "Nova Movimentação"}
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
          min={1}
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
          placeholder="Opcional"
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">
          {editarEstoque ? "Salvar" : "Cadastrar"}
        </button>

        {editarEstoque && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
