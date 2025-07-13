"use client";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { useEffect, useState } from "react";
import SelectComponent from "@/@core/components/ui/select/Select.component";
import Loading from "@/pages/loading";
interface Produto {
  id: string;
  nome: string;
  categoria?: string;
}

interface ProdutoSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  name?: string;
  label?: string;
}

export default function ProdutoSelect({
  value,
  onChange,
  required = false,
  name = "produto",
  label,
}: ProdutoSelectProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    try {
      setLoading(true);
      const lista = await listarProdutos();
      // Garante que cada produto tenha as propriedades exigidas pela interface Produto
      const produtosCompletos: Produto[] = lista.map((item: any) => ({
        id: item.id,
        nome: item.nome ?? "",
        categoria: item.categoria,
      }));
      setProdutos(produtosCompletos);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError("Falha ao carregar os produtos");
    } finally {
      setLoading(false);
    }
  }

  // Prepara os produtos com labels formatados
  const produtosFormatados = produtos.map((produto) => ({
    ...produto,
    // Cria uma propriedade formatada para exibição
    formattedLabel: `${produto.nome}${
      produto.categoria ? ` (${produto.categoria})` : ""
    }`,
  }));

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <SelectComponent
      id={name}
      value={value}
      options={produtosFormatados}
      onChange={onChange}
      placeholder="Selecione um produto"
      required={required}
      ariaLabel="Selecionar produto"
      valueKey="id"
      labelKey="formattedLabel"
      label={label}
      name={name}
    />
  );
}
