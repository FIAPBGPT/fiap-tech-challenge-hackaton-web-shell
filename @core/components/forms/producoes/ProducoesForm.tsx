// ProducoesForm.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/@core/store/authStore";
import FazendaSelect from "../fazendas/FazendaSelect";
import ProdutoSelect from "../produtos/ProdutoSelect";
import SafraSelect from "../safras/SafraSelect";
import {
  registrarProducaoEstoque,
  removerProducaoEstoque,
  consultarSaldoEstoque,
} from "@/@core/services/firebase/pages/estoqueService";
import {
  adicionarProducao,
  atualizarProducao,
} from "@/@core/services/firebase/pages/producoesService";

interface ProducoesFormProps {
  onSuccess: () => void;
  editarProducao?: {
    id: string;
    produto: string;
    quantidade: number;
    fazenda: string;
    safra: string;
    data?: string;
  };
  onCancelEdit?: () => void;
}

export default function ProducoesForm({
  onSuccess,
  editarProducao,
  onCancelEdit,
}: ProducoesFormProps) {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    produto: "",
    quantidade: "",
    fazenda: "",
    safra: "",
    data: "",
  });

  const [saldoEstoque, setSaldoEstoque] = useState<number | null>(null);
  const [quantidadeAnterior, setQuantidadeAnterior] = useState<number>(0);

  const fetchSaldoEstoque = async (
    produto: string,
    safra: string,
    fazenda: string
  ) => {
    if (produto && safra && fazenda) {
      const saldo = await consultarSaldoEstoque(produto, safra, fazenda);
      setSaldoEstoque(saldo);
    } else {
      setSaldoEstoque(null);
    }
  };

  useEffect(() => {
    if (editarProducao) {
      setForm({
        produto: editarProducao.produto,
        quantidade: String(editarProducao.quantidade),
        fazenda: editarProducao.fazenda,
        safra: editarProducao.safra,
        data: editarProducao.data || "",
      });
      setQuantidadeAnterior(editarProducao.quantidade);
    } else {
      setForm({
        produto: "",
        quantidade: "",
        fazenda: "",
        safra: "",
        data: "",
      });
      setQuantidadeAnterior(0);
    }
  }, [editarProducao]);

  useEffect(() => {
    fetchSaldoEstoque(form.produto, form.safra, form.fazenda);
  }, [form.produto, form.safra, form.fazenda]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Usuário não autenticado");

    const { produto, safra, fazenda, quantidade } = form;
    const quantidadeNum = Number(quantidade);

    if (!produto || !safra || !fazenda || quantidadeNum <= 0) {
      alert("Todos os campos devem ser preenchidos corretamente");
      return;
    }

    // Set datetime now in ISO format
    const data = new Date().toISOString();

    const payload = {
      produto,
      safra,
      fazenda,
      quantidade: quantidadeNum,
      uid: user.uid,
      data,
    };

    try {
      if (editarProducao) {
        // Corrige o estoque antigo
        await removerProducaoEstoque({
          id: editarProducao.id,
          itens: [
            {
              produtoId: editarProducao.produto,
              quantidade: quantidadeAnterior,
              safraId: editarProducao.safra,
              fazendaId: editarProducao.fazenda,
            },
          ],
        });

        // Atualiza a produção
        await atualizarProducao(editarProducao.id, payload);

        // Registra novo estoque
        await registrarProducaoEstoque({
          id: editarProducao.id,
          itens: [
            {
              produtoId: produto,
              quantidade: quantidadeNum,
              safraId: safra,
              fazendaId: fazenda,
            },
          ],
        });
      } else {
        const docRef = await adicionarProducao(payload);

        await registrarProducaoEstoque({
          id: docRef.id,
          itens: [
            {
              produtoId: produto,
              quantidade: quantidadeNum,
              safraId: safra,
              fazendaId: fazenda,
            },
          ],
        });
      }

      setForm({
        produto: "",
        quantidade: "",
        fazenda: "",
        safra: "",
        data: "",
      });
      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert("Erro ao salvar a produção: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ProdutoSelect
        value={form.produto}
        onChange={handleChange}
        name="produto"
        required
      />
      <SafraSelect
        value={form.safra}
        onChange={handleChange}
        name="safra"
        required
      />
      <FazendaSelect
        value={form.fazenda}
        onChange={handleChange}
        name="fazenda"
      />

      {saldoEstoque !== null ? (
        <p style={{ color: "green" }}>Saldo atual do estoque: {saldoEstoque}</p>
      ) : (
        <p style={{ color: "gray" }}>
          Selecione produto, safra e fazenda para ver saldo.
        </p>
      )}

      <input
        type="number"
        name="quantidade"
        value={form.quantidade}
        onChange={handleChange}
        placeholder="Quantidade"
        required
        min={1}
      />

      {/* Hidden input to show the datetime now if needed */}
      <input type="hidden" name="data" value={form.data} />

      <button type="submit">
        {editarProducao ? "Atualizar Produção" : "Registrar Produção"}
      </button>

      {editarProducao && (
        <button type="button" onClick={onCancelEdit}>
          Cancelar
        </button>
      )}
    </form>
  );
}
