'use client';
import { useEffect, useState } from "react";
import { useAuthStore } from "@/@core/store/authStore";
import FazendaSelect from "../fazendas/FazendaSelect";
import ProdutoSelect from "../produtos/ProdutoSelect";
import SafraSelect from "../safras/SafraSelect";
import {
  registrarProducaoEstoque,
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
  });

  const [saldoEstoque, setSaldoEstoque] = useState<number | null>(null);

  // Consulta o saldo somente se os três campos forem preenchidos
  const fetchSaldoEstoque = async (
    produto: string,
    safra: string | null,
    fazenda: string | null
  ) => {
    const safeSafra = safra?.trim() || null;
    const safeFazenda = fazenda?.trim() || null;

    if (produto && safeSafra && safeFazenda) {
      const saldo = await consultarSaldoEstoque(
        produto,
        safeSafra,
        safeFazenda
      );
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
      });
    } else {
      setForm({
        produto: "",
        quantidade: "",
        fazenda: "",
        safra: "",
      });
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

  const limparCamposVazios = (obj: Record<string, any>) => {
    const novoObj: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        !(typeof value === "string" && value.trim() === "")
      ) {
        novoObj[key] = value;
      }
    });
    return novoObj;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Usuário não autenticado");

    if (!form.produto.trim()) return alert("Produto é obrigatório");
    if (!form.safra.trim()) return alert("Safra é obrigatória");
    if (!form.fazenda.trim()) return alert("Fazenda é obrigatória");

    const quantidade = Number(form.quantidade);
    if (!quantidade || quantidade <= 0) return alert("Quantidade inválida");

    const novaProducaoRaw = {
      ...form,
      quantidade,
      uid: user.uid,
    };

    const novaProducao = limparCamposVazios(novaProducaoRaw);

    try {
      if (editarProducao) {
        await atualizarProducao(editarProducao.id, novaProducao);
      } else {
        const docRef = await adicionarProducao(novaProducao);

        await registrarProducaoEstoque({
          id: docRef.id,
          itens: [
            {
              produtoId: form.produto,
              quantidade,
              safraId: form.safra,
              fazendaId: form.fazenda,
            },
          ],
        });
      }

      // Atualiza o saldo logo após salvar
      await fetchSaldoEstoque(form.produto, form.safra, form.fazenda);

      // Limpa apenas quantidade
      setForm({
        produto: "",
        quantidade: "",
        fazenda: "",
        safra: "",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Erro ao salvar produção:", error);
      alert(`Erro ao salvar produção: ${error.message || error}`);
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
        <p style={{ fontSize: "0.9rem", color: "blue" }}>
          Saldo atual do estoque: {saldoEstoque}
        </p>
      ) : (
        <p style={{ fontSize: "0.9rem", color: "gray" }}>
          Preencha produto, safra e fazenda para consultar o saldo
        </p>
      )}

      <input
        type="number"
        name="quantidade"
        value={form.quantidade}
        onChange={handleChange}
        placeholder="Quantidade"
        required
      />

      <button type="submit">{editarProducao ? "Salvar" : "Cadastrar"}</button>
      {editarProducao && (
        <button type="button" onClick={onCancelEdit}>
          Cancelar
        </button>
      )}
    </form>
  );
}
