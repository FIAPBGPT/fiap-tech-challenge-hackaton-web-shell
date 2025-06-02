'use client';
import { useEffect, useState } from "react";
import { useAuthStore } from "@/@core/store/authStore";
import FazendaSelect from "../fazendas/FazendaSelect";
import SafraSelect from "../safras/SafraSelect";
import ProdutoSelect from "../produtos/ProdutoSelect";
import { adicionarMeta, atualizarMeta } from "@/@core/services/firebase/firebaseService";

interface MetaFormProps {
  onSuccess: () => void;
  editarMeta?: {
    id: string;
    produto: string;
    valor: number;
    safra: string;
    fazenda: string;
  };
  onCancelEdit?: () => void;
}

export default function MetaForm({ onSuccess, editarMeta, onCancelEdit }: MetaFormProps) {
  const user = useAuthStore((state) => state.user);

  const [form, setForm] = useState({
    produto: "",
    valor: "",
    safra: "",
    fazenda: "",
  });

  useEffect(() => {
    if (editarMeta) {
      setForm({
        produto: editarMeta.produto,
        valor: String(editarMeta.valor),
        safra: editarMeta.safra,
        fazenda: editarMeta.fazenda,
      });
    } else {
      setForm({
        produto: "",
        valor: "",
        safra: "",
        fazenda: "",
      });
    }
  }, [editarMeta]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Usuário não autenticado");
      return;
    }

    const novaMeta = {
      produto: form.produto,
      valor: Number(form.valor),
      safra: form.safra,
      fazenda: form.fazenda,
      uid: user.uid,
    };

    try {
      if (editarMeta) {
        await atualizarMeta(editarMeta.id, novaMeta);
      } else {
        await adicionarMeta(novaMeta);
      }

      setForm({ produto: "", valor: "", safra: "", fazenda: "" });
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar meta:", error);
      alert("Erro ao salvar meta");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ProdutoSelect
        name="produto"
        value={form.produto}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="valor"
        value={form.valor}
        onChange={handleChange}
        placeholder="Valor da meta"
        min={0}
        required
      />

      <SafraSelect
        name="safra"
        value={form.safra}
        onChange={handleChange}
        required
      />

      <FazendaSelect
        name="fazenda"
        value={form.fazenda}
        onChange={handleChange}
      />

      <button type="submit">{editarMeta ? "Salvar" : "Cadastrar"}</button>
      {editarMeta && (
        <button type="button" onClick={onCancelEdit}>Cancelar</button>
      )}
    </form>
  );
}
