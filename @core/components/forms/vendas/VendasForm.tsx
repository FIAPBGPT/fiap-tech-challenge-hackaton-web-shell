import { useEffect, useState } from "react";
import { useAuthStore } from "@/@core/store/authStore";
import FazendaSelect from "../fazendas/FazendaSelect";
import ProdutoSelect from "../produtos/ProdutoSelect";
import SafraSelect from "../safras/SafraSelect";
import { Container } from "@/@theme/custom/Forms.styles";
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
import InputComponent from "../../ui/input";
import ButtonComponent from "../../ui/Button";
import { useFazendaStore } from "@/@core/store/fazendaStore";
import { useProdutoStore } from "@/@core/store/produtoStore";

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
      const data = editarVenda.data?.seconds
        ? new Date(editarVenda.data.seconds * 1000)
        : new Date(editarVenda.data);

      if (editarVenda.itens) {
        const itemVenda = editarVenda.itens?.[0] || {};
        let fazendaId = itemVenda.fazendaId;
        // If only fazenda name is provided, find its id (assuming you have a way to get fazendas list)
        if (!fazendaId && itemVenda.fazenda) {
          // Example: fetch fazendas from localStorage or context/store
          const fazendas = useFazendaStore.getState().fazendas || [];
          const foundFazenda = fazendas.find(
            (f: any) => f.nome === itemVenda.fazenda
          );
          fazendaId = foundFazenda?.id || "";
        }
        // Handle date in "12/07/2025" format or timestamp
        let formattedDate = "";
        if (
          typeof itemVenda.data === "string" &&
          itemVenda.data.includes("/")
        ) {
          // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
          const [day, month, year] = itemVenda.data.split("/");
          formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
        } else if (data instanceof Date && !isNaN(data.getTime())) {
          formattedDate = data.toISOString().split("T")[0];
        }

        setForm({
          produto: itemVenda.produtoId,
          quantidade: String(itemVenda.quantidade),
          valor: String(itemVenda.valor),
          data: formattedDate,
          fazenda: fazendaId,
          safra: itemVenda.safraId || itemVenda.safra || "",
        });
      } else {
        let fazendaId = editarVenda.fazendaId;
        // If only fazenda name is provided, find its id
        if (!fazendaId && editarVenda.fazenda) {
          // Example: fetch fazendas from context/store
          const fazendas = useFazendaStore.getState().fazendas || [];
          const foundFazenda = fazendas.find(
            (f: any) => f.nome === editarVenda.fazenda
          );
          fazendaId = foundFazenda?.id || "";
        }
        let produtoId = editarVenda.produtoId;
        // If only produto name is provided, find its id
        if (!produtoId && editarVenda.produto) {
          // Example: fetch produtos from context/store
          const produtos = useProdutoStore.getState().produtos || [];
          const foundProduto = produtos.find(
            (f: any) => f.nome === editarVenda.produto
          );
          produtoId = foundProduto?.id || "";
        }
        // Handle date in "12/07/2025" format or timestamp
        let formattedDate = "";
        if (
          typeof editarVenda.data === "string" &&
          editarVenda.data.includes("/")
        ) {
          // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
          const [day, month, year] = editarVenda.data.split("/");
          formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
        } else if (data instanceof Date && !isNaN(data.getTime())) {
          formattedDate = data.toISOString().split("T")[0];
        }

        setForm({
          produto: produtoId,
          quantidade: String(editarVenda.quantidade),
          valor: String(editarVenda.valor),
          data: formattedDate,
          fazenda: fazendaId,
          safra: editarVenda.safraId || editarVenda.safra || "",
        });
      }
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

  const handleChange = (name: string, value: any) => {
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
    <Container>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div id="containers-legend">
            <legend className="title-form">
              {editarVenda ? "Editar Venda" : "Cadastrar Venda"}
            </legend>
          </div>

          <ProdutoSelect
            value={form.produto}
            onChange={(value) => handleChange("produto", value)}
            name="produto"
            required
          />
          <SafraSelect
            value={form.safra}
            onChange={(value) => handleChange("safra", value)}
            name="safra"
            required
          />
          <FazendaSelect
            id="filtro-fazenda"
            value={form.fazenda}
            onChange={(value) => handleChange("fazenda", value)}
            name="fazenda"
            required={false}
          />

          {saldoEstoque !== null && (
            <p
              className="text-sm"
              style={{ color: saldoEstoque <= 0 ? "red" : "green" }}
            >
              Saldo atual: {saldoEstoque}
            </p>
          )}

          <InputComponent
            id="quantidade"
            type="number"
            value={form.quantidade}
            onChange={(e) => handleChange("quantidade", e.target.value)}
            placeholder="Quantidade"
            required
            name={"quantidade"}
          />

          <InputComponent
            id="valor"
            type="number"
            value={form.valor}
            onChange={(e) => handleChange("valor", e.target.value)}
            placeholder="Valor"
            required
            name={"valor"}
          />

          <InputComponent
            id="data"
            type="date"
            value={form.data}
            onChange={(e) => handleChange("data", e.target.value)}
            placeholder={"Selecione a data"}
            required={true}
          />

          <div className="div-buttons">
            <ButtonComponent
              type="submit"
              id="btn-cadastrar"
              variant="secondary"
              label={editarVenda ? "Salvar" : "Cadastrar"}
              onClick={() => {}}
            />

            {editarVenda && (
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
