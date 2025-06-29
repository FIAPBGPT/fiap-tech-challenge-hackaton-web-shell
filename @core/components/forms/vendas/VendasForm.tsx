import { useEffect, useState } from "react";
import { useAuthStore } from "@/@core/store/authStore";
import FazendaSelect from "../fazendas/FazendaSelect";
import ProdutoSelect from "../produtos/ProdutoSelect";
import SafraSelect from "../safras/SafraSelect";
import {
  consultarSaldoEstoque,
  registrarVendaEstoque,
  reabastecerEstoqueVenda,
} from "@/@core/services/firebase/pages/estoqueService";
import {
  adicionarVenda,
  atualizarVenda,
  excluirVenda,
} from "@/@core/services/firebase/pages/vendasService";

interface VendaFormProps {
  onSuccess: () => void;
  editarVenda?: any;
  onCancelEdit?: () => void;
}

export default function VendaForm({
  onSuccess,
  editarVenda,
  onCancelEdit,
}: VendaFormProps) {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    produto: "",
    quantidade: "",
    valor: "",
    data: "",
    fazenda: "",
    safra: "",
  });
  const [saldoEstoque, setSaldoEstoque] = useState<number | null>(null);

  useEffect(() => {
    if (editarVenda) {
      console.log("Editando venda:", editarVenda);
      const data = editarVenda.data?.seconds
        ? new Date(editarVenda.data.seconds * 1000)
        : new Date(editarVenda.data);

      const itemVenda = editarVenda.itens?.[0] || {};

      setForm({
        produto: itemVenda.produtoId,
        quantidade: String(itemVenda.quantidade),
        valor: String(itemVenda.valor),
        data: data.toISOString().split("T")[0],
        fazenda: itemVenda.fazendaId,
        safra: itemVenda.safraId || "",
      });
    } else {
      setForm({
        produto: "",
        quantidade: "",
        valor: "",
        data: "",
        fazenda: "",
        safra: "",
      });
    }
  }, [editarVenda]);

  useEffect(() => {
    if (form.produto && form.safra && form.fazenda) {
      consultarSaldoEstoque(form.produto, form.safra, form.fazenda).then(
        setSaldoEstoque
      );
    } else {
      setSaldoEstoque(null);
    }
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

    const quantidade = Number(form.quantidade);
    const valor = Number(form.valor);
    if (
      !form.produto ||
      !form.safra ||
      !form.fazenda ||
      !form.data ||
      quantidade <= 0 ||
      valor < 0
    ) {
      return alert("Todos os campos devem ser preenchidos corretamente.");
    }

    const saldoAtual = await consultarSaldoEstoque(
      form.produto,
      form.safra,
      form.fazenda
    );
    if (quantidade > saldoAtual) {
      return alert(`Estoque insuficiente. Saldo atual: ${saldoAtual}`);
    }

    const novaVenda = {
      itens: [
        {
          produtoId: form.produto,
          quantidade,
          safraId: form.safra,
          fazendaId: form.fazenda,
          valor,
          uid: user.uid,
        },
      ],
      data: new Date(`${form.data}T00:00:00-03:00`),
    };

    try {
      if (editarVenda) {
        await atualizarVenda(editarVenda.id, novaVenda);
        await registrarVendaEstoque({
          id: editarVenda.id,
          itens: novaVenda.itens,
        });
      } else {
        const docRef = await adicionarVenda(novaVenda);
        await registrarVendaEstoque({
          id: docRef.id,
          itens: novaVenda.itens,
        });
      }
      onSuccess();
      setForm({
        produto: "",
        quantidade: "",
        valor: "",
        data: "",
        fazenda: "",
        safra: "",
      });
    } catch (err) {
      console.error("Erro ao salvar venda:", err);
      alert("Erro ao salvar venda");
    }
  };

  const handleExcluirVenda = async () => {
    if (!editarVenda) return;
    const confirm = window.confirm(
      "Deseja excluir esta venda e reabastecer o estoque?"
    );
    if (!confirm) return;

    try {
      await reabastecerEstoqueVenda({
        id: editarVenda.id,
        itens: editarVenda.itens,
      });
      await excluirVenda(editarVenda.id);
      onSuccess();
    } catch (err) {
      console.error("Erro ao excluir venda:", err);
      alert("Erro ao excluir venda");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-md bg-white"
    >
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

      {saldoEstoque !== null && (
        <p
          className="text-sm"
          style={{ color: saldoEstoque <= 0 ? "red" : "green" }}
        >
          Saldo atual: {saldoEstoque}
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
      <input
        type="number"
        name="valor"
        value={form.valor}
        onChange={handleChange}
        placeholder="Valor"
        required
      />
      <input
        type="date"
        name="data"
        value={form.data}
        onChange={handleChange}
        required
      />

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">
          {editarVenda ? "Salvar" : "Cadastrar"}
        </button>
        {editarVenda && (
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleExcluirVenda}
              className="btn btn-danger"
            >
              Excluir
            </button>
          </>
        )}
      </div>
    </form>
  );
}
