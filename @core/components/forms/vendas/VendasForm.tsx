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
  editarVenda?: {
    id: string;
    produto: string;
    quantidade: number;
    data: string | Date;
    fazenda: string;
    valor: string;
    safra?: string;
  };
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
      let dataFormatada = "";
      if (
        editarVenda.data &&
        typeof editarVenda.data === "object" &&
        "seconds" in editarVenda.data &&
        typeof (editarVenda.data as { seconds?: unknown }).seconds === "number"
      ) {
        dataFormatada = new Date(
          (editarVenda.data as { seconds: number }).seconds * 1000
        )
          .toISOString()
          .split("T")[0];
      } else if (
        typeof editarVenda.data === "string" ||
        editarVenda.data instanceof Date
      ) {
        dataFormatada = new Date(editarVenda.data).toISOString().split("T")[0];
      }

      setForm({
        produto: editarVenda.produto,
        quantidade: String(editarVenda.quantidade),
        valor: String(editarVenda.valor),
        data: dataFormatada,
        fazenda: editarVenda.fazenda,
        safra: editarVenda.safra || "",
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

  // Atualiza saldo do estoque ao selecionar produto, fazenda e safra
  useEffect(() => {
    async function fetchSaldo() {
      if (form.produto && form.fazenda && form.safra) {
        const saldo = await consultarSaldoEstoque(
          form.produto,
          form.safra,
          form.fazenda
        );
        setSaldoEstoque(saldo);
      } else {
        setSaldoEstoque(null);
      }
    }

    fetchSaldo();
  }, [form.produto, form.fazenda, form.safra]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return alert("Usuário não autenticado");

    if (!form.data || isNaN(new Date(form.data).getTime())) {
      alert("Data inválida");
      return;
    }

    if (!form.produto || !form.fazenda || !form.safra) {
      alert("Produto, safra e fazenda são obrigatórios.");
      return;
    }

    const quantidadeVendida = Number(form.quantidade);
    const saldoAtual = await consultarSaldoEstoque(
      form.produto,
      form.safra,
      form.fazenda
    );

    if (quantidadeVendida > saldoAtual) {
      return alert(
        `Quantidade indisponível em estoque da fazenda. Saldo atual: ${saldoAtual}`
      );
    }

    const dataBr = new Date(`${form.data}T00:00:00-03:00`);
    const novaVenda = {
      produto: form.produto,
      quantidade: quantidadeVendida,
      valor: Number(form.valor),
      uid: user.uid,
      data: dataBr,
      fazenda: form.fazenda,
      safra: form.safra,
    };

    try {
      if (editarVenda) {
        await atualizarVenda(editarVenda.id, novaVenda);
        await registrarVendaEstoque({
          id: editarVenda.id,
          itens: [
            {
              produtoId: form.produto,
              quantidade: quantidadeVendida,
              safraId: form.safra,
              fazendaId: form.fazenda,
            },
          ],
        });
      } else {
        const docRef = await adicionarVenda(novaVenda);
        await registrarVendaEstoque({
          id: docRef.id,
          itens: [
            {
              produtoId: form.produto,
              quantidade: quantidadeVendida,
              safraId: form.safra,
              fazendaId: form.fazenda,
            },
          ],
        });
      }

      setForm({
        produto: "",
        quantidade: "",
        valor: "",
        data: "",
        fazenda: "",
        safra: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar venda:", error);
      alert("Erro ao salvar venda");
    }
  };

  // Nova função para excluir venda e repor estoque
  const handleExcluirVenda = async () => {
    if (!editarVenda) return;
    const confirm = window.confirm(
      "Tem certeza que deseja excluir esta venda? O estoque será reabastecido."
    );
    if (!confirm) return;

    try {
      // Construir objeto de venda para reabastecer estoque
      const vendaParaRepor = {
        id: editarVenda.id,
        itens: [
          {
            produtoId: editarVenda.produto,
            quantidade: editarVenda.quantidade,
            safraId: editarVenda.safra || null,
            fazendaId: editarVenda.fazenda || null,
          },
        ],
      };

      // Reabastecer estoque
      await reabastecerEstoqueVenda(vendaParaRepor);

      // Excluir venda
      await excluirVenda(editarVenda.id);

      onSuccess();
    } catch (error) {
      console.error("Erro ao excluir venda:", error);
      alert("Erro ao excluir venda");
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

      {saldoEstoque !== null && (
        <p
          style={{
            fontSize: "0.9rem",
            color: saldoEstoque <= 0 ? "red" : "green",
          }}
        >
          Saldo em estoque da fazenda: {saldoEstoque}
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

      <button type="submit">{editarVenda ? "Salvar" : "Cadastrar"}</button>
      {editarVenda && (
        <>
          <button type="button" onClick={onCancelEdit}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleExcluirVenda}
            style={{ marginLeft: 10, backgroundColor: "red", color: "white" }}
          >
            Excluir Venda
          </button>
        </>
      )}
    </form>
  );
}
