'use client';
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { useEffect, useState } from "react";

interface ProdutoSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  name?: string; // Permite customizar o nome do select, útil para integração com formulários
}

export default function ProdutoSelect({ value, onChange, required, name = 'produto' }: ProdutoSelectProps) {
  const [produtos, setProdutos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProdutos() {
      const lista = await listarProdutos();
      setProdutos(lista);
    }
    fetchProdutos();
  }, []);

  return (
    <select
      name={name} // ESSENCIAL para que handleChange atualize o estado correto no ProducoesForm
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">Selecione um produto</option>
      {produtos.map((p) => (
        <option key={p.id} value={p.id}>
          {p.nome} {p.categoria ? `(${p.categoria})` : ""}
        </option>
      ))}
    </select>
  );
}
